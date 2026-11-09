from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _


class Track(models.Model):
    """
    Curriculum track (e.g., Excel, SQL, Python, Power BI, GitHub).
    """

    class Tool(models.TextChoices):
        EXCEL = 'EXCEL', _('Excel')
        POWERBI = 'POWERBI', _('Power BI')
        SQL = 'SQL', _('SQL')
        PYTHON = 'PYTHON', _('Python')
        GITHUB = 'GITHUB', _('GitHub')

    name = models.CharField(max_length=150, verbose_name=_('Track Name'))
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True, verbose_name=_('Description'))
    tool = models.CharField(max_length=20, choices=Tool.choices, default=Tool.EXCEL)
    icon = models.CharField(max_length=50, default='book-open', help_text=_('Lucide icon name'))
    order = models.PositiveIntegerField(default=1)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name = _('Track')
        verbose_name_plural = _('Tracks')

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Course(models.Model):
    """
    Learning course containing structured modules and lessons.
    """

    class Level(models.TextChoices):
        BEGINNER = 'BEGINNER', _('Débutant')
        INTERMEDIATE = 'INTERMEDIATE', _('Intermédiaire')
        ADVANCED = 'ADVANCED', _('Avancé')

    class PriceTier(models.TextChoices):
        FREE = 'FREE', _('Découverte (Gratuit)')
        ESSENTIAL = 'ESSENTIAL', _('Essentiel')
        PRO = 'PRO', _('Professionnel')
        EXPERT = 'EXPERT', _('Expert')

    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=255, verbose_name=_('Course Title'))
    slug = models.SlugField(max_length=255, unique=True)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    duration_hours = models.PositiveIntegerField(default=10, help_text=_('Estimated hours'))
    price_tier = models.CharField(max_length=20, choices=PriceTier.choices, default=PriceTier.FREE)
    image_url = models.URLField(blank=True, default='')
    order = models.PositiveIntegerField(default=1)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = _('Course')
        verbose_name_plural = _('Courses')

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def total_modules_count(self) -> int:
        return self.modules.filter(is_published=True).count()

    @property
    def total_lessons_count(self) -> int:
        return Lesson.objects.filter(module__course=self, is_published=True).count()


class Module(models.Model):
    """
    Course module / chapter grouping sequential lessons.
    """

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255, verbose_name=_('Module Title'))
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = _('Module')
        verbose_name_plural = _('Modules')

    def __str__(self) -> str:
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    """
    Individual lesson or learning activity within a module.
    """

    class LessonType(models.TextChoices):
        TEXT = 'TEXT', _('Texte riche / Article')
        VIDEO = 'VIDEO', _('Vidéo')
        AUDIO = 'AUDIO', _('Audio')
        PDF = 'PDF', _('Document PDF')
        CODE = 'CODE', _('Exercice de code / Formule')
        QUIZ = 'QUIZ', _('Quiz')
        LAB = 'LAB', _('Laboratoire pratique')

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255, verbose_name=_('Default Title'))
    slug = models.SlugField(max_length=255)
    lesson_type = models.CharField(
        max_length=20,
        choices=LessonType.choices,
        default=LessonType.TEXT,
    )
    duration_minutes = models.PositiveIntegerField(default=10, help_text=_('Estimated minutes to complete'))
    is_free_preview = models.BooleanField(
        default=False,
        help_text=_('If true, accessible without an active paid subscription'),
    )
    order = models.PositiveIntegerField(default=1)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        unique_together = ('module', 'slug')
        verbose_name = _('Lesson')
        verbose_name_plural = _('Lessons')

    def __str__(self) -> str:
        return f"{self.module.title} - {self.title}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class LessonTranslation(models.Model):
    """
    Bilingual localized content for a lesson (FR / EN).
    Conforms to MASTER_PROMPT §12 (status: absent | draft | reviewed).
    """

    class Language(models.TextChoices):
        FR = 'fr', _('Français')
        EN = 'en', _('English')

    class Status(models.TextChoices):
        ABSENT = 'absent', _('Absent')
        DRAFT = 'draft', _('Brouillon')
        REVIEWED = 'reviewed', _('Relu et Validé')

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='translations')
    language = models.CharField(max_length=5, choices=Language.choices, default=Language.FR)
    title = models.CharField(max_length=255)
    summary = models.TextField(blank=True, help_text=_('Short summary or learning outcomes'))
    content = models.TextField(
        blank=True,
        help_text=_('Rich formatted markdown content, African datasets in FCFA, examples'),
    )
    video_url = models.URLField(blank=True, default='')
    audio_url = models.URLField(blank=True, default='')
    pdf_url = models.URLField(blank=True, default='')
    code_snippet = models.TextField(blank=True, default='', help_text=_('Code or formula sample'))
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.REVIEWED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('lesson', 'language')
        verbose_name = _('Lesson Translation')
        verbose_name_plural = _('Lesson Translations')

    def __str__(self) -> str:
        return f"{self.lesson.title} [{self.language.upper()}] ({self.status})"


