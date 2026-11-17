import os
from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from courses.models import LessonAttachment


def generate_valid_pdf(filepath: Path, title: str, subtitle: str, sections: list[tuple[str, list[str]]]):
    """
    Generates a clean valid PDF-1.4 file in pure Python without external binary dependencies.
    """
    content_lines = []
    content_lines.append(f"BT /F2 16 Tf 50 780 Td ({title}) Tj ET")
    content_lines.append(f"BT /F1 11 Tf 50 760 Td ({subtitle}) Tj ET")
    content_lines.append(f"BT /F1 9 Tf 50 740 Td (DataMboa E-Learning - Analyse de Donnees - Cameroun FCFA) Tj ET")
    
    # Horizontal rule
    content_lines.append("50 730 m 545 730 l S")
    
    y = 705
    for sec_title, items in sections:
        content_lines.append(f"BT /F2 12 Tf 50 {y} Td ({sec_title}) Tj ET")
        y -= 20
        for item in items:
            clean_item = item.replace("(", "\\(").replace(")", "\\)")
            content_lines.append(f"BT /F1 9 Tf 65 {y} Td ({clean_item}) Tj ET")
            y -= 15
            if y < 50:
                break
        y -= 10
        if y < 50:
            break

    stream = "\n".join(content_lines) + "\n"
    stream_bytes = stream.encode("latin-1", errors="replace")
    stream_len = len(stream_bytes)

    obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    obj2 = b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    obj3 = (
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] "
        b"/Contents 4 0 R /Resources << /Font << "
        b"/F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n"
    )
    obj4 = (
        f"4 0 obj\n<< /Length {stream_len} >>\nstream\n".encode("ascii")
        + stream_bytes
        + b"\nendstream\nendobj\n"
    )
    obj5 = b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"
    obj6 = b"6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n"

    header = b"%PDF-1.4\n"
    body = b""
    offsets = [0]
    for obj in [obj1, obj2, obj3, obj4, obj5, obj6]:
        offsets.append(len(header) + len(body))
        body += obj

    xref_offset = len(header) + len(body)
    xref = f"xref\n0 7\n0000000000 65535 f \n".encode("ascii")
    for off in offsets[1:]:
        xref += f"{off:010d} 00000 n \n".encode("ascii")
    trailer = f"trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("ascii")

    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, "wb") as f:
        f.write(header + body + xref + trailer)


