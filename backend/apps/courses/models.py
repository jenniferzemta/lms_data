from django.db import models
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
