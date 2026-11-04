from django.contrib import admin
from courses.models import (
    Course,
    CourseEnrollment,
    Lesson,
    LessonAttachment,
    LessonProgress,
    LessonTranslation,
    Module,
    Quiz,
    QuizAnswerOption,
    QuizAttempt,
    QuizQuestion,
    Track,
)


class LessonTranslationInline(admin.StackedInline):
    model = LessonTranslation
    extra = 1


class LessonAttachmentInline(admin.TabularInline):
    model = LessonAttachment
    extra = 1
    fields = ('order', 'title', 'attachment_type', 'file', 'external_url', 'file_format', 'file_size_bytes', 'is_free_preview', 'download_count')


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('order', 'title', 'slug', 'lesson_type', 'duration_minutes', 'is_free_preview', 'is_published')


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1
    fields = ('order', 'title', 'is_published')


class QuizAnswerOptionInline(admin.TabularInline):
    model = QuizAnswerOption
    extra = 3
    fields = ('order', 'text', 'is_correct')


@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('name', 'tool', 'order', 'is_published', 'created_at')
    list_filter = ('tool', 'is_published')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'track', 'level', 'price_tier', 'duration_hours', 'order', 'is_published')
    list_filter = ('level', 'price_tier', 'is_published', 'track')
    search_fields = ('title', 'slug', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ModuleInline]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_published')
    list_filter = ('course', 'is_published')
    search_fields = ('title', 'course__title')
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'lesson_type', 'duration_minutes', 'is_free_preview', 'order', 'is_published')
    list_filter = ('lesson_type', 'is_free_preview', 'is_published', 'module__course')
    search_fields = ('title', 'slug', 'module__title')
    inlines = [LessonTranslationInline, LessonAttachmentInline]


@admin.register(LessonTranslation)
class LessonTranslationAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'language', 'status', 'created_at')
    list_filter = ('language', 'status')
    search_fields = ('title', 'content', 'lesson__title')


@admin.register(LessonAttachment)
class LessonAttachmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'attachment_type', 'file_format', 'file_size_bytes', 'is_free_preview', 'download_count', 'created_at')
    list_filter = ('attachment_type', 'is_free_preview', 'file_format')
    search_fields = ('title', 'description', 'lesson__title')


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'status', 'progress_percentage', 'last_lesson', 'enrolled_at', 'completed_at')
    list_filter = ('status', 'course')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'course__title')


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'is_completed', 'completed_at', 'last_accessed_at')
    list_filter = ('is_completed', 'lesson__module__course')
    search_fields = ('user__email', 'lesson__title')


class QuizQuestionInline(admin.StackedInline):
    model = QuizQuestion
    extra = 1
    fields = ('order', 'prompt', 'question_type', 'bloom_level', 'explanation', 'numeric_target')


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'purpose', 'passing_score_percentage', 'max_attempts', 'is_published')
    list_filter = ('purpose', 'is_published')
    search_fields = ('title', 'description', 'lesson__title')
    inlines = [QuizQuestionInline]


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ('prompt', 'quiz', 'question_type', 'bloom_level', 'order')
    list_filter = ('question_type', 'bloom_level', 'quiz')
    search_fields = ('prompt', 'explanation', 'quiz__title')
    inlines = [QuizAnswerOptionInline]


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score_percentage', 'is_passed', 'created_at')
    list_filter = ('is_passed', 'quiz')
    search_fields = ('user__email', 'quiz__title')
    readonly_fields = ('created_at',)
