import { SqlTableSchema } from '../types';

export interface MicrofinanceData {
  clients: Record<string, unknown>[];
  comptes: Record<string, unknown>[];
  credits: Record<string, unknown>[];
  remboursements: Record<string, unknown>[];
}

export const MICROFINANCE_DATA: MicrofinanceData = {
  clients: [
    { id: 1, nom: 'Kamga Jean', ville: 'Douala', secteur_activite: 'Commerce général (Akwa)', telephone: '699123456', date_adhesion: '2023-01-15' },
    { id: 2, nom: 'Ngo Mayack Therese', ville: 'Yaoundé', secteur_activite: 'Transformation manioc (Mokolo)', telephone: '677234567', date_adhesion: '2023-02-10' },
    { id: 3, nom: 'Fotso Alain', ville: 'Bafoussam', secteur_activite: 'Café & Cacao Ouest', telephone: '694345678', date_adhesion: '2023-03-01' },
    { id: 4, nom: 'Bello Ibrahim', ville: 'Garoua', secteur_activite: 'Élevage & Coton', telephone: '670456789', date_adhesion: '2023-04-18' },
    { id: 5, nom: 'Ebongue Valerie', ville: 'Douala', secteur_activite: 'Boutique informatique (Bonanjo)', telephone: '691567890', date_adhesion: '2023-05-22' },
    { id: 6, nom: 'Zemta Laure', ville: 'Douala', secteur_activite: 'Logistique & Transport Port', telephone: '675678901', date_adhesion: '2023-06-30' },
    { id: 7, nom: 'Mballa Suzanne', ville: 'Yaoundé', secteur_activite: 'Restauration & Traiteur', telephone: '698789012', date_adhesion: '2023-08-14' },
    { id: 8, nom: 'Tchouassi Eric', ville: 'Bafoussam', secteur_activite: 'Quincaillerie & BTP', telephone: '672890123', date_adhesion: '2023-09-05' }
  ],

  comptes: [
    { id: 101, client_id: 1, numero_compte: 'CM-001-2023', type_compte: 'EPARGNE', solde_fcfa: 850000, statut: 'ACTIF' },
    { id: 102, client_id: 1, numero_compte: 'CM-002-2023', type_compte: 'COURANT', solde_fcfa: 320000, statut: 'ACTIF' },
    { id: 103, client_id: 2, numero_compte: 'CM-003-2023', type_compte: 'EPARGNE', solde_fcfa: 450000, statut: 'ACTIF' },
    { id: 104, client_id: 3, numero_compte: 'CM-004-2023', type_compte: 'EPARGNE', solde_fcfa: 1950000, statut: 'ACTIF' },
    { id: 105, client_id: 4, numero_compte: 'CM-005-2023', type_compte: 'COURANT', solde_fcfa: 120000, statut: 'ACTIF' },
    { id: 106, client_id: 5, numero_compte: 'CM-006-2023', type_compte: 'COURANT', solde_fcfa: 1540000, statut: 'ACTIF' },
    { id: 107, client_id: 6, numero_compte: 'CM-007-2023', type_compte: 'EPARGNE', solde_fcfa: 2800000, statut: 'ACTIF' },
    { id: 108, client_id: 7, numero_compte: 'CM-008-2023', type_compte: 'EPARGNE', solde_fcfa: 60000, statut: 'INACTIF' },
    { id: 109, client_id: 8, numero_compte: 'CM-009-2023', type_compte: 'COURANT', solde_fcfa: 910000, statut: 'ACTIF' },
    { id: 110, client_id: 8, numero_compte: 'CM-010-2023', type_compte: 'EPARGNE', solde_fcfa: 3100000, statut: 'ACTIF' }
  ],

  credits: [
    { id: 501, client_id: 1, agence: 'Douala-Akwa', montant_emprunte_fcfa: 1500000, taux_interet_pct: 7.5, duree_mois: 12, statut_remboursement: 'EN_COURS', date_octroi: '2024-01-10' },
    { id: 502, client_id: 2, agence: 'Yaoundé-Mokolo', montant_emprunte_fcfa: 800000, taux_interet_pct: 8.0, duree_mois: 6, statut_remboursement: 'CLOTURE', date_octroi: '2023-06-15' },
    { id: 503, client_id: 3, agence: 'Bafoussam-Centre', montant_emprunte_fcfa: 3500000, taux_interet_pct: 6.5, duree_mois: 24, statut_remboursement: 'EN_COURS', date_octroi: '2023-11-20' },
    { id: 504, client_id: 4, agence: 'Garoua-Marché', montant_emprunte_fcfa: 1200000, taux_interet_pct: 7.0, duree_mois: 12, statut_remboursement: 'EN_RETARD', date_octroi: '2023-09-01' },
    { id: 505, client_id: 5, agence: 'Douala-Akwa', montant_emprunte_fcfa: 2000000, taux_interet_pct: 7.0, duree_mois: 18, statut_remboursement: 'EN_COURS', date_octroi: '2024-02-05' },
    { id: 506, client_id: 6, agence: 'Douala-Bonanjo', montant_emprunte_fcfa: 5000000, taux_interet_pct: 6.0, duree_mois: 36, statut_remboursement: 'EN_COURS', date_octroi: '2023-07-01' },
    { id: 507, client_id: 7, agence: 'Yaoundé-Mokolo', montant_emprunte_fcfa: 500000, taux_interet_pct: 9.0, duree_mois: 6, statut_remboursement: 'EN_RETARD', date_octroi: '2023-10-10' },
    { id: 508, client_id: 8, agence: 'Bafoussam-Centre', montant_emprunte_fcfa: 4200000, taux_interet_pct: 6.5, duree_mois: 24, statut_remboursement: 'EN_COURS', date_octroi: '2024-03-12' }
  ],

  remboursements: [
    { id: 1001, credit_id: 501, montant_verse_fcfa: 135000, date_versement: '2024-02-10', mode_paiement: 'MOBILE_MONEY' },
    { id: 1002, credit_id: 501, montant_verse_fcfa: 135000, date_versement: '2024-03-10', mode_paiement: 'MOBILE_MONEY' },
    { id: 1003, credit_id: 502, montant_verse_fcfa: 864000, date_versement: '2023-12-15', mode_paiement: 'ESPECES' },
    { id: 1004, credit_id: 503, montant_verse_fcfa: 165000, date_versement: '2024-01-20', mode_paiement: 'VIREMENT' },
    { id: 1005, credit_id: 503, montant_verse_fcfa: 165000, date_versement: '2024-02-20', mode_paiement: 'VIREMENT' },
    { id: 1006, credit_id: 504, montant_verse_fcfa: 107000, date_versement: '2023-10-01', mode_paiement: 'ESPECES' },
    { id: 1007, credit_id: 505, montant_verse_fcfa: 122000, date_versement: '2024-03-05', mode_paiement: 'MOBILE_MONEY' },
    { id: 1008, credit_id: 506, montant_verse_fcfa: 165000, date_versement: '2023-08-01', mode_paiement: 'VIREMENT' },
    { id: 1009, credit_id: 506, montant_verse_fcfa: 165000, date_versement: '2023-09-01', mode_paiement: 'VIREMENT' },
    { id: 1010, credit_id: 508, montant_verse_fcfa: 198000, date_versement: '2024-04-12', mode_paiement: 'MOBILE_MONEY' }
  ]
};

