import urllib.parse
from rest_framework import serializers

from courses.models import (
    InteractiveExercise,
    ExerciseAttempt,
    Certificate,
    Course,
    CourseFeedback,
    LearningEvent,
    Lesson,
    LessonAnswer,
    LessonAttachment,
    LessonNote,
    LessonQuestion,
    LessonTranslation,
    Module,
    Quiz,
    QuizAnswerOption,
    QuizAttempt,
    QuizQuestion,
    Track,
)


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ('id', 'name', 'slug', 'description', 'tool', 'icon', 'order')


class LessonTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonTranslation
        fields = (
            'language',
            'title',
            'summary',
            'content',
            'video_url',
            'audio_url',
            'pdf_url',
            'code_snippet',
            'status',
        )


class LessonAttachmentSerializer(serializers.ModelSerializer):
    file_size_display = serializers.CharField(read_only=True)
    download_url = serializers.CharField(read_only=True)

    class Meta:
        model = LessonAttachment
        fields = (
            'id',
            'title',
            'description',
            'attachment_type',
            'file_format',
            'file_size_bytes',
            'file_size_display',
            'download_url',
            'is_free_preview',
            'download_count',
            'order',
        )


class LessonSummarySerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = (
            'id',
            'title',
            'slug',
            'lesson_type',
            'duration_minutes',
            'is_free_preview',
            'order',
        )

    def get_title(self, obj: Lesson) -> str:
        language = self.context.get('language', 'fr')
        translation = obj.translations.filter(language=language, status=LessonTranslation.Status.REVIEWED).first()
        if not translation:
            translation = obj.translations.filter(status=LessonTranslation.Status.REVIEWED).first()
        return translation.title if translation else obj.title


class ModuleCurriculumSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ('id', 'title', 'description', 'order', 'lessons')

    def get_lessons(self, obj: Module):
        published_lessons = obj.lessons.filter(is_published=True).order_by('order', 'id')
        return LessonSummarySerializer(published_lessons, many=True, context=self.context).data


class CourseListSerializer(serializers.ModelSerializer):
    tool = serializers.CharField(source='track.tool', read_only=True)
    modules_count = serializers.IntegerField(source='total_modules_count', read_only=True)
    lessons_count = serializers.IntegerField(source='total_lessons_count', read_only=True)

    class Meta:
        model = Course
        fields = (
            'id',
            'title',
            'slug',
            'subtitle',
            'level',
            'duration_hours',
            'price_tier',
            'image_url',
            'tool',
            'modules_count',
            'lessons_count',
            'order',
        )


class CourseDetailSerializer(serializers.ModelSerializer):
    tool = serializers.CharField(source='track.tool', read_only=True)
    track = TrackSerializer(read_only=True)
    modules = serializers.SerializerMethodField()
    modules_count = serializers.IntegerField(source='total_modules_count', read_only=True)
    lessons_count = serializers.IntegerField(source='total_lessons_count', read_only=True)

    class Meta:
        model = Course
        fields = (
            'id',
            'title',
            'slug',
            'subtitle',
            'description',
            'level',
            'duration_hours',
            'price_tier',
            'image_url',
            'tool',
            'track',
            'modules_count',
            'lessons_count',
            'modules',
            'target_audience',
            'prerequisites',
            'learning_outcomes',
            'pedagogical_modalities',
            'instructor_name',
            'instructor_role',
            'instructor_bio',
            'created_at',
        )

    def get_modules(self, obj: Course):
        published_modules = obj.modules.filter(is_published=True).order_by('order', 'id')
        return ModuleCurriculumSerializer(published_modules, many=True, context=self.context).data


class NavigationLessonSerializer(serializers.Serializer):
    slug = serializers.CharField()
    title = serializers.CharField()
    duration_minutes = serializers.IntegerField()
    lesson_type = serializers.CharField()


class LessonDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    course_slug = serializers.CharField()
    course_title = serializers.CharField()
    module_id = serializers.IntegerField()
    module_title = serializers.CharField()
    title = serializers.CharField()
    slug = serializers.CharField()
    lesson_type = serializers.CharField()
    duration_minutes = serializers.IntegerField()
    is_free_preview = serializers.BooleanField()
    is_completed = serializers.BooleanField(default=False)
    translation = LessonTranslationSerializer()
    is_fallback_language = serializers.BooleanField()
    attachments = LessonAttachmentSerializer(many=True)
    previous_lesson = NavigationLessonSerializer(allow_null=True)
    next_lesson = NavigationLessonSerializer(allow_null=True)


