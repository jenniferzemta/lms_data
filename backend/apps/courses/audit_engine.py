"""
Intelligent Automated Grading & Pedagogical Audit Engine (V3 Intelligence, F3.1, F3.2, Master Prompt §7.2).
Provides automated structural analysis of learner submissions (Excel formulas, SQL queries, Python scripts)
and produces a comprehensive compliance audit report downloadable as text/markdown.
"""

import re
from typing import Any, Dict, List, Optional


class CodeAuditReport:
    def __init__(self, tool: str, content: str):
        self.tool = tool.lower()
        self.content = content.strip()
        self.score = 100
        self.strengths: List[str] = []
        self.issues: List[Dict[str, Any]] = []
        self.recommendations: List[str] = []

    def add_issue(self, severity: str, message: str, penalty: int, tip: str, line_or_ref: Optional[str] = None):
        self.score = max(0, self.score - penalty)
        self.issues.append({
            'severity': severity,  # 'error', 'warning', 'info'
            'message': message,
            'penalty': penalty,
            'tip': tip,
            'reference': line_or_ref,
        })
        if tip and tip not in self.recommendations:
            self.recommendations.append(tip)

    def add_strength(self, text: str):
        self.strengths.append(text)

    @property
    def status(self) -> str:
        return 'EXCELLENT' if self.score >= 90 else ('GOOD' if self.score >= 70 else ('NEEDS_WORK' if self.score >= 50 else 'CRITICAL'))

    def to_dict(self) -> Dict[str, Any]:
        return {
            'tool': self.tool,
            'score': self.score,
            'status': self.status,
            'strengths': self.strengths,
            'issues': self.issues,
            'recommendations': self.recommendations,
            'summary': self._build_summary(),
            'formatted_report': self.to_markdown(),
        }

    def _build_summary(self) -> str:
        if self.score >= 90:
            return f"Excellent travail sur vos travaux {self.tool.upper()}. Votre livrable respecte les meilleures pratiques professionnelles."
        elif self.score >= 70:
            return f"Bon travail d'ensemble ({self.score}/100). Quelques optimisations techniques recommandées pour garantir la robustesse."
        elif self.score >= 50:
            return f"Des acquis solides mais des erreurs structurelles ({self.score}/100) doivent être corrigées avant mise en production."
        else:
            return f"Plusieurs anti-patterns ou erreurs critiques détectés ({self.score}/100). Révisez les concepts fondamentaux indiqués ci-dessous."

    def to_markdown(self) -> str:
        lines = [
            f"# RAPPORT D'AUDIT TECHNIQUE ET PÉDAGOGIQUE — DATAMBOA",
            f"Outil analysé : {self.tool.upper()}",
            f"Note de conformité : {self.score} / 100 ({self.status})",
            "",
            "## 1. SYNTHÈSE",
            self._build_summary(),
            "",
            "## 2. POINTS FORTS & BONNES PRATIQUES DÉTECTÉES",
        ]
        if self.strengths:
            for s in self.strengths:
                lines.append(f"- [x] {s}")
        else:
            lines.append("- Aucun point fort particulier mis en évidence.")

        lines.extend(["", "## 3. ANOMALIES & ÉCARTS AUX STANDARDS PROFESSIONNELS"])
        if self.issues:
            for iss in self.issues:
                prefix = "[CRITIQUE]" if iss['severity'] == 'error' else ("[AVERTISSEMENT]" if iss['severity'] == 'warning' else "[INFO]")
                ref_txt = f" ({iss['reference']})" if iss.get('reference') else ""
                lines.append(f"- {prefix}{ref_txt} : {iss['message']} (-{iss['penalty']} pts)")
                if iss.get('tip'):
                    lines.append(f"  -> Conseil : {iss['tip']}")
        else:
            lines.append("- Aucune anomalie détectée. Code ou formule propre et optimal.")

        lines.extend(["", "## 4. PLAN D'ACTIONS RECOMMANDÉ"])
        if self.recommendations:
            for idx, r in enumerate(self.recommendations, 1):
                lines.append(f"{idx}. {r}")
        else:
            lines.append("Continuez à appliquer cette rigueur sur les missions d'entreprise suivantes.")

        return "\n".join(lines)


