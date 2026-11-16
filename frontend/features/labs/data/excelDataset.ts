import { ExcelGridMap } from '../types';

/**
 * Initial Spreadsheet Dataset: ETS MBALLA & FRÈRES (Douala, Cameroun)
 * Sales and Stock Management in FCFA
 */

export interface ExcelCellInit {
  cell: string; // e.g. "A1"
  raw: string;
  isHeader?: boolean;
}

export const INITIAL_EXCEL_DATA: ExcelCellInit[] = [
  // Headers (Row 1)
  { cell: 'A1', raw: 'Code', isHeader: true },
  { cell: 'B1', raw: 'Article', isHeader: true },
  { cell: 'C1', raw: 'Catégorie', isHeader: true },
  { cell: 'D1', raw: 'Prix Unitaire', isHeader: true },
  { cell: 'E1', raw: 'Quantité', isHeader: true },
  { cell: 'F1', raw: 'Montant Brut', isHeader: true },
  { cell: 'G1', raw: 'Taux Remise', isHeader: true },
  { cell: 'H1', raw: 'Total Net', isHeader: true },

  // Data Rows (Rows 2 to 11)
  { cell: 'A2', raw: 'ART-001' },
  { cell: 'B2', raw: 'Ciment Dangote 50kg' },
  { cell: 'C2', raw: 'Gros Œuvre' },
  { cell: 'D2', raw: '5000' },
  { cell: 'E2', raw: '120' },
  { cell: 'F2', raw: '=D2*E2' },
  { cell: 'G2', raw: '0.05' },
  { cell: 'H2', raw: '=F2*(1-G2)' },

  { cell: 'A3', raw: 'ART-002' },
  { cell: 'B3', raw: 'Fer à béton 12mm' },
  { cell: 'C3', raw: 'Gros Œuvre' },
  { cell: 'D3', raw: '4200' },
  { cell: 'E3', raw: '80' },
  { cell: 'F3', raw: '=D3*E3' },
  { cell: 'G3', raw: '0.05' },
  { cell: 'H3', raw: '=F3*(1-G3)' },

  { cell: 'A4', raw: 'ART-003' },
  { cell: 'B4', raw: 'Peinture Blanche 20L' },
  { cell: 'C4', raw: 'Finition' },
  { cell: 'D4', raw: '28000' },
  { cell: 'E4', raw: '15' },
  { cell: 'F4', raw: '=D4*E4' },
  { cell: 'G4', raw: '0.05' },
  { cell: 'H4', raw: '=F4*(1-G4)' },

  { cell: 'A5', raw: 'ART-004' },
  { cell: 'B5', raw: 'Tôle Bac Alu 3m' },
  { cell: 'C5', raw: 'Gros Œuvre' },
  { cell: 'D5', raw: '8500' },
  { cell: 'E5', raw: '40' },
  { cell: 'F5', raw: '=D5*E5' },
  { cell: 'G5', raw: '0.05' },
  { cell: 'H5', raw: '=F5*(1-G5)' },

  { cell: 'A6', raw: 'ART-005' },
  { cell: 'B6', raw: 'Cadenas Vachette 60mm' },
  { cell: 'C6', raw: 'Quincaillerie' },
  { cell: 'D6', raw: '4500' },
  { cell: 'E6', raw: '25' },
  { cell: 'F6', raw: '=D6*E6' },
  { cell: 'G6', raw: '0' },
  { cell: 'H6', raw: '=F6*(1-G6)' },

  { cell: 'A7', raw: 'ART-006' },
  { cell: 'B7', raw: 'Brouette Pro Renforcée' },
  { cell: 'C7', raw: 'Outillage' },
  { cell: 'D7', raw: '22000' },
  { cell: 'E7', raw: '8' },
  { cell: 'F7', raw: '=D7*E7' },
  { cell: 'G7', raw: '0' },
  { cell: 'H7', raw: '=F7*(1-G7)' },

  { cell: 'A8', raw: 'ART-007' },
  { cell: 'B8', raw: 'Carrelage 60x60 Grès' },
  { cell: 'C8', raw: 'Finition' },
  { cell: 'D8', raw: '9500' },
  { cell: 'E8', raw: '30' },
  { cell: 'F8', raw: '=D8*E8' },
  { cell: 'G8', raw: '0.05' },
  { cell: 'H8', raw: '=F8*(1-G8)' },

  { cell: 'A9', raw: 'ART-008' },
  { cell: 'B9', raw: 'Câble cuivre 2.5mm' },
  { cell: 'C9', raw: 'Électricité' },
  { cell: 'D9', raw: '18000' },
  { cell: 'E9', raw: '10' },
  { cell: 'F9', raw: '=D9*E9' },
  { cell: 'G9', raw: '0' },
  { cell: 'H9', raw: '=F9*(1-G9)' },

  { cell: 'A10', raw: 'ART-009' },
  { cell: 'B10', raw: 'Tuyau PVC 100mm 4m' },
  { cell: 'C10', raw: 'Plomberie' },
  { cell: 'D10', raw: '3500' },
  { cell: 'E10', raw: '35' },
  { cell: 'F10', raw: '=D10*E10' },
  { cell: 'G10', raw: '0' },
  { cell: 'H10', raw: '=F10*(1-G10)' },

  { cell: 'A11', raw: 'ART-010' },
  { cell: 'B11', raw: 'Mitigeur Inox Douche' },
  { cell: 'C11', raw: 'Plomberie' },
  { cell: 'D11', raw: '14000' },
  { cell: 'E11', raw: '12' },
  { cell: 'F11', raw: '=D11*E11' },
  { cell: 'G11', raw: '0' },
  { cell: 'H11', raw: '=F11*(1-G11)' },

  // Summary labels (Row 13 to 15)
  { cell: 'E13', raw: 'TOTAL VENTES', isHeader: true },
  { cell: 'F13', raw: '' }, // For Workshop 1: =SOMME(F2:F11)

  { cell: 'E14', raw: 'PANIER MOYEN', isHeader: true },
  { cell: 'F14', raw: '' }, // For Workshop 1: =MOYENNE(F2:F11)

  { cell: 'E15', raw: 'VENTES GROS ŒUVRE', isHeader: true },
  { cell: 'F15', raw: '' }, // For Workshop 3: =SOMME.SI(C2:C11; "Gros Œuvre"; F2:F11)

  // Lookup section (Cols J & K)
  { cell: 'J1', raw: 'Recherche Fiche Article', isHeader: true },
  { cell: 'K1', raw: '', isHeader: true },
  { cell: 'J2', raw: 'Code Article Cherché' },
  { cell: 'K2', raw: 'ART-003' },
  { cell: 'J3', raw: 'Prix Unitaire Trouvé' },
  { cell: 'K3', raw: '' } // For Workshop 4: =RECHERCHEV(K2; A2:D11; 4; FAUX)
];

export function buildInitialGrid(): ExcelGridMap {
  const map: ExcelGridMap = {};
  for (const item of INITIAL_EXCEL_DATA) {
    map[item.cell] = {
      raw: item.raw,
      value: null,
      isHeader: item.isHeader,
      formula: item.raw.startsWith('=') ? item.raw : undefined
    };
  }
  return map;
}

