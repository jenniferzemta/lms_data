'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { PublicHeader, PublicFooter } from '@/components';
import {
  ShieldCheck,
  Search,
  Download,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Printer,
  CheckCircle2,
  FileCheck2,
  FileSpreadsheet,
  Database,
  BarChart3,
  Code2,
} from 'lucide-react';
import { Certificate } from '@/features/courses/types';
import { downloadCertificateAsImage } from '@/features/courses/utils/certificate-download';

export default function CertificatesPortalPage() {
  const locale = useLocale();
  const isEn = locale === 'en';
  const router = useRouter();

  const [inputCode, setInputCode] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sample official demo certificate
  const demoCertificate: Certificate = {
    certificate_code: 'DM-EXC-2026-DEMO',
    recipient_name: 'Laure Jennifer Zemta',
    course_title: isEn
      ? 'Professional Excel & Business Data Analysis'
      : 'Excel Professionnel & Analyse de Données de Gestion',
    course_slug: 'excel-bases-analyse',
    track_name: isEn ? 'Data Analyst Track' : 'Cursus Analyste de Données',
    final_score: 94,
    issued_at: '2026-11-15T10:00:00Z',
    instructor_name: 'Dr. Emmanuel N.',
    skills_summary: isEn
      ? 'Data Cleaning · XLOOKUP & INDEX/MATCH · Pivot Tables · Financial Audit'
      : 'Nettoyage de données · Formules RECHERCHEX & INDEX/EQUIV · Tableaux croisés dynamiques · Audit financier',
    verification_url: 'https://datamboa.cm/verify/DM-EXC-2026-DEMO',
    is_valid: true,
  };

  const sampleCertificates = [
    {
      code: 'DM-EXC-2026-DEMO',
      name: 'Laure Jennifer Zemta',
      course: isEn ? 'Professional Excel & Business Analysis' : 'Excel Professionnel & Analyse de Données',
      score: '94%',
      icon: FileSpreadsheet,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      code: 'DM-SQL-2026-7104',
      name: 'Samuel K.',
      course: isEn ? 'Relational SQL & Microfinance Modeling' : 'SQL Relationnel & Modélisation Microfinance',
      score: '96%',
      icon: Database,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      code: 'DM-PBI-2026-3912',
      name: 'Christian M.',
      course: isEn ? 'Executive Power BI & Interactive Dashboards' : 'Power BI Décisionnel & Tableaux de Bord',
      score: '92%',
      icon: BarChart3,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      code: 'DM-PYT-2026-5520',
      name: 'Blandine F.',
      course: isEn ? 'Applied Python & Pandas Wrangling' : 'Python Appliqué & Traitement Pandas',
      score: '95%',
      icon: Code2,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    router.push(`/${locale}/verify/${encodeURIComponent(inputCode.trim().toUpperCase())}`);
  };

  const handleDownloadDemo = async () => {
    setIsDownloading(true);
    const success = await downloadCertificateAsImage(demoCertificate);
    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-canvas text-brand-text">
      <PublicHeader />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-12">
        {/* 1. HERO & SEARCH */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-teal" />
            <span>
              {isEn ? 'Official Verification Registry' : 'Registre Officiel des Certificats Infalsifiables'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
            {isEn
              ? 'Verify & Download DataMboa Certificates'
              : 'Vérifiez et Téléchargez un Certificat DataMboa'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isEn
              ? 'Every certificate issued by DataMboa attests to validated practical competence in real business environments and carries a unique cryptographic ID.'
              : 'Chaque certificat délivré par DataMboa atteste de compétences pratiques rigoureusement validées en laboratoire et dispose d’un identifiant unique infalsifiable.'}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="pt-2 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder={isEn ? 'e.g. DM-EXC-2026-DEMO' : 'Ex : DM-EXC-2026-DEMO'}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-mono placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-xl text-sm transition min-h-[44px] flex items-center justify-center gap-2 shadow-xs"
              >
                <Search className="w-4 h-4" />
                <span>{isEn ? 'Verify' : 'Vérifier'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. PROMINENT SAMPLE DOWNLOAD SECTION */}
        <section className="bg-gradient-to-br from-amber-50/70 via-white to-teal-50/50 rounded-3xl p-6 sm:p-10 border border-amber-200/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-amber-200/60">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Official Downloadable Sample' : 'Exemple Officiel Téléchargeable'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                  {isEn ? 'Sample Professional Certificate' : 'Exemple de Certificat Professionnel DataMboa'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  {isEn
                    ? 'Explore and download a full-resolution sample diploma to see what graduates receive upon completing their certification.'
                    : 'Téléchargez et visualisez un spécimen officiel en haute résolution pour découvrir la présentation exacte du diplôme remis aux lauréats.'}
                </p>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadDemo}
                  disabled={isDownloading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-sm transition min-h-[44px] shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloading
                      ? (isEn ? 'Generating...' : 'Génération du fichier...')
                      : downloadSuccess
                      ? (isEn ? '✓ Downloaded!' : '✓ Téléchargé avec succès !')
                      : (isEn ? 'Download Sample Certificate (HD)' : 'Télécharger le certificat exemple')}
                  </span>
                </button>

                <Link
                  href="/verify/DM-EXC-2026-DEMO"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm transition min-h-[44px] shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-brand-teal" />
                  <span>{isEn ? 'View Online Diploma' : 'Voir le diplôme en ligne'}</span>
                </Link>
              </div>
            </div>

            {/* PREVIEW CARD OF THE SAMPLE */}
            <div className="mt-8 p-5 sm:p-8 bg-[#fffdf9] border-4 border-double border-[#7c5800]/40 rounded-2xl shadow-sm relative space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#7c5800]/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-[#7c5800] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-[#7c5800] shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c5800]">
                      {isEn ? 'Specimen Diploma · Verified' : 'Diplôme Spécimen · Vérifié'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                      {demoCertificate.recipient_name}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500 font-mono block">
                    CODE : {demoCertificate.certificate_code}
                  </span>
                  <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                    {isEn ? 'Score: 94% · Passed' : 'Score : 94% · Mention Très Bien'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  {isEn ? 'Certified Formation' : 'Formation Certifiée'}
                </span>
                <p className="text-base sm:text-xl font-bold text-[#006b5f]">
                  {demoCertificate.course_title}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {demoCertificate.track_name} · {isEn ? 'Lead Instructor:' : 'Formateur Référent :'} {demoCertificate.instructor_name}
                </p>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                  {isEn ? 'Key Validated Practical Competencies' : 'Compétences Clés Validées en Laboratoire'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {demoCertificate.skills_summary?.split('·').map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-50 border border-amber-200/80 text-amber-900 text-xs rounded-lg font-medium"
                    >
                      ✓ {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. OTHER AVAILABLE CERTIFICATES EXAMPLES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900">
                {isEn ? 'Other Certification Tracks Examples' : 'Exemples de Certificats par Cursus'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {isEn
                  ? 'Click on any code to view its live authentic verification'
                  : 'Cliquez sur un code pour afficher sa vérification officielle en direct'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleCertificates.map((cert) => {
              const Icon = cert.icon;
              return (
                <div
                  key={cert.code}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cert.badgeColor}`}>
                        {cert.score}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 line-clamp-2">
                      {cert.course}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {cert.name}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      {cert.code}
                    </span>
                    <Link
                      href={`/verify/${cert.code}`}
                      className="text-xs text-brand-teal hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{isEn ? 'Inspect' : 'Consulter'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
