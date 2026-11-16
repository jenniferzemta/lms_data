export interface PythonSalesRecord {
  transaction_id: string;
  client: string;
  ville: string;
  produit: string;
  categorie: string;
  quantite: number;
  prix_unitaire_fcfa: number;
  montant_total_fcfa: number;
  date: string;
}

export const CAMEROON_SALES_DATASET: PythonSalesRecord[] = [
  { transaction_id: 'TXN-101', client: 'ETS Mboa Distribution', ville: 'Douala', produit: 'Ordinateur Portable HP', categorie: 'Informatique', quantite: 3, prix_unitaire_fcfa: 320000, montant_total_fcfa: 960000, date: '2024-02-10' },
  { transaction_id: 'TXN-102', client: 'Coopérative Cacao Ouest', ville: 'Bafoussam', produit: 'Sac Ciment Dangote 50kg', categorie: 'BTP', quantite: 40, prix_unitaire_fcfa: 4900, montant_total_fcfa: 196000, date: '2024-02-12' },
  { transaction_id: 'TXN-103', client: 'Boutique Akwa Central', ville: 'Douala', produit: 'Papier Ramette A4 Double A', categorie: 'Bureautique', quantite: 25, prix_unitaire_fcfa: 3200, montant_total_fcfa: 80000, date: '2024-02-18' },
  { transaction_id: 'TXN-104', client: 'Pharmacie Mokolo', ville: 'Yaoundé', produit: 'Huile Diamaor Carton 5L', categorie: 'Agro-alimentaire', quantite: 15, prix_unitaire_fcfa: 6800, montant_total_fcfa: 102000, date: '2024-02-22' },
  { transaction_id: 'TXN-105', client: 'Quincaillerie du Nord', ville: 'Garoua', produit: 'Sac Ciment Dangote 50kg', categorie: 'BTP', quantite: 80, prix_unitaire_fcfa: 5200, montant_total_fcfa: 416000, date: '2024-03-01' },
  { transaction_id: 'TXN-106', client: 'Cabinet Conseil Bonanjo', ville: 'Douala', produit: 'Disque SSD Kingston 1To', categorie: 'Informatique', quantite: 6, prix_unitaire_fcfa: 45000, montant_total_fcfa: 270000, date: '2024-03-05' },
  { transaction_id: 'TXN-107', client: 'Supermarché Bastos', ville: 'Yaoundé', produit: 'Sucre En Poudre Sac 25kg', categorie: 'Agro-alimentaire', quantite: 12, prix_unitaire_fcfa: 18500, montant_total_fcfa: 222000, date: '2024-03-10' },
  { transaction_id: 'TXN-108', client: 'Lycée Bilingue Bafoussam', ville: 'Bafoussam', produit: 'Papier Ramette A4 Double A', categorie: 'Bureautique', quantite: 50, prix_unitaire_fcfa: 3100, montant_total_fcfa: 155000, date: '2024-03-15' },
  { transaction_id: 'TXN-109', client: 'Kamer Logistique Port', ville: 'Douala', produit: 'Ordinateur Portable HP', categorie: 'Informatique', quantite: 5, prix_unitaire_fcfa: 315000, montant_total_fcfa: 1575000, date: '2024-03-20' },
  { transaction_id: 'TXN-110', client: 'Restaurant Saveurs Yaoundé', ville: 'Yaoundé', produit: 'Huile Diamaor Carton 5L', categorie: 'Agro-alimentaire', quantite: 8, prix_unitaire_fcfa: 6800, montant_total_fcfa: 54400, date: '2024-03-22' },
  { transaction_id: 'TXN-111', client: 'Boulangerie du Centre', ville: 'Garoua', produit: 'Sucre En Poudre Sac 25kg', categorie: 'Agro-alimentaire', quantite: 20, prix_unitaire_fcfa: 19000, montant_total_fcfa: 380000, date: '2024-03-25' },
  { transaction_id: 'TXN-112', client: 'Société Générale Matériaux', ville: 'Bafoussam', produit: 'Sac Ciment Dangote 50kg', categorie: 'BTP', quantite: 120, prix_unitaire_fcfa: 4900, montant_total_fcfa: 588000, date: '2024-03-28' }
];

export const CSV_SALES_REPRESENTATION = `transaction_id,client,ville,produit,categorie,quantite,prix_unitaire_fcfa,montant_total_fcfa,date
TXN-101,ETS Mboa Distribution,Douala,Ordinateur Portable HP,Informatique,3,320000,960000,2024-02-10
TXN-102,Coopérative Cacao Ouest,Bafoussam,Sac Ciment Dangote 50kg,BTP,40,4900,196000,2024-02-12
TXN-103,Boutique Akwa Central,Douala,Papier Ramette A4 Double A,Bureautique,25,3200,80000,2024-02-18
TXN-104,Pharmacie Mokolo,Yaoundé,Huile Diamaor Carton 5L,Agro-alimentaire,15,6800,102000,2024-02-22
TXN-105,Quincaillerie du Nord,Garoua,Sac Ciment Dangote 50kg,BTP,80,5200,416000,2024-03-01
TXN-106,Cabinet Conseil Bonanjo,Douala,Disque SSD Kingston 1To,Informatique,6,45000,270000,2024-03-05
TXN-107,Supermarché Bastos,Yaoundé,Sucre En Poudre Sac 25kg,Agro-alimentaire,12,18500,222000,2024-03-10
TXN-108,Lycée Bilingue Bafoussam,Bafoussam,Papier Ramette A4 Double A,Bureautique,50,3100,155000,2024-03-15
TXN-109,Kamer Logistique Port,Douala,Ordinateur Portable HP,Informatique,5,315000,1575000,2024-03-20
TXN-110,Restaurant Saveurs Yaoundé,Yaoundé,Huile Diamaor Carton 5L,Agro-alimentaire,8,6800,54400,2024-03-22
TXN-111,Boulangerie du Centre,Garoua,Sucre En Poudre Sac 25kg,Agro-alimentaire,20,19000,380000,2024-03-25
TXN-112,Société Générale Matériaux,Bafoussam,Sac Ciment Dangote 50kg,BTP,120,4900,588000,2024-03-28`;

