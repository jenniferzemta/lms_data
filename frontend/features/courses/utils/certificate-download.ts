/**
 * Utility to generate and download high-resolution official certificate images (PNG)
 * directly in the browser without external libraries.
 */
import { Certificate } from '../types';

export function downloadCertificateAsImage(certificate: Certificate): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      // Standard A4 landscape ratio at 2x HD resolution
      canvas.width = 1600;
      canvas.height = 1131;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(false);
        return;
      }

      // 1. Background (warm diploma cream)
      ctx.fillStyle = '#FFFDF8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Decorative outer border
      ctx.strokeStyle = '#9A6B0A';
      ctx.lineWidth = 12;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Inner thin border
      ctx.strokeStyle = '#D4A33B';
      ctx.lineWidth = 3;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

      // 3. Corner accents
      const drawCorner = (x: number, y: number, angle: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.fillStyle = '#9A6B0A';
        ctx.fillRect(0, 0, 35, 6);
        ctx.fillRect(0, 0, 6, 35);
        ctx.restore();
      };
      drawCorner(60, 60, 0);
      drawCorner(canvas.width - 60, 60, 90);
      drawCorner(canvas.width - 60, canvas.height - 60, 180);
      drawCorner(60, canvas.height - 60, 270);

      // 4. Header Institution
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7C5800';
      ctx.font = 'bold 18px "Georgia", serif';
      ctx.fillText(
        'DIRECTION ACADÉMIQUE DATAMBOA · DIVISION CERTIFICATIONS PROFESSIONNELLES',
        canvas.width / 2,
        120
      );

      // 5. Main Title
      ctx.fillStyle = '#00584E';
      ctx.font = 'bold 52px "Georgia", serif';
      ctx.fillText('CERTIFICAT DE RÉUSSITE', canvas.width / 2, 195);

      ctx.fillStyle = '#64748B';
      ctx.font = 'italic 20px "Segoe UI", sans-serif';
      ctx.fillText(
        'DIPLÔME OFFICIEL DE COMPÉTENCES PRATIQUES EN ANALYSE DE DONNÉES',
        canvas.width / 2,
        235
      );

      // Thin divider
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(350, 265);
      ctx.lineTo(canvas.width - 350, 265);
      ctx.stroke();

      // 6. Recipient introduction
      ctx.fillStyle = '#475569';
      ctx.font = 'italic 22px "Georgia", serif';
      ctx.fillText(
        'Le présent certificat officiel atteste avec honneur que :',
        canvas.width / 2,
        320
      );

      // 7. Recipient Name
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 56px "Georgia", serif';
      ctx.fillText(certificate.recipient_name, canvas.width / 2, 400);

      // 8. Description
      ctx.fillStyle = '#475569';
      ctx.font = '18px "Segoe UI", sans-serif';
      ctx.fillText(
        "a validé avec succès l'ensemble des modules méthodologiques, cas pratiques en entreprise,",
        canvas.width / 2,
        460
      );
      ctx.fillText(
        "ateliers en laboratoire dans le navigateur et évaluations du programme certifiant :",
        canvas.width / 2,
        490
      );

      // 9. Course Box
      const boxWidth = 960;
      const boxHeight = 100;
      const boxX = (canvas.width - boxWidth) / 2;
      const boxY = 530;

      ctx.fillStyle = '#F0FDFA';
      ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      ctx.strokeStyle = '#0D9488';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      ctx.fillStyle = '#00584E';
      ctx.font = 'bold 30px "Georgia", serif';
      ctx.fillText(certificate.course_title, canvas.width / 2, boxY + 45);

      ctx.fillStyle = '#0F766E';
      ctx.font = 'bold 17px "Segoe UI", sans-serif';
      ctx.fillText(
        `${certificate.track_name.toUpperCase()} · SCORE FINAL OBTENU : ${certificate.final_score}%`,
        canvas.width / 2,
        boxY + 78
      );

      // 10. Skills Badges
      if (certificate.skills_summary) {
        ctx.fillStyle = '#64748B';
        ctx.font = 'bold 15px "Segoe UI", sans-serif';
        ctx.fillText('COMPÉTENCES CLÉS VALIDÉES EN LABORATOIRE :', canvas.width / 2, 680);

        const skills = certificate.skills_summary.split('·').map((s) => s.trim());
        const skillText = skills.join('   •   ');
        ctx.fillStyle = '#92400E';
        ctx.font = '16px "Segoe UI", sans-serif';
        ctx.fillText(skillText, canvas.width / 2, 715);
      }

      // 11. Signatures & Official Stamp (bottom area)
      const bottomY = 880;

      // Left: Instructor
      ctx.textAlign = 'center';
      ctx.fillStyle = '#1E293B';
      ctx.font = 'italic bold 22px "Georgia", serif';
      ctx.fillText(certificate.instructor_name, 340, bottomY);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(220, bottomY + 12);
      ctx.lineTo(460, bottomY + 12);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.fillText('FORMATEUR RÉFÉRENT', 340, bottomY + 36);

      // Center: Golden Stamp
      const sealCenterX = canvas.width / 2;
      const sealCenterY = bottomY;
      const radius = 68;

      ctx.save();
      ctx.beginPath();
      ctx.arc(sealCenterX, sealCenterY, radius, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        sealCenterX - 15,
        sealCenterY - 15,
        10,
        sealCenterX,
        sealCenterY,
        radius
      );
      gradient.addColorStop(0, '#FEF08A');
      gradient.addColorStop(0.5, '#FDE047');
      gradient.addColorStop(1, '#CA8A04');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Stamp inner circle
      ctx.beginPath();
      ctx.arc(sealCenterX, sealCenterY, radius - 8, 0, Math.PI * 2);
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#78350F';
      ctx.font = 'bold 15px "Georgia", serif';
      ctx.fillText('DATAMBOA', sealCenterX, sealCenterY - 15);
      ctx.font = 'bold 11px "Segoe UI", sans-serif';
      ctx.fillText('SCEAU OFFICIEL', sealCenterX, sealCenterY + 4);
      ctx.font = '9px "Segoe UI", sans-serif';
      ctx.fillText('CERTIFIÉ CONFORME', sealCenterX, sealCenterY + 20);
      ctx.font = '10px "Segoe UI", sans-serif';
      ctx.fillText('★ ★ ★', sealCenterX, sealCenterY + 35);
      ctx.restore();

      // Right: Date & Verification ID
      const formattedDate = new Date(certificate.issued_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 20px "Segoe UI", sans-serif';
      ctx.fillText(formattedDate, canvas.width - 340, bottomY);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(canvas.width - 460, bottomY + 12);
      ctx.lineTo(canvas.width - 220, bottomY + 12);
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.fillText('DATE DE DÉLIVRANCE', canvas.width - 340, bottomY + 36);

      // 12. Footer Verification Notice
      ctx.fillStyle = '#64748B';
      ctx.font = '14px "Courier New", monospace';
      ctx.fillText(
        `IDENTIFIANT UNIQUE INFALSIFIABLE : ${certificate.certificate_code}   ·   VÉRIFIABLE EN LIGNE : https://datamboa.cm/verify/${certificate.certificate_code}`,
        canvas.width / 2,
        1065
      );

      // 13. Trigger file download
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificat_DataMboa_${certificate.certificate_code}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve(true);
      }, 'image/png');
    } catch {
      resolve(false);
    }
  });
}
