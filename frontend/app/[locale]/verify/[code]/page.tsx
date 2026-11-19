'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PublicHeader, PublicFooter } from '@/components';
import { coursesService } from '@/features/courses/services/courses.service';
import { Certificate } from '@/features/courses/types';
import {
  ShieldCheck,
  AlertTriangle,
  Share2,
  Printer,
  Copy,
  Check,
  Award,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Loader2,
  Download,
} from 'lucide-react';
import { downloadCertificateAsImage } from '@/features/courses/utils/certificate-download';

export default function CertificateVerificationPage() {
  const params = useParams();
  const locale = useLocale();
  const isEn = locale === 'en';
  const rawCode = params?.code as string;
  const certificateCode = rawCode ? decodeURIComponent(rawCode).trim() : '';

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!certificateCode) {
      setLoading(false);
      setError(isEn ? 'No certificate code provided.' : 'Aucun code de certificat fourni.');
      return;
    }

    let isMounted = true;
    coursesService
      .verifyCertificate(certificateCode)
      .then((data) => {
        if (isMounted) {
          setCertificate(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(
            isEn
              ? 'This certificate could not be found or is no longer active. Please check the code or contact DataMboa support.'
              : "Ce certificat est introuvable ou n'est plus actif. Vérifiez le code ou contactez le support DataMboa."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [certificateCode, isEn]);

  const handleCopyCode = async () => {
    if (!certificate) return;
    try {
      await navigator.clipboard.writeText(certificate.certificate_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!certificate) return;
    setIsDownloading(true);
    const success = await downloadCertificateAsImage(certificate);
    setIsDownloading(false);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center p-4 pt-20">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
            <Loader2 className="w-10 h-10 text-[#006b5f] animate-spin mx-auto mb-4" />
            <h1 className="text-lg font-bold text-slate-800">
              {isEn ? 'Verifying authenticity...' : "Vérification de l'authenticité..."}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isEn ? 'Querying the official DataMboa registry...' : 'Interrogation du registre officiel DataMboa...'}
            </p>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  // Error / Invalid state
  if (error || !certificate) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center p-4 pt-20">
          <div className="bg-white border border-rose-200 rounded-2xl p-6 md:p-8 max-w-lg w-full text-center shadow-sm">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEn ? 'Unverified Certificate' : 'Certificat non authentifié'}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {error ||
                (isEn
                  ? 'The entered code does not match any official registered certificate or has been revoked.'
                  : 'Le code saisi ne correspond à aucun certificat officiel enregistré ou a été révoqué.')}
            </p>
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
              {isEn ? 'Checked code:' : 'Code vérifié :'}{' '}
              <span className="font-bold">{certificateCode || (isEn ? 'EMPTY' : 'VIDE')}</span>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#006b5f] text-white font-medium hover:bg-[#005249] transition text-sm min-h-[44px]"
              >
                <BookOpen className="w-4 h-4" />
                {isEn ? 'Explore our courses' : 'Explorer nos formations'}
              </Link>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const skillsList = certificate.skills_summary
    ? certificate.skills_summary.split('·').map((s) => s.trim()).filter(Boolean)
    : [];

  const formattedDate = new Date(certificate.issued_at).toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    isEn
      ? `🎓 Check out my official DataMboa certificate!\nCourse: ${certificate.course_title}\nCertificate ID: ${certificate.certificate_code}\nVerification link: https://datamboa.cm/verify/${certificate.certificate_code}`
      : `🎓 Découvrez mon certificat officiel validé chez DataMboa !\nFormation : ${certificate.course_title}\nIdentifiant : ${certificate.certificate_code}\nLien de vérification : https://datamboa.cm/verify/${certificate.certificate_code}`
  )}`;

  const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    certificate.course_title
  )}&organizationName=DataMboa&issueYear=${new Date(certificate.issued_at).getFullYear()}&issueMonth=${
    new Date(certificate.issued_at).getMonth() + 1
  }&certUrl=${encodeURIComponent(`https://datamboa.cm/verify/${certificate.certificate_code}`)}&certId=${encodeURIComponent(
    certificate.certificate_code
  )}`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-100/80 print:bg-white text-slate-900">
      <div className="print:hidden">
        <PublicHeader />
      </div>

      <main className="flex-1 py-6 md:py-12 pt-24 md:pt-28 px-3 sm:px-6 print:p-0">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Verification Status Header (hidden on print) */}
          <div className="print:hidden bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0 border border-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    {isEn ? 'Authenticity Verified' : 'Authenticité Vérifiée'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {isEn ? 'Issued by DataMboa' : 'Délivré par DataMboa'}
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {isEn ? 'Registered Professional Certificate' : 'Certificat Professionnel Enregistré'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleCopyCode}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-mono font-medium text-slate-700 transition min-h-[44px]"
                title={isEn ? 'Copy verification code' : 'Copier le code de vérification'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{certificate.certificate_code}</span>
              </button>
            </div>
          </div>

          {/* Certificate Printable Diploma Card */}
          <div
            id="certificate-paper"
            className="relative bg-[#fffdf9] border-8 border-double border-[#7c5800]/30 rounded-2xl p-6 sm:p-10 md:p-14 shadow-lg overflow-hidden print:shadow-none print:border-4 print:rounded-none print:p-8"
          >
            {/* Subtle Corner Accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#7c5800]" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#7c5800]" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#7c5800]" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#7c5800]" />

            {/* Certificate Header */}
            <div className="text-center space-y-3 pb-6 border-b border-[#7c5800]/20">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#7c5800]">
                <Sparkles className="w-4 h-4 text-[#7c5800]" />
                <span>
                  {isEn
                    ? 'DataMboa Academic Board · Certification Division'
                    : 'Direction Académique DataMboa · Division Certifications'}
                </span>
                <Sparkles className="w-4 h-4 text-[#7c5800]" />
              </div>

              <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wider text-[#006b5f] uppercase">
                {isEn ? 'Certificate of Achievement' : 'Certificat de Réussite'}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest">
                {isEn
                  ? 'Official Diploma of Practical Data Analytics Competency'
                  : 'Certificate of Professional Completion & Applied Competency'}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center py-8 sm:py-10 space-y-5">
              <p className="text-sm sm:text-base text-slate-600 italic">
                {isEn
                  ? 'This official certificate proudly attests that'
                  : 'Le présent certificat officiel atteste avec honneur que'}
              </p>

              <div className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-wide">
                {certificate.recipient_name}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                {isEn
                  ? 'has successfully completed all methodological modules, real-world business cases, hands-on laboratory workshops, and assessments for the certification track:'
                  : "a validé avec succès l'intégralité des modules méthodologiques, cas d'entreprise réels, ateliers pratiques et évaluations de la formation certifiante :"}
              </p>

              <div className="inline-block px-5 py-2.5 bg-teal-50/80 border border-[#13b8a6]/40 rounded-xl">
                <span className="text-lg sm:text-2xl font-bold text-[#006b5f]">
                  {certificate.course_title}
                </span>
                <span className="block text-xs uppercase tracking-wider text-teal-800 font-semibold mt-0.5">
                  {certificate.track_name} · {isEn ? 'Final Score:' : 'Score Final :'} {certificate.final_score}%
                </span>
              </div>

              {/* Skills Badges */}
              {skillsList.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
                    {isEn ? 'Validated Core Skills & Laboratories' : 'Compétences Clés & Ateliers Validés'}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                    {skillsList.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-50/80 border border-amber-200 text-amber-900 text-xs rounded-full font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Certificate Signatures & Official Stamp */}
            <div className="pt-8 border-t border-[#7c5800]/20 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
              {/* Instructor Signature */}
              <div className="space-y-1">
                <div className="font-serif italic text-base text-slate-800 font-medium">
                  {certificate.instructor_name}
                </div>
                <div className="w-32 h-0.5 bg-[#7c5800]/30 mx-auto" />
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {isEn ? 'Lead Instructor' : 'Formateur Référent'}
                </div>
              </div>

              {/* Official Golden Seal */}
              <div className="flex justify-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-double border-[#7c5800] bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-[#7c5800] mb-0.5" />
                  <span className="text-[9px] font-black uppercase text-[#7c5800] tracking-tighter leading-tight">
                    DataMboa
                  </span>
                  <span className="text-[8px] font-bold text-amber-900 tracking-tighter">
                    {isEn ? 'OFFICIAL SEAL' : 'SCEAU OFFICIEL'}
                  </span>
                  <span className="text-[7px] text-amber-800">
                    {isEn ? 'Certified Authentic' : 'Certifié Conforme'}
                  </span>
                </div>
              </div>

              {/* Issuance Date & Academic ID */}
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-800">
                  {formattedDate}
                </div>
                <div className="w-32 h-0.5 bg-[#7c5800]/30 mx-auto" />
                <div className="text-xs font-mono text-slate-500">
                  ID : {certificate.certificate_code}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar (hidden on print) */}
          <div className="print:hidden bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#006b5f]" />
              <span>
                {isEn
                  ? 'Showcase and share this official certification'
                  : 'Valoriser et partager cette certification officielle'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Direct HD Download */}
              <button
                type="button"
                onClick={handleDownloadImage}
                disabled={isDownloading}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#006b5f] hover:bg-[#005249] text-white font-medium rounded-xl text-sm transition min-h-[44px] shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>
                  {isDownloading
                    ? (isEn ? 'Generating...' : 'Génération...')
                    : downloadSuccess
                    ? (isEn ? '✓ Downloaded!' : '✓ Téléchargé !')
                    : (isEn ? 'Download HD Certificate' : 'Télécharger le diplôme (HD)')}
                </span>
              </button>

              {/* Print / Save as PDF */}
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition min-h-[44px] shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>{isEn ? 'Print / Save as PDF' : 'Imprimer / Sauvegarder PDF'}</span>
              </button>

              {/* WhatsApp Share */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-medium rounded-xl text-sm transition min-h-[44px] shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>{isEn ? 'Share on WhatsApp' : 'Partager sur WhatsApp'}</span>
              </a>

              {/* LinkedIn Add to Profile */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] hover:bg-[#084d93] text-white font-medium rounded-xl text-sm transition min-h-[44px] shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isEn ? 'Add to LinkedIn' : 'Ajouter à LinkedIn'}</span>
              </a>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/courses/${certificate.course_slug}`}
                  className="inline-flex items-center gap-1.5 text-[#006b5f] hover:underline font-medium min-h-[36px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isEn ? 'View certified course details' : 'Voir le programme de la formation'}</span>
                </Link>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:underline min-h-[36px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>{isEn ? 'Registry index' : 'Registre des certificats'}</span>
                </Link>
              </div>
              <span>
                {isEn
                  ? 'Public verification registry · DataMboa'
                  : 'Registre public de vérification des compétences · DataMboa'}
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <PublicFooter />
      </div>
    </div>
  );
}
