import React from 'react';
import { Course } from '../types';
import { Badge } from '@/ui/Badge';
import { Link } from '@/i18n/routing';
import { 
  Clock, 
  BookOpen, 
  Play, 
  ArrowRight, 
  Bookmark, 
  Sparkles, 
  Award,
  Layers
} from 'lucide-react';

export interface CourseCardProps {
  course: Course;
  onBookmarkToggle?: (courseId: string) => void;
  isBookmarked?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onBookmarkToggle,
  isBookmarked = false
}) => {
  const isFree = course.tier === 'free';
  const hasProgress = typeof course.progressPercentage === 'number' && course.progressPercentage > 0;

  return (
    <article className="flex flex-col rounded-2xl bg-white p-4 sm:p-5 border border-brand-border shadow-xs hover:shadow-md transition-all duration-200 relative overflow-hidden">
      {/* Top Header: Badges & Duration */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {isFree ? (
            <Badge variant="teal" icon={<Sparkles className="w-3.5 h-3.5 text-brand-teal" />}>
              Gratuit
            </Badge>
          ) : (
            <Badge variant="amber" icon={<Award className="w-3.5 h-3.5 text-amber-700" />}>
              {course.tier === 'essential' ? 'Formule Essentiel (10 000 FCFA)' : 'Formule Pro (30 000 FCFA)'}
            </Badge>
          )}

          <Badge variant="neutral">
            {course.level === 'debutant'
              ? 'Débutant'
              : course.level === 'intermediaire'
              ? 'Intermédiaire'
              : 'Avancé'}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-brand-muted text-xs shrink-0">
          <Clock className="w-3.5 h-3.5 text-brand-muted" />
          <span>{course.duration}</span>
        </div>
      </div>

      {/* Main Content Info: Image + Meta */}
      <div className="flex gap-3 mb-3">
        {/* Visual Thumbnail */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-brand-canvas-alt overflow-hidden shrink-0 relative border border-brand-border/60">
          <img
            src={course.imageUrl}
            alt={course.imageAlt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Title, Modules & Local Context */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-brand-muted text-xs mb-1">
            <BookOpen className="w-3.5 h-3.5 text-brand-teal" />
            <span>
              {course.casPratiqueCount 
                ? `${course.casPratiqueCount} cas pratiques` 
                : `${course.lessonCount} leçons`}
            </span>
          </div>

          <h3 className="font-bold text-base sm:text-lg text-brand-primary leading-snug truncate">
            {course.title}
          </h3>

          {course.localContext && (
            <span className="text-xs text-brand-muted font-medium truncate mt-0.5">
              {course.localContext}
            </span>
          )}

          {hasProgress && (
            <div className="inline-flex items-center gap-1.5 mt-1 text-xs text-brand-teal font-semibold">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
              <span>En cours ({course.progressPercentage}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Course Summary Description */}
      <p className="text-xs sm:text-sm text-brand-muted line-clamp-2 mb-4 leading-relaxed">
        {course.description}
      </p>

      {/* Progress Bar (if course in progress) */}
      {hasProgress && (
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className="bg-brand-teal h-full rounded-full transition-all duration-300"
            style={{ width: `${course.progressPercentage}%` }}
          />
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        <Link
          href={`/courses/${course.slug}`}
          className={`flex-1 min-h-[44px] px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-xs ${
            hasProgress
              ? 'bg-brand-primary hover:bg-brand-primary-dark text-white'
              : isFree
              ? 'bg-brand-teal hover:bg-brand-teal-dark text-white'
              : 'bg-brand-primary-light hover:bg-slate-100 text-brand-primary border border-brand-border'
          }`}
        >
          {hasProgress ? (
            <>
              <Play className="w-4 h-4" />
              <span>Reprendre le cours</span>
            </>
          ) : isFree ? (
            <>
              <Layers className="w-4 h-4" />
              <span>Commencer gratuitement</span>
            </>
          ) : (
            <>
              <span>Voir le cours</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Link>

        {/* Bookmark Favorite Button */}
        <button
          type="button"
          onClick={() => onBookmarkToggle?.(course.id)}
          aria-label={`Sauvegarder ${course.title}`}
          className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center border transition-all active:scale-95 ${
            isBookmarked
              ? 'bg-brand-teal-light text-brand-teal border-brand-teal/30'
              : 'bg-brand-canvas-alt text-brand-muted hover:text-brand-primary border-brand-border'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </article>
  );
};