class LessonAttachment(models.Model):
    """
    Downloadable exercise file, dataset, template, or solution attached to a lesson (F1.6).
    Designed for low-bandwidth learners: records byte sizes and displays
    human-friendly sizes (Ko/Mo) so learners know data usage before downloading.
    """

    class AttachmentType(models.TextChoices):
        STARTER = 'STARTER', _('Fichier de départ / Exercice')
        SOLUTION = 'SOLUTION', _('Fichier corrigé')
        DATASET = 'DATASET', _('Jeu de données')
        CHEATSHEET = 'CHEATSHEET', _('Aide-mémoire / Fiche résumé')
        OTHER = 'OTHER', _('Autre ressource')

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='attachments')
    title = models.CharField(max_length=255, verbose_name=_('Titre du document'))
    description = models.TextField(blank=True, verbose_name=_('Description ou instructions'))
    attachment_type = models.CharField(
        max_length=20,
        choices=AttachmentType.choices,
        default=AttachmentType.STARTER,
    )
    file = models.FileField(upload_to='courses/attachments/%Y/%m/', blank=True, null=True)
    external_url = models.URLField(blank=True, default='', help_text=_('URL directe de téléchargement alternative'))
    file_format = models.CharField(
        max_length=20,
        blank=True,
        help_text=_('Format ou extension (ex: xlsx, csv, pbix, sql, py, pdf, zip)'),
    )
    file_size_bytes = models.PositiveIntegerField(default=0, help_text=_('Taille en octets'))
    order = models.PositiveIntegerField(default=1)
    is_free_preview = models.BooleanField(
        default=False,
        help_text=_('Accessible en aperçu gratuit sans abonnement actif'),
    )
    download_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = _('Pièce jointe de leçon')
        verbose_name_plural = _('Pièces jointes de leçons')

    def __str__(self) -> str:
        return f"{self.lesson.title} - {self.title} ({self.file_format or 'file'})"

    @property
    def file_size_display(self) -> str:
        """
        Formats file size into human-friendly Ko or Mo for low-bandwidth mobile users.
        """
        bytes_val = self.file_size_bytes
        if not bytes_val and self.file:
            try:
                bytes_val = self.file.size
            except Exception:
                bytes_val = 0

        if bytes_val <= 0:
            return '—'
        if bytes_val < 1024 * 1024:
            return f"{round(bytes_val / 1024, 1)} Ko"
        return f"{round(bytes_val / (1024 * 1024), 2)} Mo"

    @property
    def download_url(self) -> str:
        if self.file:
            return self.file.url
        return self.external_url

    def save(self, *args, **kwargs):
        if self.file:
            try:
                if not self.file_size_bytes:
                    self.file_size_bytes = self.file.size
                if not self.file_format and '.' in self.file.name:
                    self.file_format = self.file.name.rsplit('.', 1)[-1].lower()
            except Exception:
                pass
        elif self.external_url and not self.file_format and '.' in self.external_url.split('?')[0]:
            ext = self.external_url.split('?')[0].rsplit('.', 1)[-1].lower()
            if len(ext) <= 6:
                self.file_format = ext
        super().save(*args, **kwargs)


from django.conf import settings


