import { LabExercise } from '../types';

export const SAMPLE_GIT_EXERCISES: LabExercise[] = [
  {
    id: 'git-01',
    slug: 'git-init-commit',
    labType: 'git',
    title: 'Diagnostic et premier commit de nettoyage',
    bloomLevel: 'UNDERSTAND',
    maxPoints: 25,
    context: 'Projet d\'analyse de données chez Kamer Data Consulting (Douala). Vous disposez d\'un nouveau script de nettoyage des ventes.',
    instruction: 'Vérifiez l\'état des fichiers avec "git status", ajoutez "nettoyage_ventes.py" à l\'index avec "git add", puis enregistrez votre premier commit avec "git commit -m \\"feat: script de nettoyage des ventes FCFA\\"".',
    initialCode: 'git status',
    solutionCode: 'git add nettoyage_ventes.py\ngit commit -m "feat: script de nettoyage des ventes FCFA"',
    hints: [
      'Tapez "git status" pour voir quels fichiers sont non suivis (Untracked).',
      'Exécutez "git add nettoyage_ventes.py" pour indexer le fichier avant validation.',
      'Enregistrez avec "git commit -m \\"feat: script de nettoyage des ventes FCFA\\"".'
    ],
    rules: [
      {
        id: 'r1_committed',
        description: 'Le fichier nettoyage_ventes.py doit être commité sur la branche main',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as { commits?: { files?: Record<string, string> }[] };
          if (!state?.commits || state.commits.length === 0) return false;
          return state.commits.some(c => c.files && 'nettoyage_ventes.py' in c.files);
        }
      },
      {
        id: 'r2_commit_message',
        description: 'Le commit doit contenir un message explicite mentionnant le nettoyage ou les ventes',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as { commits?: { message?: string }[] };
          if (!state?.commits || state.commits.length === 0) return false;
          return state.commits.some(c => 
            c.message?.toLowerCase().includes('nettoyage') || 
            c.message?.toLowerCase().includes('ventes') ||
            c.message?.toLowerCase().includes('feat')
          );
        }
      }
    ]
  },
  {
    id: 'git-02',
    slug: 'git-branching',
    labType: 'git',
    title: 'Isolation d\'une feature sur une branche dédiée',
    bloomLevel: 'APPLY',
    maxPoints: 25,
    context: 'En tant qu\'analyste junior, vous ne devez pas modifier la branche principale directement. Vous développez le calcul des marges brutes.',
    instruction: 'Créez et basculez sur une nouvelle branche nommée "feature/indicateurs-kpi" avec "git checkout -b feature/indicateurs-kpi", puis indexez et commitez le nouveau fichier "calcul_kpi.py".',
    initialCode: 'git checkout -b feature/indicateurs-kpi',
    solutionCode: 'git checkout -b feature/indicateurs-kpi\ngit add calcul_kpi.py\ngit commit -m "feat: calcul des marges brutes en FCFA"',
    hints: [
      'Utilisez "git checkout -b feature/indicateurs-kpi" ou "git branch feature/indicateurs-kpi" suivi de "git checkout feature/indicateurs-kpi".',
      'Indexez avec "git add calcul_kpi.py".',
      'Commitez avec un message décrivant le calcul des KPI.'
    ],
    rules: [
      {
        id: 'r1_branch_exists',
        description: 'La branche "feature/indicateurs-kpi" doit être créée et active',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as { currentBranch?: string; branches?: Record<string, string> };
          return state?.currentBranch === 'feature/indicateurs-kpi' && !!state?.branches?.['feature/indicateurs-kpi'];
        }
      },
      {
        id: 'r2_commit_on_branch',
        description: 'Le fichier calcul_kpi.py doit être commité sur la branche feature/indicateurs-kpi',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as { commits?: { branch?: string; files?: Record<string, string> }[] };
          if (!state?.commits) return false;
          return state.commits.some(c => c.branch === 'feature/indicateurs-kpi' && c.files && 'calcul_kpi.py' in c.files);
        }
      }
    ]
  },
  {
    id: 'git-03',
    slug: 'git-merge',
    labType: 'git',
    title: 'Intégration et fusion de branche dans main',
    bloomLevel: 'ANALYZE',
    maxPoints: 25,
    context: 'La direction a validé votre script de calcul des KPI. Vous devez à présent intégrer vos travaux dans la branche principale.',
    instruction: 'Revenez sur la branche principale avec "git checkout main", puis fusionnez la branche avec "git merge feature/indicateurs-kpi". Vérifiez avec "git log --oneline".',
    initialCode: 'git checkout main',
    solutionCode: 'git checkout main\ngit merge feature/indicateurs-kpi\ngit log --oneline',
    hints: [
      'Basculez d\'abord sur la branche cible : "git checkout main".',
      'Lancez la commande de fusion : "git merge feature/indicateurs-kpi".',
      'Consultez l\'historique avec "git log --oneline".'
    ],
    rules: [
      {
        id: 'r1_on_main',
        description: 'Vous devez être positionné sur la branche main',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as { currentBranch?: string };
          return state?.currentBranch === 'main';
        }
      },
      {
        id: 'r2_merged_files',
        description: 'La branche main doit désormais contenir les fichiers "nettoyage_ventes.py" et "calcul_kpi.py"',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as { committedFiles?: Record<string, string> };
          return !!state?.committedFiles?.['nettoyage_ventes.py'] && !!state?.committedFiles?.['calcul_kpi.py'];
        }
      }
    ]
  },
  {
    id: 'git-04',
    slug: 'git-push',
    labType: 'git',
    title: 'Publication sur le dépôt GitHub distant',
    bloomLevel: 'EVALUATE',
    maxPoints: 25,
    context: 'Pour rendre votre projet d\'analyse accessible aux recruteurs et synchroniser votre portfolio, publiez votre historique sur GitHub.',
    instruction: 'Publiez la branche principale sur le serveur distant avec "git push origin main". Vérifiez l\'état de synchronisation avec "git status".',
    initialCode: 'git push origin main',
    solutionCode: 'git push origin main',
    hints: [
      'Tapez "git push origin main" pour envoyer vos commits locaux vers le dépôt distant.',
      'Vérifiez que le dépôt distant origin/main est à jour avec vos derniers commits.'
    ],
    rules: [
      {
        id: 'r1_remote_synced',
        description: 'Le dépôt distant origin/main doit être synchronisé avec le dernier commit local',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as {
            branches?: Record<string, string>;
            remoteOrigin?: { branches?: Record<string, string> };
          };
          const localMainHash = state?.branches?.['main'];
          const remoteMainHash = state?.remoteOrigin?.branches?.['main'];
          return !!localMainHash && localMainHash === remoteMainHash;
        }
      }
    ]
  }
];

