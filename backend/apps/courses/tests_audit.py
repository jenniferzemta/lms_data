from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from courses.audit_engine import CodeAuditEngine


class CodeAuditEngineTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_audit_excel_detects_hardcoded_numbers_and_missing_dollar(self):
        formula = "=SOMME.SI(A2:A100; \"Douala\"; B2:B100) * 0.1925"
        report = CodeAuditEngine.audit_excel(formula)
        self.assertLess(report.score, 100)
        issue_messages = [iss['message'] for iss in report.issues]
        self.assertTrue(any('Constante numérique' in m for m in issue_messages))
        self.assertTrue(any('Absence de symboles dollar' in m for m in issue_messages))

    def test_audit_excel_clean_formula(self):
        formula = "=RECHERCHEX(A2; $D$2:$D$100; $E$2:$E$100; SIERREUR($C$1; 0))"
        report = CodeAuditEngine.audit_excel(formula)
        self.assertGreaterEqual(report.score, 90)
        self.assertGreaterEqual(len(report.strengths), 2)

    def test_audit_sql_detects_cartesian_product(self):
        bad_sql = "SELECT * FROM clients, transactions"
        report = CodeAuditEngine.audit_sql(bad_sql)
        self.assertLess(report.score, 60)
        issue_messages = [iss['message'] for iss in report.issues]
        self.assertTrue(any('Produit cartésien' in m for m in issue_messages))
        self.assertTrue(any('SELECT *' in m for m in issue_messages))

    def test_audit_sql_clean_query(self):
        good_sql = """
        SELECT c.nom_client, SUM(t.montant_fcfa) AS total_ventes
        FROM clients c
        INNER JOIN transactions t ON c.id = t.client_id
        WHERE t.date_operation >= '2026-01-01'
        GROUP BY c.nom_client
        ORDER BY total_ventes DESC;
        """
        report = CodeAuditEngine.audit_sql(good_sql)
        self.assertGreaterEqual(report.score, 90)
        self.assertEqual(len(report.issues), 0)

    def test_audit_python_detects_slow_loop(self):
        bad_python = """
        import pandas as pd
        df = pd.read_csv('ventes.csv')
        for idx, row in df.iterrows():
            df['net'] = row['brut'] * 0.95
        """
        report = CodeAuditEngine.audit_python(bad_python)
        self.assertLess(report.score, 85)
        issue_messages = [iss['message'] for iss in report.issues]
        self.assertTrue(any('iterrows' in m for m in issue_messages))

    def test_audit_api_endpoint(self):
        url = reverse('courses:audit-analyze')
        payload = {
            'tool': 'excel',
            'content': '=SOMME($A$1:$A$10)'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('score', response.data)
        self.assertIn('formatted_report', response.data)

    def test_audit_download_report_endpoint(self):
        url = reverse('courses:audit-download')
        payload = {
            'tool': 'sql',
            'content': 'SELECT id, nom FROM clients WHERE ville = "Douala"'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/markdown; charset=utf-8')
        self.assertIn('RAPPORT D\'AUDIT', response.content.decode('utf-8'))