export const MICROFINANCE_SCHEMAS: SqlTableSchema[] = [
  {
    name: 'clients',
    label: 'Clients & Adhérents',
    rowCount: MICROFINANCE_DATA.clients.length,
    columns: [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'nom', type: 'TEXT' },
      { name: 'ville', type: 'TEXT' },
      { name: 'secteur_activite', type: 'TEXT' },
      { name: 'telephone', type: 'TEXT' },
      { name: 'date_adhesion', type: 'DATE' }
    ],
    sampleRows: MICROFINANCE_DATA.clients.slice(0, 3)
  },
  {
    name: 'comptes',
    label: 'Comptes Épargne & Courants',
    rowCount: MICROFINANCE_DATA.comptes.length,
    columns: [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'client_id', type: 'INTEGER', isForeignKey: true, references: 'clients(id)' },
      { name: 'numero_compte', type: 'TEXT' },
      { name: 'type_compte', type: 'TEXT' },
      { name: 'solde_fcfa', type: 'DECIMAL' },
      { name: 'statut', type: 'TEXT' }
    ],
    sampleRows: MICROFINANCE_DATA.comptes.slice(0, 3)
  },
  {
    name: 'credits',
    label: 'Crédits et Financements Accordés',
    rowCount: MICROFINANCE_DATA.credits.length,
    columns: [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'client_id', type: 'INTEGER', isForeignKey: true, references: 'clients(id)' },
      { name: 'agence', type: 'TEXT' },
      { name: 'montant_emprunte_fcfa', type: 'DECIMAL' },
      { name: 'taux_interet_pct', type: 'DECIMAL' },
      { name: 'duree_mois', type: 'INTEGER' },
      { name: 'statut_remboursement', type: 'TEXT' },
      { name: 'date_octroi', type: 'DATE' }
    ],
    sampleRows: MICROFINANCE_DATA.credits.slice(0, 3)
  },
  {
    name: 'remboursements',
    label: 'Historique des Versements',
    rowCount: MICROFINANCE_DATA.remboursements.length,
    columns: [
      { name: 'id', type: 'INTEGER', isPrimaryKey: true },
      { name: 'credit_id', type: 'INTEGER', isForeignKey: true, references: 'credits(id)' },
      { name: 'montant_verse_fcfa', type: 'DECIMAL' },
      { name: 'date_versement', type: 'DATE' },
      { name: 'mode_paiement', type: 'TEXT' }
    ],
    sampleRows: MICROFINANCE_DATA.remboursements.slice(0, 3)
  }
];