class CourseEnrollment(models.Model):
    """
    Enrolls a learner in a course, tracks overall completion status and last accessed lesson.
    """
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', _('En cours')
        COMPLETED = 'COMPLETED', _('Terminé')
        PAUSED = 'PAUSED', _('En pause')

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='course_enrollments',
        verbose_name=_('Apprenant'),
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments',
        verbose_name=_('Cours'),
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        verbose_name=_('Statut'),
    )
    last_lesson = models.ForeignKey(
        'Lesson',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+',
        verbose_name=_('Dernière leçon consultée'),
    )
    progress_percentage = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Progression (%)'),
    )
    enrolled_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Date d'inscription"))
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name=_("Date d'achèvement"))
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Inscription au cours')
        verbose_name_plural = _('Inscriptions aux cours')
        unique_together = ('user', 'course')
        ordering = ('-updated_at',)

    def __str__(self) -> str:
        return f"{self.user} - {self.course} ({self.progress_percentage}%)"


class LessonProgress(models.Model):
    """
    Tracks completion and time spent on a specific lesson by an enrolled learner.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_progresses',
        verbose_name=_('Apprenant'),
    )
    lesson = models.ForeignKey(
        'Lesson',
        on_delete=models.CASCADE,
        related_name='progresses',
        verbose_name=_('Leçon'),
    )
    is_completed = models.BooleanField(
        default=False,
        verbose_name=_('Terminée'),
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Terminée le'),
    )
    last_accessed_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Dernier accès'),
    )

    class Meta:
        verbose_name = _('Progression de leçon')
        verbose_name_plural = _('Progressions de leçons')
        unique_together = ('user', 'lesson')
        ordering = ('-last_accessed_at',)

    def __str__(self) -> str:
        status_str = "Terminée" if self.is_completed else "En cours"
        return f"{self.user} - {self.lesson.title} [{status_str}]"



class Quiz(models.Model):
    """
    Assessment quiz attached to a lesson (F1.7).
    Supports diagnostic, formative, or summative purposes with passing score threshold.
    """
    class Purpose(models.TextChoices):
        DIAGNOSTIC = 'DIAGNOSTIC', _('Diagnostique (positionnement)')
        FORMATIVE = 'FORMATIVE', _('Formative (entraînement)')
        SUMMATIVE = 'SUMMATIVE', _('Sommative (certification)')

    lesson = models.OneToOneField(
        'Lesson',
        on_delete=models.CASCADE,
        related_name='quiz',
        verbose_name=_('Leçon associée'),
    )
    title = models.CharField(max_length=200, verbose_name=_('Titre du quiz'))
    description = models.TextField(blank=True, verbose_name=_('Consignes'))
    purpose = models.CharField(
        max_length=20,
        choices=Purpose.choices,
        default=Purpose.FORMATIVE,
        verbose_name=_('Finalité pédagogique'),
    )
    passing_score_percentage = models.PositiveIntegerField(
        default=70,
        verbose_name=_('Score de passage (%)'),
        help_text=_('Pourcentage minimal de bonnes réponses pour valider'),
    )
    max_attempts = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_('Nombre maximal de tentatives'),
        help_text=_('Laisser vide pour un nombre de tentatives illimité'),
    )
    is_published = models.BooleanField(default=True, verbose_name=_('Publié'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Quiz')
        verbose_name_plural = _('Quiz')

    def __str__(self) -> str:
        return f"{self.title} ({self.lesson.title}) [{self.passing_score_percentage}%]"


class QuizQuestion(models.Model):
    """
    Individual question within a quiz, linked to a Bloom cognitive level and explanation feedback (F1.7).
    """
    class QuestionType(models.TextChoices):
        SINGLE_CHOICE = 'SINGLE_CHOICE', _('Choix unique (QCM)')
        MULTIPLE_CHOICE = 'MULTIPLE_CHOICE', _('Choix multiple')
        TRUE_FALSE = 'TRUE_FALSE', _('Vrai / Faux')
        NUMERIC = 'NUMERIC', _('Numérique exact')

    class BloomLevel(models.TextChoices):
        REMEMBER = 'REMEMBER', _('Mémoriser (Conn.')
        UNDERSTAND = 'UNDERSTAND', _('Comprendre')
        APPLY = 'APPLY', _('Appliquer')
        ANALYZE = 'ANALYZE', _('Analyser')
        EVALUATE = 'EVALUATE', _('Évaluer')
        CREATE = 'CREATE', _('Créer')

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions',
        verbose_name=_('Quiz'),
    )
    prompt = models.TextField(verbose_name=_('Énoncé de la question'))
    question_type = models.CharField(
        max_length=30,
        choices=QuestionType.choices,
        default=QuestionType.SINGLE_CHOICE,
        verbose_name=_('Type de question'),
    )
    bloom_level = models.CharField(
        max_length=20,
        choices=BloomLevel.choices,
        default=BloomLevel.APPLY,
        verbose_name=_('Niveau de Bloom'),
    )
    explanation = models.TextField(
        verbose_name=_('Feedback explicatif'),
        help_text=_('Explication pédagogique détaillée affichée après la réponse pour lever les doutes'),
    )
    numeric_target = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_('Valeur numérique attendue'),
    )
    order = models.PositiveIntegerField(default=1, verbose_name=_('Ordre'))

    class Meta:
        verbose_name = _('Question de quiz')
        verbose_name_plural = _('Questions de quiz')
        ordering = ('order', 'id')

    def __str__(self) -> str:
        return f"Q{self.order}: {self.prompt[:60]}... [{self.question_type}]"


class QuizAnswerOption(models.Model):
    """
    Choice option for multiple choice, single choice, or true/false questions.
    """
    question = models.ForeignKey(
        QuizQuestion,
        on_delete=models.CASCADE,
        related_name='options',
        verbose_name=_('Question'),
    )
    text = models.CharField(max_length=255, verbose_name=_('Texte du choix'))
    is_correct = models.BooleanField(
        default=False,
        verbose_name=_('Bonne réponse'),
    )
    order = models.PositiveIntegerField(default=1, verbose_name=_('Ordre'))

    class Meta:
        verbose_name = _('Option de réponse')
        verbose_name_plural = _('Options de réponse')
        ordering = ('order', 'id')

    def __str__(self) -> str:
        marker = '✓' if self.is_correct else '✗'
        return f"[{marker}] {self.text[:50]}"


class QuizAttempt(models.Model):
    """
    Tracks a learner attempt at a quiz, including score, submitted answers and feedback (F1.7).
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_attempts',
        verbose_name=_('Apprenant'),
    )
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='attempts',
        verbose_name=_('Quiz'),
    )
    score_percentage = models.PositiveIntegerField(verbose_name=_('Score obtenu (%)'))
    is_passed = models.BooleanField(verbose_name=_('Validé'))
    submitted_answers = models.JSONField(
        default=dict,
        verbose_name=_('Réponses soumises'),
        help_text=_('{question_id: selected_option_id(s) or numeric_val}'),
    )
    feedback_summary = models.JSONField(
        default=list,
        verbose_name=_('Synthèse des feedbacks'),
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de la tentative'))

    class Meta:
        verbose_name = _('Tentative de quiz')
        verbose_name_plural = _('Tentatives de quiz')
        ordering = ('-created_at',)

    def __str__(self) -> str:
        status_str = "Validé" if self.is_passed else "Échec"
        return f"{self.user} - {self.quiz.title}: {self.score_percentage}% [{status_str}]"


class LessonNote(models.Model):
    """
    Personal notes taken by a learner during a lesson, optionally anchored to a video timecode (F1.9).
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_notes',
        verbose_name=_('Apprenant'),
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='notes',
        verbose_name=_('Leçon'),
    )
    content = models.TextField(verbose_name=_('Contenu de la note'))
    video_timestamp_seconds = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Horodatage vidéo (secondes)'),
        help_text=_('Position exacte dans la vidéo au moment de la prise de note'),
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de création'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Dernière modification'))

    class Meta:
        verbose_name = _('Note de cours')
        verbose_name_plural = _('Notes de cours')
        ordering = ('-created_at',)

    def __str__(self) -> str:
        return f"Note {self.user} sur {self.lesson.slug} [{self.video_timestamp_seconds}s]"


class LessonQuestion(models.Model):
    """
    Community peer-to-peer Q&A thread posted on a specific lesson (F1.10).
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_questions',
        verbose_name=_('Auteur'),
    )
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name='community_questions',
        verbose_name=_('Leçon'),
    )
    title = models.CharField(max_length=255, verbose_name=_('Question'))
    content = models.TextField(verbose_name=_('Détails ou code'))
    is_resolved = models.BooleanField(default=False, verbose_name=_('Résolue'))
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de publication'))
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Question de cours (Q&R)')
        verbose_name_plural = _('Questions de cours (Q&R)')
        ordering = ('-created_at',)

    def __str__(self) -> str:
        return f"[{self.lesson.slug}] {self.title}"


