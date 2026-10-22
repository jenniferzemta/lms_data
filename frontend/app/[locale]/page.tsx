import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function HomePage() {
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Navigation');
  const tCatalog = useTranslations('Catalog');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header — 56px */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-14 bg-white border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
            DM
          </div>
          <span className="font-bold text-lg text-brand-primary">
            {tCommon('appName')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex text-xs font-semibold rounded-lg border border-brand-border overflow-hidden">
            <Link
              href="/"
              locale="fr"
              className="px-2.5 py-1.5 min-h-[36px] flex items-center bg-brand-primary text-white"
            >
              FR
            </Link>
            <Link
              href="/"
              locale="en"
              className="px-2.5 py-1.5 min-h-[36px] flex items-center bg-white text-brand-muted"
            >
              EN
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content — Mobile-First (max 360-480px on phone, max 840px on desktop) */}
      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full md:max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide uppercase rounded-full bg-brand-primary-light text-brand-primary">
            Cameroun · FCFA · Bilingue FR/EN
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-brand-primary mb-2">
            {tCommon('tagline')}
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            {tCatalog('subtitle')}
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full flex items-center justify-center h-12 px-5 font-semibold text-white rounded-xl bg-brand-primary hover:bg-brand-primary-dark shadow-sm transition active:scale-[0.98]"
            >
              {tCommon('startFree')}
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center h-12 px-5 font-semibold text-brand-primary bg-white border border-brand-border rounded-xl hover:bg-brand-canvas transition active:scale-[0.98]"
            >
              {tCommon('seeCourses')}
            </button>
          </div>
        </div>

        {/* Tools Section */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-muted mb-3">
            {tCatalog('allTools')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Excel', desc: 'Gestion & Ventes FCFA', color: 'border-l-4 border-l-emerald-600' },
              { name: 'Power BI', desc: 'Tableaux de bord', color: 'border-l-4 border-l-amber-500' },
              { name: 'SQL', desc: 'Requêtes bases de données', color: 'border-l-4 border-l-blue-600' },
              { name: 'Python', desc: 'Pandas & Analyse', color: 'border-l-4 border-l-purple-600' },
            ].map((tool) => (
              <div
                key={tool.name}
                className={`p-3 bg-white rounded-xl border border-brand-border shadow-xs ${tool.color}`}
              >
                <div className="font-bold text-sm text-brand-primary">{tool.name}</div>
                <div className="text-xs text-brand-muted mt-0.5">{tool.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Localized Commitment Card */}
        <div className="p-4 rounded-xl bg-white border border-brand-border text-xs text-brand-muted leading-relaxed">
          <div className="font-semibold text-brand-primary text-sm mb-1">
            📱 Conçu pour votre téléphone
          </div>
          Laboratoires intégrés, mode léger pour économiser votre forfait data, et paiements simples par Mobile Money (MTN / Orange).
        </div>
      </main>

      {/* Bottom Navigation Bar (Fixed 56px) */}
      <nav className="sticky bottom-0 z-50 flex items-center justify-around h-14 bg-white border-t border-brand-border">
        <button type="button" className="flex flex-col items-center justify-center text-brand-primary min-w-[60px]">
          <span className="text-base">🏠</span>
          <span className="text-[10px] font-semibold">{tNav('home')}</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center text-brand-muted min-w-[60px]">
          <span className="text-base">📚</span>
          <span className="text-[10px] font-semibold">{tNav('courses')}</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center text-brand-muted min-w-[60px]">
          <span className="text-base">💎</span>
          <span className="text-[10px] font-semibold">{tNav('pricing')}</span>
        </button>
        <button type="button" className="flex flex-col items-center justify-center text-brand-muted min-w-[60px]">
          <span className="text-base">👤</span>
          <span className="text-[10px] font-semibold">{tNav('profile')}</span>
        </button>
      </nav>
    </div>
  );
}