class CourseProgressSerializer(serializers.Serializer):
    is_enrolled = serializers.BooleanField()
    status = serializers.CharField()
    progress_percentage = serializers.IntegerField()
    completed_lessons_count = serializers.IntegerField()
    total_lessons_count = serializers.IntegerField()
    completed_lesson_slugs = serializers.ListField(child=serializers.CharField())
    resume_lesson = serializers.DictField(allow_null=True)


# =====================================================================
# QUIZ SERIALIZERS (F1.7)
# =====================================================================

class QuizAnswerOptionPublicSerializer(serializers.ModelSerializer):
    """
    Public options for questions. Note: is_correct is strictly omitted.
    """
    class Meta:
        model = QuizAnswerOption
        fields = ('id', 'text', 'order')


class QuizQuestionPublicSerializer(serializers.ModelSerializer):
    """
    Public quiz question prompt. Explanations are withheld until submission.
    """
    options = QuizAnswerOptionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = QuizQuestion
        fields = (
            'id',
            'prompt',
            'question_type',
            'bloom_level',
            'order',
            'options',
        )


class QuizPublicSerializer(serializers.ModelSerializer):
    """
    Public Quiz representation for active learners.
    """
    questions = QuizQuestionPublicSerializer(many=True, read_only=True)
    total_questions = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = (
            'id',
            'title',
            'description',
            'purpose',
            'passing_score_percentage',
            'max_attempts',
            'total_questions',
            'questions',
        )


class QuizSubmitSerializer(serializers.Serializer):
    answers = serializers.DictField(
        help_text="Dictionary of {question_id: answer_val_or_list}"
    )


class QuizQuestionFeedbackSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    prompt = serializers.CharField()
    question_type = serializers.CharField()
    bloom_level = serializers.CharField()
    is_correct = serializers.BooleanField()
    user_answer = serializers.JSONField(allow_null=True)
    correct_answer = serializers.CharField()
    explanation = serializers.CharField()


class QuizAttemptResponseSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField(source='id')
    score_percentage = serializers.IntegerField()
    is_passed = serializers.BooleanField()
    created_at = serializers.DateTimeField()
    feedback_summary = QuizQuestionFeedbackSerializer(many=True)


class LessonNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for learner's personal lesson notes (F1.9).
    """
    class Meta:
        model = LessonNote
        fields = (
            'id',
            'content',
            'video_timestamp_seconds',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class LessonCreateNoteSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=5000)
    video_timestamp_seconds = serializers.IntegerField(default=0, min_value=0)


class LessonAnswerSerializer(serializers.ModelSerializer):
    """
    Community reply to a lesson question (F1.10).
    """
    user_name = serializers.SerializerMethodField()
    is_instructor = serializers.SerializerMethodField()

    class Meta:
        model = LessonAnswer
        fields = (
            'id',
            'user_name',
            'is_instructor',
            'content',
            'is_endorsed_by_instructor',
            'created_at',
        )

    def get_user_name(self, obj: LessonAnswer) -> str:
        first = getattr(obj.user, 'first_name', '')
        last = getattr(obj.user, 'last_name', '')
        if first or last:
            return f"{first} {last}".strip()
        return obj.user.email.split('@')[0]

    def get_is_instructor(self, obj: LessonAnswer) -> bool:
        return getattr(obj.user, 'is_staff', False) or getattr(obj.user, 'role', '') in ('ADMIN', 'INSTRUCTOR')


class LessonQuestionSerializer(serializers.ModelSerializer):
    """
    Community question thread on a lesson (F1.10).
    """
    user_name = serializers.SerializerMethodField()
    answers = LessonAnswerSerializer(many=True, read_only=True)
    answers_count = serializers.IntegerField(source='answers.count', read_only=True)

    class Meta:
        model = LessonQuestion
        fields = (
            'id',
            'title',
            'content',
            'user_name',
            'is_resolved',
            'created_at',
            'answers_count',
            'answers',
        )

    def get_user_name(self, obj: LessonQuestion) -> str:
        first = getattr(obj.user, 'first_name', '')
        last = getattr(obj.user, 'last_name', '')
        if first or last:
            return f"{first} {last}".strip()
        return obj.user.email.split('@')[0]


class LessonCreateQuestionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    content = serializers.CharField(max_length=10000)


class LessonCreateAnswerSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=10000)




# =====================================================================
# CERTIFICATE SERIALIZERS (F1.11 & V4.5)
# =====================================================================

class CertificatePublicSerializer(serializers.ModelSerializer):
    """
    Public serialization for verifying authenticity of an issued certificate (F1.11 & V4.5).
    """
    recipient_name = serializers.CharField(read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)
    track_name = serializers.CharField(source='course.track.name', read_only=True)
    verification_url = serializers.CharField(read_only=True)

    class Meta:
        model = Certificate
        fields = (
            'certificate_code',
            'recipient_name',
            'course_title',
            'course_slug',
            'track_name',
            'final_score',
            'issued_at',
            'instructor_name',
            'skills_summary',
            'verification_url',
        )


class CertificateDetailSerializer(CertificatePublicSerializer):
    """
    Detailed certificate data with social sharing URLs for the certified learner.
    """
    share_whatsapp_url = serializers.SerializerMethodField()
    share_linkedin_url = serializers.SerializerMethodField()

    class Meta(CertificatePublicSerializer.Meta):
        fields = CertificatePublicSerializer.Meta.fields + (
            'share_whatsapp_url',
            'share_linkedin_url',
        )

    def get_share_whatsapp_url(self, obj: Certificate) -> str:
        text = (
            f"🎓 Je viens de valider ma certification officielle chez DataMboa !\n"
            f"Formation : {obj.course.title}\n"
            f"Vérifier mon certificat : https://datamboa.cm/verify/{obj.certificate_code}"
        )
        return f"https://api.whatsapp.com/send?text={urllib.parse.quote(text)}"

    def get_share_linkedin_url(self, obj: Certificate) -> str:
        cert_url = f"https://datamboa.cm/verify/{obj.certificate_code}"
        params = {
            'startTask': 'CERTIFICATION_NAME',
            'name': obj.course.title,
            'organizationName': 'DataMboa',
            'issueYear': obj.issued_at.strftime('%Y'),
            'issueMonth': obj.issued_at.strftime('%m'),
            'certUrl': cert_url,
            'certId': obj.certificate_code,
        }
        return f"https://www.linkedin.com/profile/add?{urllib.parse.urlencode(params)}"



# =====================================================================
# INTERACTIVE EXERCISE SERIALIZERS (F1.18, R10, R24)
# =====================================================================

class InteractiveExercisePublicSerializer(serializers.ModelSerializer):
    """
    Public interactive exercise representation.
    Omits expected solution and raw explanation for academic integrity until submission.
    """
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = InteractiveExercise
        fields = (
            'id',
            'title',
            'exercise_type',
            'bloom_level',
            'instruction',
            'prompt_template',
            'options_or_tokens',
            'hints',
            'order',
            'is_completed',
        )

    def get_is_completed(self, obj: InteractiveExercise) -> bool:
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return ExerciseAttempt.objects.filter(user=request.user, exercise=obj, is_correct=True).exists()


class ExerciseSubmissionSerializer(serializers.Serializer):
    """
    Submitted answers dictionary, e.g. {"b1": "D5", "b2": "Clients!A:F", "b3": "FAUX"}
    """
    answers = serializers.DictField(child=serializers.CharField(allow_blank=True))


class ExerciseVerificationResponseSerializer(serializers.Serializer):
    """
    Immediate verification feedback response without page reload (R24).
    """
    is_correct = serializers.BooleanField()
    feedback = serializers.CharField()
    explanation = serializers.CharField()
    details = serializers.DictField()


# =====================================================================
# LEARNER DASHBOARD SERIALIZERS (F1.13, R16)
# =====================================================================

class DashboardStatsSerializer(serializers.Serializer):
    enrolled_courses_count = serializers.IntegerField()
    completed_courses_count = serializers.IntegerField()
    completed_lessons_count = serializers.IntegerField()
    total_learning_time_minutes = serializers.IntegerField()
    certificates_count = serializers.IntegerField()
    xp_points = serializers.IntegerField()


class DashboardResumeLessonSerializer(serializers.Serializer):
    course_title = serializers.CharField()
    course_slug = serializers.CharField()
    tool = serializers.CharField()
    level = serializers.CharField()
    lesson_title = serializers.CharField()
    lesson_slug = serializers.CharField()
    module_title = serializers.CharField()
    duration_minutes = serializers.IntegerField()
    progress_percentage = serializers.IntegerField()


class DashboardEnrolledCourseSerializer(serializers.Serializer):
    enrollment_id = serializers.IntegerField()
    course_id = serializers.IntegerField()
    course_title = serializers.CharField()
    course_slug = serializers.CharField()
    tool = serializers.CharField()
    level = serializers.CharField()
    progress_percentage = serializers.IntegerField()
    status = serializers.CharField()
    total_lessons_count = serializers.IntegerField()
    completed_lessons_count = serializers.IntegerField()
    updated_at = serializers.CharField(allow_null=True)
    certificate_code = serializers.CharField(allow_null=True, required=False)
    next_lesson_slug = serializers.CharField(allow_null=True, required=False)
    next_lesson_title = serializers.CharField(allow_null=True, required=False)


class DashboardCertificateItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    certificate_code = serializers.CharField()
    course_title = serializers.CharField()
    course_slug = serializers.CharField()
    tool = serializers.CharField()
    issued_at = serializers.CharField(allow_null=True)
    final_grade = serializers.FloatField(allow_null=True)
    instructor_name = serializers.CharField()
    verification_path = serializers.CharField()


class DashboardRecommendationSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    slug = serializers.CharField()
    tool = serializers.CharField()
    level = serializers.CharField()
    price_tier = serializers.CharField()
    duration_hours = serializers.IntegerField()


class LearnerDashboardSerializer(serializers.Serializer):
    user = serializers.DictField()
    stats = DashboardStatsSerializer()
    resume_lesson = DashboardResumeLessonSerializer(allow_null=True)
    enrolled_courses = DashboardEnrolledCourseSerializer(many=True)
    certificates = DashboardCertificateItemSerializer(many=True)
    recommendations = DashboardRecommendationSerializer(many=True)


class LearningEventSerializer(serializers.ModelSerializer):
    xapi_statement = serializers.SerializerMethodField()
    verb_display = serializers.CharField(source='get_verb_display', read_only=True)

    class Meta:
        model = LearningEvent
        fields = (
            'id',
            'verb',
            'verb_display',
            'object_id',
            'object_type',
            'object_name',
            'result_success',
            'result_completion',
            'result_score_raw',
            'result_score_max',
            'result_score_scaled',
            'result_duration_seconds',
            'context_course_slug',
            'context_platform',
            'payload',
            'xapi_statement',
            'timestamp',
        )

    def get_xapi_statement(self, obj):
        return obj.to_xapi_statement()


class ClientLearningEventCreateSerializer(serializers.Serializer):
    verb = serializers.ChoiceField(choices=LearningEvent.Verb.choices)
    object_id = serializers.CharField(max_length=255)
    object_type = serializers.ChoiceField(choices=LearningEvent.ObjectType.choices)
    object_name = serializers.CharField(max_length=255)
    result_success = serializers.BooleanField(required=False, allow_null=True)
    result_completion = serializers.BooleanField(required=False, allow_null=True)
    result_score_raw = serializers.FloatField(required=False, allow_null=True)
    result_duration_seconds = serializers.IntegerField(required=False, allow_null=True)
    context_course_slug = serializers.CharField(max_length=150, required=False, allow_blank=True)


class CourseFeedbackSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = CourseFeedback
        fields = (
            'id',
            'rating',
            'clarity_rating',
            'usefulness_rating',
            'difficulty_level',
            'pace_rating',
            'recommend_score',
            'strengths',
            'improvements',
            'comment',
            'is_public_testimonial',
            'author_name',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'author_name')

    def get_author_name(self, obj) -> str:
        return obj.user.first_name or obj.user.get_full_name() or 'Apprenant'


class CourseFeedbackSubmitSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    clarity_rating = serializers.IntegerField(min_value=1, max_value=5, default=5, required=False)
    usefulness_rating = serializers.IntegerField(min_value=1, max_value=5, default=5, required=False)
    difficulty_level = serializers.ChoiceField(
        choices=CourseFeedback.DifficultyLevel.choices,
        default=CourseFeedback.DifficultyLevel.BALANCED,
        required=False,
    )
    pace_rating = serializers.ChoiceField(
        choices=CourseFeedback.PaceRating.choices,
        default=CourseFeedback.PaceRating.BALANCED,
        required=False,
    )
    recommend_score = serializers.IntegerField(min_value=1, max_value=10, default=10, required=False)
    strengths = serializers.CharField(required=False, allow_blank=True, default='')
    improvements = serializers.CharField(required=False, allow_blank=True, default='')
    comment = serializers.CharField(required=False, allow_blank=True, default='')
    is_public_testimonial = serializers.BooleanField(default=True, required=False)


