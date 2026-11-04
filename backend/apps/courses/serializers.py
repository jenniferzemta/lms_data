from rest_framework import serializers

from courses.models import (
    Course,
    Lesson,
    LessonAttachment,
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