class Command(BaseCommand):
    help = "Generates real downloadable Excel (.xlsx), PDF guides, CSV, and SQL assets on disk (F1.6)"

    def handle(self, *args, **options):
        media_root = Path(settings.MEDIA_ROOT)
        target_dir = media_root / 'courses' / 'attachments' / '2026' / '11'
        target_dir.mkdir(parents=True, exist_ok=True)

        self.stdout.write(self.style.NOTICE(f"Generating physical assets in {target_dir}..."))

        # -----------------------------------------------------------------
        # 1. douala_types_starter.xlsx
        # -----------------------------------------------------------------
        wb1 = openpyxl.Workbook()
        ws1 = wb1.active
        ws1.title = "Ventes_Douala_Starter"

        header_fill = PatternFill(start_color="0D9488", end_color="0D9488", fill_type="solid")
        header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        border_thin = Border(
            left=Side(style='thin', color='CBD5E1'),
            right=Side(style='thin', color='CBD5E1'),
            top=Side(style='thin', color='CBD5E1'),
            bottom=Side(style='thin', color='CBD5E1')
        )

        headers1 = [
            "ID_Vente", "Date_Operation", "Agence", "Code_Client", 
            "Designation_Article", "Quantite", "Prix_Unitaire_FCFA", "Montant_Brut_FCFA", "Remise_Pct", "Net_Commercial_FCFA"
        ]
        ws1.append(headers1)
        for col_idx in range(1, len(headers1) + 1):
            cell = ws1.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")

        sample_data1 = [
            ("VNT-2026-001", "2026-01-05", "Douala Akwa", "CLT-101", "Ciment Dangote 42.5R (Sac 50kg)", 40, 5100, "=F2*G2", 0.05, "=H2*(1-I2)"),
            ("VNT-2026-002", "2026-01-06", "Douala Bonanjo", "CLT-102", "Fer a beton FE E500 12mm", 25, 6200, "=F3*G3", 0.00, "=H3*(1-I3)"),
            ("VNT-2026-003", "2026-01-07", "Yaounde Centre", "CLT-103", "Peinture Seigneurie Blanc 20L", 10, 38500, "=F4*G4", 0.08, "=H4*(1-I4)"),
            ("VNT-2026-004", "2026-01-08", "Bafoussam Ville", "CLT-104", "Tole ondulee Alucam 3m 0.4mm", 50, 7500, "=F5*G5", 0.10, "=H5*(1-I5)"),
            ("VNT-2026-005", "2026-01-09", "Douala Bassa", "CLT-105", "Contreplaque Okoume 15mm", 15, 14200, "=F6*G6", 0.03, "=H6*(1-I6)"),
            ("VNT-2026-006", "2026-01-10", "Garoua Port", "CLT-106", "Tuyau PVC Pression 63mm", 30, 4800, "=F7*G7", 0.05, "=H7*(1-I7)"),
            ("VNT-2026-007", "2026-01-11", "Douala Akwa", "CLT-107", "Carreaux Gres Cerame 60x60 m2", 80, 8900, "=F8*G8", 0.07, "=H8*(1-I8)"),
            ("VNT-2026-008", "2026-01-12", "Yaounde Biyem-Assi", "CLT-108", "Fil de fer recuit 1.2mm (Rouleau)", 12, 11500, "=F9*G9", 0.00, "=H9*(1-I9)"),
            ("VNT-2026-009", "2026-01-13", "Bafoussam Marche", "CLT-109", "Robinetterie Mitigeur Lavabo", 8, 22000, "=F10*G10", 0.05, "=H10*(1-I10)"),
            ("VNT-2026-010", "2026-01-14", "Douala Bonaberi", "CLT-110", "Disjoncteur Differentiel 30mA", 20, 16500, "=F11*G11", 0.04, "=H11*(1-I11)"),
        ]

        for row_data in sample_data1:
            ws1.append(row_data)

        # Formatting currency columns
        for row in range(2, len(sample_data1) + 2):
            for col in range(1, len(headers1) + 1):
                cell = ws1.cell(row=row, column=col)
                cell.border = border_thin
                if col in [7, 8, 10]:
                    cell.number_format = '#,##0 "FCFA"'
                elif col == 9:
                    cell.number_format = '0.0%'

        for col in ws1.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws1.column_dimensions[col_letter].width = max(max_len + 4, 12)

        file1_path = target_dir / 'douala_types_starter.xlsx'
        wb1.save(file1_path)
        self.stdout.write(self.style.SUCCESS(f"Created {file1_path} ({file1_path.stat().st_size} bytes)"))

        # -----------------------------------------------------------------
        # 2. Cas_Pratique_Ventes_Douala.xlsx
        # -----------------------------------------------------------------
        wb2 = openpyxl.Workbook()
        ws2_ventes = wb2.active
        ws2_ventes.title = "Journal_Ventes"
        ws2_clients = wb2.create_sheet(title="Referentiel_Clients")

        ws2_clients.append(["Code_Client", "Nom_Raison_Sociale", "Ville", "Secteur_Activite", "Conditions_Reglement", "Plafond_Credit_FCFA"])
        for col_idx in range(1, 7):
            cell = ws2_clients.cell(row=1, column=col_idx)
            cell.fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
            cell.font = Font(name="Calibri", bold=True, color="FFFFFF")

        clients_data = [
            ("CLT-101", "Quincaillerie de la Paix", "Douala", "Commerce BTP", "30 jours fin de mois", 5000000),
            ("CLT-102", "Bati-Cameroun SARL", "Douala", "Construction & Genie Civil", "Comptant a reception", 15000000),
            ("CLT-103", "ETS Mballa & Freres", "Yaounde", "Distribution Quincaillerie", "45 jours fin de mois", 8000000),
            ("CLT-104", "Entreprise Générale de l'Ouest", "Bafoussam", "BTP & Rénovation", "30 jours", 6000000),
            ("CLT-105", "Kamer Boissons & Logistique", "Douala", "Industrie FMCG", "15 jours", 12000000),
        ]
        for c in clients_data:
            ws2_clients.append(c)

        for row in range(2, len(clients_data) + 2):
            ws2_clients.cell(row=row, column=6).number_format = '#,##0 "FCFA"'

        ws2_ventes.append(["ID_Transaction", "Code_Client", "Nom_Client_Recherche", "Ville_Agence", "Date_Facture", "Montant_TTC_FCFA"])
        for col_idx in range(1, 7):
            cell = ws2_ventes.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font

        ws2_ventes.append(["TX-001", "CLT-101", "=RECHERCHEX(B2; Referentiel_Clients!$A$2:$A$6; Referentiel_Clients!$B$2:$B$6; \"Inconnu\")", "Douala", "2026-02-01", 1250000])
        ws2_ventes.append(["TX-002", "CLT-103", "=RECHERCHEX(B3; Referentiel_Clients!$A$2:$A$6; Referentiel_Clients!$B$2:$B$6; \"Inconnu\")", "Yaounde", "2026-02-02", 3450000])
        ws2_ventes.append(["TX-003", "CLT-102", "=RECHERCHEX(B4; Referentiel_Clients!$A$2:$A$6; Referentiel_Clients!$B$2:$B$6; \"Inconnu\")", "Douala", "2026-02-03", 8900000])

        file2_path = target_dir / 'Cas_Pratique_Ventes_Douala.xlsx'
        wb2.save(file2_path)
        self.stdout.write(self.style.SUCCESS(f"Created {file2_path}"))

        # -----------------------------------------------------------------
        # 3. Template_Dashboard_Niveau1.xlsx
        # -----------------------------------------------------------------
        wb3 = openpyxl.Workbook()
        ws3 = wb3.active
        ws3.title = "Executive_Dashboard"
        ws3.views.sheetView[0].showGridLines = True

        # Banner Title
        ws3.merge_cells("B2:J3")
        ws3["B2"] = "TABLEAU DE BORD COMMERCIAL — DISTRIBUTION KAMER SARL"
        ws3["B2"].font = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
        ws3["B2"].fill = PatternFill(start_color="0F766E", end_color="0F766E", fill_type="solid")
        ws3["B2"].alignment = Alignment(horizontal="center", vertical="center")

        # KPI Cards
        kpi_defs = [
            ("B5:D6", "B7:D8", "CHIFFRE D'AFFAIRES REALISE", "142 580 000 FCFA"),
            ("E5:G6", "E7:G8", "OBJECTIF BUDGET 2026", "150 000 000 FCFA"),
            ("H5:J6", "H7:J8", "TAUX D'ATTEINTE GLOBAL", "95.1%"),
        ]
        for header_range, val_range, kpi_title, kpi_val in kpi_defs:
            ws3.merge_cells(header_range)
            ws3.merge_cells(val_range)
            top_h = header_range.split(":")[0]
            top_v = val_range.split(":")[0]
            ws3[top_h] = kpi_title
            ws3[top_h].font = Font(name="Calibri", size=9, bold=True, color="64748B")
            ws3[top_h].alignment = Alignment(horizontal="center", vertical="center")
            ws3[top_v] = kpi_val
            ws3[top_v].font = Font(name="Calibri", size=14, bold=True, color="0F172A")
            ws3[top_v].alignment = Alignment(horizontal="center", vertical="center")

        file3_path = target_dir / 'Template_Dashboard_Niveau1.xlsx'
        wb3.save(file3_path)
        self.stdout.write(self.style.SUCCESS(f"Created {file3_path}"))

        # -----------------------------------------------------------------
        # 4. ventes_douala_raw.csv
        # -----------------------------------------------------------------
        file4_path = target_dir / 'ventes_douala_raw.csv'
        csv_content = [
            "id_vente;date_vente;ville;client;produit;categorie;quantite;prix_unitaire_fcfa;montant_total_fcfa",
            "1001;2026-01-02;Douala;Quincaillerie Mballa;Ciment Dangote 50kg;Materiaux;100;5100;510000",
            "1002;2026-01-03;Yaounde;Bati-Centre;Fer a beton 12mm;Materiaux;50;6200;310000",
            "1003;2026-01-04;Douala;Kamer Boissons SARL;Gazelle 65cl Casier;Boissons;80;7200;576000",
            "1004;2026-01-05;Bafoussam;Coop Ouest;Engrais NPK Sac 50kg;Agro;40;24500;980000",
            "1005;2026-01-06;Garoua;Sahel Distribution;Huile Diamaor 5L;Agro;60;6500;390000",
            "1006;2026-01-07;Douala;ETS Foning;Toles Alucam 3m;Materiaux;120;7500;900000",
            "1007;2026-01-08;Yaounde;Supermarche Dovv;Jus Top Ananas 1.5L;Boissons;150;900;135000",
            "1008;2026-01-09;Douala;Boulangerie Acropole;Farine de Ble 50kg;Alimentaire;30;21000;630000",
            "1009;2026-01-10;Bafoussam;Societe Kuate;Savon Mayor Cartouche;Entretien;90;4200;378000",
            "1010;2026-01-11;Douala;Pharmacie des Nations;Alcool Medical 70 1L;Sante;50;1800;90000",
        ]
        with open(file4_path, "w", encoding="utf-8") as f:
            f.write("\n".join(csv_content) + "\n")
        self.stdout.write(self.style.SUCCESS(f"Created {file4_path}"))

        # -----------------------------------------------------------------
        # 5. memo_formats_fcfa.pdf (Guide PDF officiel)
        # -----------------------------------------------------------------
        file5_path = target_dir / 'memo_formats_fcfa.pdf'
        generate_valid_pdf(
            filepath=file5_path,
            title="GUIDE MEMO — FORMATS MONETAIRES FCFA & RACCOURCIS EXCEL",
            subtitle="Fiche technique de reference pour Analystes de Donnees en entreprise africaine",
            sections=[
                ("1. Le Format Monetaire Professionnel FCFA", [
                    "- Code de format personnalise : # ##0 \\\"FCFA\\\"",
                    "- Variante avec centimes comptables : # ##0,00 \\\"FCFA\\\"",
                    "- Variante d'audit avec zero masque : # ##0 \\\"FCFA\\\";[Rouge]-# ##0 \\\"FCFA\\\";\\\"-\\\"",
                    "- Astuce : Ne jamais taper \\\"FCFA\\\" a la main dans la cellule (casse le calcul !).",
                ]),
                ("2. Raccourcis Clavier Essentiels (Productivite x5)", [
                    "- F4 : Figeage absolu des coordonnees ($A$1 -> A$1 -> $A1 -> A1).",
                    "- Ctrl + Maj + 4 ($) : Application immediate du format monetaire standard.",
                    "- Ctrl + Fleche : Deplacement instantane aux limites du tableau de 50 000 lignes.",
                    "- Ctrl + Maj + L : Activation / desactivation des filtres automatiques.",
                    "- Alt + = : Insertion automatique de la fonction SOMME().",
                ]),
                ("3. Regle d'Or des References Absolues", [
                    "- Cellule de parametre (ex: Taux de TVA 19.25% en C1) : toujours figer $C$1.",
                    "- Formule matricielle de marge : =Ventes!D2*(1-$C$1).",
                ]),
            ]
        )
        self.stdout.write(self.style.SUCCESS(f"Created {file5_path} ({file5_path.stat().st_size} bytes)"))

        # -----------------------------------------------------------------
        # 6. Fiche_Synthese_Formules.pdf (Guide PDF des Formules)
        # -----------------------------------------------------------------
        file6_path = target_dir / 'Fiche_Synthese_Formules.pdf'
        generate_valid_pdf(
            filepath=file6_path,
            title="FICHE DE SYNTHESE — LES 15 FORMULES MAITRESSES EN ANALYSE",
            subtitle="Referentiel operationnel Excel, SQL et DAX — DataMboa",
            sections=[
                ("1. Agregations Conditionnelles (Excel)", [
                    "- SOMME.SI(plage_critere; critere; plage_somme) : filtre par agence (ex: Douala).",
                    "- SOMME.SI.ENS : cumul multi-criteres (ex: Douala ET Chiffre > 1 000 000 FCFA).",
                    "- NB.SI.ENS : comptage du nombre de transactions conformes au barème.",
                ]),
                ("2. Recherches et Croisements Modernes", [
                    "- RECHERCHEX(cle; plage_recherche; plage_renvoi; si_non_trouve) : remplace RECHERCHEV.",
                    "- INDEX(plage; EQUIV(cle; plage_recherche; 0)) : standard absolu pour matrices.",
                    "- SIERREUR(formule; valeur_de_repli) : securisation contre les codes d'erreur #N/A.",
                ]),
                ("3. Equivalents SQL et DAX", [
                    "- SQL : SELECT agence, SUM(montant) FROM ventes GROUP BY agence HAVING SUM(montant)>5M;",
                    "- DAX : CALCULATE(SUM(Ventes[CA]); Ventes[Ville] = \\\"Douala\\\");",
                    "- DAX Part de Marche : DIVIDE([Total_CA]; CALCULATE([Total_CA]; ALL(Ventes[Ville])));",
                ]),
            ]
        )
        self.stdout.write(self.style.SUCCESS(f"Created {file6_path}"))

        # -----------------------------------------------------------------
        # 7. ventes_douala_solution.xlsx
        # -----------------------------------------------------------------
        wb7 = openpyxl.Workbook()
        ws7 = wb7.active
        ws7.title = "Corrigé_Reference_DG"
        ws7.append(["Date", "Client", "Article", "Quantite", "PU_FCFA", "CA_Brut", "Remise", "CA_Net_FCFA"])
        for c in range(1, 9):
            ws7.cell(row=1, column=c).font = Font(bold=True, color="FFFFFF")
            ws7.cell(row=1, column=c).fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
        ws7.append(["2026-01-10", "Quincaillerie Moderne", "Ciment Dangote 50kg", 150, 5100, 765000, 0.05, 726750])
        ws7.append(["2026-01-11", "ETS Bati-Kamer", "Fer 12mm", 80, 6200, 496000, 0.00, 496000])
        file7_path = target_dir / 'ventes_douala_solution.xlsx'
        wb7.save(file7_path)
        self.stdout.write(self.style.SUCCESS(f"Created {file7_path}"))

        # -----------------------------------------------------------------
        # Link generated files to LessonAttachment models in DB
        # -----------------------------------------------------------------
        self.stdout.write(self.style.NOTICE("Binding generated physical files to LessonAttachment instances in DB..."))
        file_mapping = {
            "douala_types_starter.xlsx": file1_path,
            "Cas_Pratique_Ventes_Douala.xlsx": file2_path,
            "Template_Dashboard_Niveau1.xlsx": file3_path,
            "ventes_douala_raw.csv": file4_path,
            "memo_formats_fcfa.pdf": file5_path,
            "Fiche_Synthese_Formules.pdf": file6_path,
            "ventes_douala_solution.xlsx": file7_path,
        }

        updated_count = 0
        for att in LessonAttachment.objects.all():
            filename = None
            if att.external_url:
                filename = att.external_url.split('/')[-1]
            elif att.title:
                if 'découverte' in att.title.lower() or 'starter' in att.title.lower():
                    filename = 'douala_types_starter.xlsx'
                elif 'mémo' in att.title.lower() or 'raccourcis' in att.title.lower():
                    filename = 'memo_formats_fcfa.pdf'
                elif 'synthèse' in att.title.lower() or 'formules' in att.title.lower():
                    filename = 'Fiche_Synthese_Formules.pdf'
                elif 'dashboard' in att.title.lower() or 'template' in att.title.lower():
                    filename = 'Template_Dashboard_Niveau1.xlsx'
                elif 'corrigé' in att.title.lower() or 'solution' in att.title.lower():
                    filename = 'ventes_douala_solution.xlsx'
                elif 'brut' in att.title.lower() or 'csv' in att.title.lower():
                    filename = 'ventes_douala_raw.csv'

            if filename and filename in file_mapping:
                p = file_mapping[filename]
                rel_path = f"courses/attachments/2026/11/{filename}"
                att.file.name = rel_path
                att.file_size_bytes = p.stat().st_size
                att.file_format = filename.split('.')[-1]
                att.save()
                updated_count += 1
                self.stdout.write(f" -> Attached {filename} to #{att.id} ({att.title})")

        self.stdout.write(self.style.SUCCESS(f"Successfully configured {updated_count} lesson attachments with real on-disk files."))