class CodeAuditEngine:
    """
    Main engine orchestrating intelligent static and behavioral audit
    for Excel, SQL, and Python artifacts (F3.1, F3.2).
    """

    @classmethod
    def audit(cls, tool: str, content: str) -> CodeAuditReport:
        norm_tool = (tool or '').strip().lower()
        if 'excel' in norm_tool:
            return cls.audit_excel(content)
        elif 'sql' in norm_tool:
            return cls.audit_sql(content)
        elif 'python' in norm_tool or 'pandas' in norm_tool:
            return cls.audit_python(content)
        else:
            report = CodeAuditReport(norm_tool or 'general', content)
            report.add_strength("Contenu soumis reçu et inspecté.")
            return report

    @classmethod
    def audit_excel(cls, content: str) -> CodeAuditReport:
        report = CodeAuditReport('excel', content)
        clean = content.strip()

        if not clean:
            report.add_issue('error', "Aucune formule ou classeur fourni pour l'analyse.", 100, "Veuillez soumettre vos formules Excel.")
            return report

        # Rule 1: Starts with '='
        if not clean.startswith('='):
            report.add_issue(
                'warning',
                "La chaîne ne commence pas par le symbole égal (=). Dans Excel, toute formule doit débuter par '=' pour être évaluée.",
                15,
                "Ajoutez le signe '=' en début de cellule."
            )
        else:
            report.add_strength("Syntaxe de formule standard débutant par le signe '=' respectée.")

        # Rule 2: Hardcoded numbers detection (anti-pattern in corporate Excel)
        # E.g. * 0.1925 or * 19.25 or + 500000 inside formulas
        hardcoded_rate = re.findall(r'[\*\+\-\/]\s*(0\.\d{2,4}|[1-9]\d{2,})', clean)
        if hardcoded_rate:
            report.add_issue(
                'warning',
                f"Constante numérique en dur détectée ({hardcoded_rate[0]}). En entreprise, les taux de taxe (TVA 19.25%) ou remises doivent référencer une cellule de paramètre.",
                15,
                "Déplacez les taux et seuils dans une cellule dédiée (ex: $C$1) et référencez-la avec un figeage absolu.",
                line_or_ref="Constante en dur"
            )
        else:
            report.add_strength("Absence de constantes magiques en dur : références dynamiques privilégiées.")

        # Rule 3: Absolute referencing check for 2D calculations
        has_dollar = '$' in clean
        if ('SOMME.SI' in clean.upper() or 'RECHERCHEV' in clean.upper() or 'RECHERCHEX' in clean.upper()) and not has_dollar:
            report.add_issue(
                'warning',
                "Absence de symboles dollar ($) pour figer les plages de recherche. Lors d'une recopie vers le bas, la plage source se décalera.",
                20,
                "Utilisez la touche F4 pour figer vos plages de lookup (ex: $A$2:$D$100).",
                line_or_ref="Plage relative non figée"
            )
        elif has_dollar:
            report.add_strength("Utilisation appropriée des références absolues ($) pour verrouiller les cellules clés.")

        # Rule 4: Modern functions vs legacy functions
        if 'RECHERCHEV' in clean.upper():
            report.add_issue(
                'info',
                "Utilisation de RECHERCHEV. Cette fonction ancienne est fragile si des colonnes sont insérées et impose que la clé soit dans la première colonne.",
                5,
                "Pensez à utiliser RECHERCHEX (ou INDEX/EQUIV) pour une plus grande robustesse sur les grands modèles de données.",
                line_or_ref="RECHERCHEV"
            )
        elif 'RECHERCHEX' in clean.upper():
            report.add_strength("Utilisation de RECHERCHEX moderne, plus performant et résilient aux ajouts de colonnes.")

        # Rule 5: Error handling protection
        if ('RECHERCHEV' in clean.upper() or 'EQUIV' in clean.upper()) and 'SIERREUR' not in clean.upper() and 'SI.NON.DISP' not in clean.upper():
            report.add_issue(
                'warning',
                "La recherche n'est pas protégée contre les valeurs introuvables (#N/A).",
                10,
                "Encapsulez avec SIERREUR(..., \"Non trouvé\") ou utilisez le paramètre [si_non_trouvé] de RECHERCHEX.",
                line_or_ref="Protection #N/A"
            )
        elif 'SIERREUR' in clean.upper() or 'SI.NON.DISP' in clean.upper():
            report.add_strength("Gestion d'erreurs proactive implémentée avec SIERREUR/SI.NON.DISP.")

        return report

    @classmethod
    def audit_sql(cls, content: str) -> CodeAuditReport:
        report = CodeAuditReport('sql', content)
        clean = content.strip()

        if not clean:
            report.add_issue('error', "Requête SQL vide.", 100, "Veuillez soumettre une requête SQL valide.")
            return report

        upper_sql = clean.upper()

        # Rule 1: SELECT * in reporting query
        if re.search(r'SELECT\s+\*', upper_sql):
            report.add_issue(
                'warning',
                "Utilisation de 'SELECT *' proscrite en environnement de production et analytique. Cela surcharge inutilement la bande passante et la mémoire.",
                15,
                "Spécifiez explicitement la liste des colonnes requises (ex: SELECT client_id, nom, montant_fcfa).",
                line_or_ref="SELECT *"
            )
        else:
            report.add_strength("Projection explicite des colonnes : aucune utilisation abusive de 'SELECT *'.")

        # Rule 2: Cartesian Product check (implicit comma join without where)
        if re.search(r'FROM\s+[a-zA-Z0-9_]+\s*,\s*[a-zA-Z0-9_]+', upper_sql) and 'WHERE' not in upper_sql:
            report.add_issue(
                'error',
                "Produit cartésien dangereux détecté ! Utilisation de virgules dans le FROM sans clause WHERE de jointure. La requête multipliera les lignes de façon exponentielle.",
                35,
                "Remplacez les virgules par des jointures explicites ANSI SQL : 'JOIN table2 ON table1.id = table2.table1_id'.",
                line_or_ref="FROM table1, table2"
            )
        elif 'JOIN' in upper_sql:
            report.add_strength("Jointures relationnelles ANSI standard (INNER/LEFT JOIN avec prédicat ON) respectées.")

        # Rule 3: Destructive query without WHERE
        if re.search(r'\b(DELETE\s+FROM|UPDATE)\b', upper_sql) and 'WHERE' not in upper_sql:
            report.add_issue(
                'error',
                "Requête destructive (UPDATE/DELETE) sans clause WHERE ! Cela modifiera ou supprimera l'intégralité de la base de données.",
                50,
                "Ajoutez impérativement une clause WHERE pour restreindre l'action aux lignes ciblées.",
                line_or_ref="UPDATE / DELETE sans WHERE"
            )

        # Rule 4: GROUP BY alignment with aggregates
        has_aggregate = any(agg in upper_sql for agg in ['SUM(', 'AVG(', 'COUNT(', 'MAX(', 'MIN('])
        if has_aggregate and ('GROUP BY' not in upper_sql) and ('SELECT' in upper_sql):
            # Check if non-aggregate column is also in select
            select_part = upper_sql.split('FROM')[0] if 'FROM' in upper_sql else upper_sql
            tokens_in_select = [t.strip() for t in select_part.replace('SELECT', '').split(',')]
            non_agg_tokens = [t for t in tokens_in_select if not any(t.startswith(a) for a in ['SUM', 'AVG', 'COUNT', 'MAX', 'MIN'])]
            if len(non_agg_tokens) > 0 and any(len(t) > 0 for t in non_agg_tokens):
                report.add_issue(
                    'warning',
                    "Fonctions d'agrégation combinées avec des colonnes de dimension sans clause GROUP BY. Le SGBD rejettera la requête.",
                    20,
                    "Ajoutez 'GROUP BY' avec toutes les colonnes présentes dans le SELECT qui ne sont pas des agrégats.",
                    line_or_ref="GROUP BY manquant"
                )
        elif has_aggregate and 'GROUP BY' in upper_sql:
            report.add_strength("Agrégation correctement structurée avec regroupement dimensionnel (GROUP BY).")

        return report

    @classmethod
    def audit_python(cls, content: str) -> CodeAuditReport:
        report = CodeAuditReport('python', content)
        clean = content.strip()

        if not clean:
            report.add_issue('error', "Script Python vide.", 100, "Veuillez soumettre un script Python.")
            return report

        # Rule 1: Pandas import convention
        if 'pandas' in clean:
            if 'import pandas as pd' in clean:
                report.add_strength("Convention d'import standard respectée : 'import pandas as pd'.")
            else:
                report.add_issue(
                    'info',
                    "Import Pandas non conventionnel. L'alias 'pd' est le standard mondial de la communauté Data.",
                    5,
                    "Utilisez 'import pandas as pd'."
                )

        # Rule 2: Anti-pattern iterrows() on DataFrame
        if '.iterrows()' in clean or 'itertuples()' in clean:
            report.add_issue(
                'warning',
                "Anti-pattern de boucle itérative (.iterrows()) détecté. En analyse de données avec Pandas, les boucles Python lentes sont jusqu'à 1000x moins rapides que les opérations vectorisées.",
                25,
                "Remplacez la boucle par des calculs vectorisés directs (ex: df['marge'] = df['ca'] - df['cout']) ou par .apply() / np.select().",
                line_or_ref=".iterrows()"
            )
        else:
            report.add_strength("Opérations vectorisées privilégiées : aucune boucle lente sur les lignes.")

        # Rule 3: Missing values handling
        if '.read_csv(' in clean and not any(m in clean for m in ['.isna()', '.fillna(', '.dropna(', '.isnull()', '.info()']):
            report.add_issue(
                'warning',
                "Aucun contrôle ni traitement des valeurs manquantes (NaN) détecté après le chargement du fichier CSV.",
                15,
                "Vérifiez l'intégrité de vos données avec df.info() et traitez les NaN avec .fillna() ou .dropna().",
                line_or_ref="Gestion des NaN"
            )
        elif any(m in clean for m in ['.isna()', '.fillna(', '.dropna(', '.isnull()']):
            report.add_strength("Vérification et imputation des données manquantes (NaN) intégrées.")

        # Rule 4: Chained indexing warning
        if re.search(r'df\[[\'\"].+[\'\"]\]\[[\'\"].+[\'\"]\]\s*=', clean):
            report.add_issue(
                'warning',
                "Indexation chaînée potentielle (SettingWithCopyWarning).",
                15,
                "Utilisez l'accesseur .loc[] pour assigner des valeurs en toute sécurité : df.loc[condition, 'colonne'] = valeur.",
                line_or_ref="df[col][idx] = val"
            )

        return report
