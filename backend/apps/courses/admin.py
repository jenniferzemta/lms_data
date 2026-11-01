from django.contrib import admin
from courses.models import Course, Lesson, LessonTranslation, Module, Track


class LessonTranslationInline(admin.StackedInline):
    model = LessonTranslation
    extra = 1


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    fields = ('order', 'title', 'slug', 'lesson_type', 'duration_minutes', 'is_free_preview', 'is_published')


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1
    fields = ('order', 'title', 'is_published')


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
    inlines = [LessonTranslationInline]


@admin.register(LessonTranslation)
class LessonTranslationAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson', 'language', 'status', 'created_at')
    list_filter = ('language', 'status')
    search_fields = ('title', 'content', 'lesson__title')