class LessonAnswer(models.Model):
    """
    Community or instructor answer to a lesson question (F1.10).
    """
    question = models.ForeignKey(
        LessonQuestion,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name=_('Question'),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lesson_answers',
        verbose_name=_('Auteur de la réponse'),
    )
    content = models.TextField(verbose_name=_('Contenu de la réponse'))
    is_endorsed_by_instructor = models.BooleanField(
        default=False,
        verbose_name=_('Validée par le formateur'),
        help_text=_('Coché si la réponse est certifiée exacte par un enseignant'),
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Date de la réponse'))
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Réponse Q&R')
        verbose_name_plural = _('Réponses Q&R')
        ordering = ('created_at',)

    def __str__(self) -> str:
        marker = ' [Certifié]' if self.is_endorsed_by_instructor else ''
        return f"Réponse de {self.user} à Q#{self.question.id}{marker}"



class Certificate(models.Model):
    """
    Official verifiable completion certificate issued upon 100% course progress (F1.11 & V4.5).
    Includes a unique verification code, final quiz performance score, issuance date,
    and instructor endorsement. Publicly verifiable for employers and LinkedIn.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='certificates',
        verbose_name=_('Apprenant'),
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='certificates',
        verbose_name=_('Cours certifié'),
    )
    enrollment = models.OneToOneField(
        'CourseEnrollment',
        on_delete=models.CASCADE,
        related_name='certificate',
        verbose_name=_('Inscription associée'),
    )
    certificate_code = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        verbose_name=_('Code unique infalsifiable'),
        help_text=_('Format ex: DMB-EXC-2026-9B4F vérifiable en ligne'),
    )
    final_score = models.PositiveIntegerField(
        default=100,
        verbose_name=_('Score final moyen (%)'),
        help_text=_('Score moyen obtenu aux quiz formatifs et sommatifs du cours'),
    )
    issued_at = models.DateTimeField(
        default=timezone.now,
        verbose_name=_('Date et heure de délivrance'),
    )
    instructor_name = models.CharField(
        max_length=255,
        default='Alain FOTSO / DataMboa',
        verbose_name=_('Formateur référent'),
    )
    is_revoked = models.BooleanField(
        default=False,
        verbose_name=_('Certificat révoqué'),
        help_text=_('Coché en cas de fraude ou annulation administrative'),
    )
    revocation_reason = models.TextField(
        blank=True,
        default='',
        verbose_name=_('Motif de révocation'),
    )
    skills_summary = models.TextField(
        blank=True,
        default='',
        verbose_name=_('Compétences clés validées'),
        help_text=_('Liste des compétences acquises affichées sur la vérification publique'),
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Certificat de réussite')
        verbose_name_plural = _('Certificats de réussite')
        unique_together = ('user', 'course')
        ordering = ('-issued_at',)

    def __str__(self) -> str:
        return f"Certificat [{self.certificate_code}] {self.user} - {self.course.title}"

    @property
    def recipient_name(self) -> str:
        first = getattr(self.user, 'first_name', '') or ''
        last = getattr(self.user, 'last_name', '') or ''
        full = f"{first} {last}".strip()
        return full if full else self.user.email.split('@')[0]

    @property
    def verification_url(self) -> str:
        return f"/verify/{self.certificate_code}"
