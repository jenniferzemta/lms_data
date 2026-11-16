import { LabEngine } from './LabEngine.interface';
import {
  GitLabState,
  GitCommit,
  GitTerminalLog,
  LabExercise,
  LabResult,
  CheckRule,
  RuleCheckDetail,
  LabSnapshot
} from '../types';

export class GitLabEngine implements LabEngine<GitLabState> {
  id = 'git' as const;

  /**
   * Generates a deterministic short hash from a message and timestamp
   */
  private generateHash(message: string, timestamp: number): { hash: string; shortHash: string } {
    const raw = `${message}_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;
    let hashInt = 0;
    for (let i = 0; i < raw.length; i++) {
      hashInt = ((hashInt << 5) - hashInt) + raw.charCodeAt(i);
      hashInt |= 0;
    }
    const hex = Math.abs(hashInt).toString(16).padStart(8, '0');
    const full = `${hex}a9b8c7d6e5f41234567890abcdef12345678`.substring(0, 40);
    return {
      hash: full,
      shortHash: full.substring(0, 7)
    };
  }

  /**
   * Builds the initial state of the virtual Git repository for a given exercise
   */
  async load(exercise: LabExercise): Promise<GitLabState> {
    const initTimestamp = Date.now() - 3600000;
    const initCommitInfo = this.generateHash('Initial commit: setup data repository', initTimestamp);

    const initialCommit: GitCommit = {
      hash: initCommitInfo.hash,
      shortHash: initCommitInfo.shortHash,
      message: 'chore: initial commit (README & structure)',
      author: 'Laure <laure@datamboa.cm>',
      timestamp: initTimestamp,
      parentHash: null,
      branch: 'main',
      files: {
        'README.md': '# Analyse des Ventes Kamer Boissons SARL\nProjet de veille commerciale Douala & Yaoundé.'
      }
    };

    const initialWorkingFiles: Record<string, string> = {
      'README.md': initialCommit.files['README.md']
    };

    if (exercise.id === 'git-01') {
      initialWorkingFiles['nettoyage_ventes.py'] = [
        'import pandas as pd',
        '# Nettoyage des montants de vente en FCFA',
        'df = pd.read_csv("ventes.csv")',
        'df["montant_net"] = df["montant_brut"] * 0.95',
        'print("Données nettoyées avec succès")'
      ].join('\n');
    } else if (exercise.id === 'git-02') {
      initialWorkingFiles['nettoyage_ventes.py'] = '# Nettoyage des ventes';
      initialWorkingFiles['calcul_kpi.py'] = [
        '# Calcul des indicateurs clés (CA & Marge brute)',
        'def calculer_marge(ca_fcfa, cout_fcfa):',
        '    return ca_fcfa - cout_fcfa'
      ].join('\n');
    } else if (exercise.id === 'git-03') {
      initialWorkingFiles['nettoyage_ventes.py'] = '# Nettoyage des ventes';
      initialWorkingFiles['calcul_kpi.py'] = '# Calcul des KPI';
    } else {
      initialWorkingFiles['nettoyage_ventes.py'] = '# Nettoyage des ventes';
      initialWorkingFiles['calcul_kpi.py'] = '# Calcul des KPI';
    }

    const state: GitLabState = {
      currentBranch: 'main',
      branches: {
        main: initialCommit.hash
      },
      headHash: initialCommit.hash,
      commits: [initialCommit],
      workingFiles: initialWorkingFiles,
      stagedFiles: {},
      committedFiles: { ...initialCommit.files },
      logs: [
        {
          type: 'output',
          text: 'Dépôt Git local initialisé dans /workspace/kamer-data-consulting/.git/\nBranche par défaut : main.',
          timestamp: Date.now()
        }
      ],
      remoteOrigin: {
        url: 'https://github.com/datamboa/kamer-ventes-analytics.git',
        branches: {
          main: initialCommit.hash
        },
        commits: [initialCommit]
      },
      activeExercise: exercise
    };

    // Pre-setup for exercise 3 (merge scenario)
    if (exercise.id === 'git-03') {
      const featHashInfo = this.generateHash('feat: calcul des marges brutes en FCFA', Date.now() - 1800000);
      const featureCommit: GitCommit = {
        hash: featHashInfo.hash,
        shortHash: featHashInfo.shortHash,
        message: 'feat: calcul des marges brutes en FCFA',
        author: 'Laure <laure@datamboa.cm>',
        timestamp: Date.now() - 1800000,
        parentHash: initialCommit.hash,
        branch: 'feature/indicateurs-kpi',
        files: {
          ...initialCommit.files,
          'nettoyage_ventes.py': '# Nettoyage des ventes',
          'calcul_kpi.py': '# Calcul des KPI'
        }
      };
      state.branches['feature/indicateurs-kpi'] = featureCommit.hash;
      state.commits.push(featureCommit);
    }

    return state;
  }

  /**
   * Executes a Git CLI command inside the simulated terminal
   */
  executeCommand(state: GitLabState, rawCmd: string): GitLabState {
    const trimmed = rawCmd.trim();
    if (!trimmed) return state;

    const newLogs: GitTerminalLog[] = [
      ...state.logs,
      {
        type: 'command',
        text: `$ ${trimmed}`,
        timestamp: Date.now()
      }
    ];

    if (trimmed === 'clear') {
      return {
        ...state,
        logs: []
      };
    }

    // Must start with git
    if (!trimmed.startsWith('git')) {
      newLogs.push({
        type: 'error',
        text: `bash: ${trimmed.split(' ')[0]}: commande inconnue. Ce terminal simule l'environnement Git. Tapez "git --help" ou "git status".`,
        timestamp: Date.now()
      });
      return { ...state, logs: newLogs };
    }

    const tokens = trimmed.split(/\s+/);
    const subCommand = tokens[1];

    switch (subCommand) {
      case 'status': {
        const untracked = Object.keys(state.workingFiles).filter(
          (f) => !(f in state.stagedFiles) && !(f in state.committedFiles)
        );
        const modified = Object.keys(state.workingFiles).filter(
          (f) => f in state.committedFiles && state.workingFiles[f] !== state.committedFiles[f] && !(f in state.stagedFiles)
        );
        const staged = Object.keys(state.stagedFiles);

        let output = `Sur la branche ${state.currentBranch}\n`;
        const localCommit = state.branches[state.currentBranch];
        const remoteCommit = state.remoteOrigin.branches[state.currentBranch];

        if (remoteCommit) {
          if (localCommit === remoteCommit) {
            output += 'Votre branche est à jour avec \'origin/' + state.currentBranch + '\'.\n\n';
          } else {
            output += 'Votre branche est en avance sur \'origin/' + state.currentBranch + '\' de 1 commit(s).\n  (utilisez "git push" pour publier vos commits locaux)\n\n';
          }
        }

        if (staged.length > 0) {
          output += 'Modifications qui seront validées :\n  (utilisez "git restore --staged <fichier>..." pour désindexer)\n';
          staged.forEach((f) => {
            output += `\t\x1b[32mnouveau fichier:   ${f}\x1b[0m\n`;
          });
          output += '\n';
        }

        if (modified.length > 0) {
          output += 'Modifications qui ne sont pas indexées :\n  (utilisez "git add <fichier>..." pour indexer)\n';
          modified.forEach((f) => {
            output += `\t\x1b[31mmodifié:   ${f}\x1b[0m\n`;
          });
          output += '\n';
        }

        if (untracked.length > 0) {
          output += 'Fichiers non suivis :\n  (utilisez "git add <fichier>..." pour inclure dans ce qui sera validé)\n';
          untracked.forEach((f) => {
            output += `\t\x1b[31m${f}\x1b[0m\n`;
          });
          output += '\n';
        }

        if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
          output += 'arbre de travail propre, rien à valider\n';
        }

        newLogs.push({ type: 'output', text: output, timestamp: Date.now() });
        return { ...state, logs: newLogs };
      }

      case 'add': {
        const fileTarget = tokens.slice(2).join(' ');
        if (!fileTarget) {
          newLogs.push({
            type: 'error',
            text: 'Rien spécifié, rien ajouté.\nPeut-être vouliez-vous taper "git add ." ?',
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        const newStaged = { ...state.stagedFiles };
        if (fileTarget === '.' || fileTarget === '-A') {
          Object.keys(state.workingFiles).forEach((f) => {
            newStaged[f] = state.workingFiles[f];
          });
          newLogs.push({
            type: 'success',
            text: `Indexation de tous les fichiers de l'arbre de travail (${Object.keys(state.workingFiles).length} fichiers).`,
            timestamp: Date.now()
          });
        } else {
          if (fileTarget in state.workingFiles) {
            newStaged[fileTarget] = state.workingFiles[fileTarget];
            newLogs.push({
              type: 'success',
              text: `Indexation de "${fileTarget}" dans la zone de staging.`,
              timestamp: Date.now()
            });
          } else {
            newLogs.push({
              type: 'error',
              text: `fatal: chemin spécifié '${fileTarget}' ne correspond à aucun fichier de l'espace de travail.`,
              timestamp: Date.now()
            });
            return { ...state, logs: newLogs };
          }
        }

        return {
          ...state,
          stagedFiles: newStaged,
          logs: newLogs
        };
      }

      case 'commit': {
        if (Object.keys(state.stagedFiles).length === 0) {
          newLogs.push({
            type: 'error',
            text: 'Sur la branche ' + state.currentBranch + '\nrien à valider, la zone d\'index (staging) est vide.\nUtilisez d\'abord "git add <fichier>" pour indexer vos modifications.',
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        // Extract message from -m "message"
        let msg = 'Mise à jour des fichiers';
        const mIndex = tokens.indexOf('-m');
        if (mIndex !== -1 && tokens.length > mIndex + 1) {
          const rawMsg = tokens.slice(mIndex + 1).join(' ');
          msg = rawMsg.replace(/^["']|["']$/g, '');
        }

        const now = Date.now();
        const hashInfo = this.generateHash(msg, now);

        const newCommit: GitCommit = {
          hash: hashInfo.hash,
          shortHash: hashInfo.shortHash,
          message: msg,
          author: 'Laure <laure@datamboa.cm>',
          timestamp: now,
          parentHash: state.headHash,
          branch: state.currentBranch,
          files: {
            ...state.committedFiles,
            ...state.stagedFiles
          }
        };

        const updatedBranches = {
          ...state.branches,
          [state.currentBranch]: newCommit.hash
        };

        newLogs.push({
          type: 'success',
          text: `[${state.currentBranch} ${hashInfo.shortHash}] ${msg}\n ${Object.keys(state.stagedFiles).length} fichier(s) modifié(s), ${Object.keys(state.stagedFiles).length * 15} insertions(+)`,
          timestamp: now
        });

        return {
          ...state,
          headHash: newCommit.hash,
          branches: updatedBranches,
          commits: [...state.commits, newCommit],
          committedFiles: newCommit.files,
          stagedFiles: {},
          logs: newLogs
        };
      }

      case 'branch': {
        const branchName = tokens[2];
        if (!branchName) {
          // List branches
          let output = '';
          Object.keys(state.branches).forEach((b) => {
            if (b === state.currentBranch) {
              output += `* \x1b[32m${b}\x1b[0m\n`;
            } else {
              output += `  ${b}\n`;
            }
          });
          newLogs.push({ type: 'output', text: output, timestamp: Date.now() });
          return { ...state, logs: newLogs };
        }

        if (branchName in state.branches) {
          newLogs.push({
            type: 'error',
            text: `fatal: Une branche nommée '${branchName}' existe déjà.`,
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        const updatedBranches = {
          ...state.branches,
          [branchName]: state.headHash
        };

        newLogs.push({
          type: 'success',
          text: `Branche '${branchName}' créée à partir du commit [${state.headHash.substring(0, 7)}].`,
          timestamp: Date.now()
        });

        return {
          ...state,
          branches: updatedBranches,
          logs: newLogs
        };
      }

      case 'checkout':
      case 'switch': {
        const isCreate = tokens.includes('-b') || tokens.includes('-c');
        let targetBranch = isCreate ? tokens[tokens.indexOf(isCreate ? (tokens.includes('-b') ? '-b' : '-c') : '') + 1] : tokens[2];

        if (!targetBranch) {
          newLogs.push({
            type: 'error',
            text: 'fatal: vous devez spécifier le nom d\'une branche cible.',
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        if (isCreate) {
          const updatedBranches = {
            ...state.branches,
            [targetBranch]: state.headHash
          };
          newLogs.push({
            type: 'success',
            text: `Bascule sur la nouvelle branche '${targetBranch}'.`,
            timestamp: Date.now()
          });
          return {
            ...state,
            currentBranch: targetBranch,
            branches: updatedBranches,
            logs: newLogs
          };
        }

        if (!(targetBranch in state.branches)) {
          newLogs.push({
            type: 'error',
            text: `error: chemin ou branche '${targetBranch}' introuvable.\nCréez-la d'abord avec "git checkout -b ${targetBranch}".`,
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        const branchCommitHash = state.branches[targetBranch];
        const targetCommit = state.commits.find((c) => c.hash === branchCommitHash);

        newLogs.push({
          type: 'success',
          text: `Bascule sur la branche '${targetBranch}'.`,
          timestamp: Date.now()
        });

        return {
          ...state,
          currentBranch: targetBranch,
          headHash: branchCommitHash,
          committedFiles: targetCommit?.files || state.committedFiles,
          logs: newLogs
        };
      }

      case 'merge': {
        const branchToMerge = tokens[2];
        if (!branchToMerge || !(branchToMerge in state.branches)) {
          newLogs.push({
            type: 'error',
            text: `merge: ${branchToMerge} - branche introuvable pour la fusion.`,
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        const sourceHash = state.branches[branchToMerge];
        const sourceCommit = state.commits.find((c) => c.hash === sourceHash);
        const mergedFiles = { ...state.committedFiles, ...(sourceCommit?.files || {}) };

        const mergeHashInfo = this.generateHash(`Merge branch '${branchToMerge}' into ${state.currentBranch}`, Date.now());
        const mergeCommit: GitCommit = {
          hash: mergeHashInfo.hash,
          shortHash: mergeHashInfo.shortHash,
          message: `Merge branch '${branchToMerge}' into ${state.currentBranch}`,
          author: 'Laure <laure@datamboa.cm>',
          timestamp: Date.now(),
          parentHash: state.headHash,
          branch: state.currentBranch,
          files: mergedFiles
        };

        const updatedBranches = {
          ...state.branches,
          [state.currentBranch]: mergeCommit.hash
        };

        newLogs.push({
          type: 'success',
          text: `Mise à jour en avance rapide (Fast-forward) ou commit de fusion [${mergeHashInfo.shortHash}].\n Intégration réussie de la branche '${branchToMerge}' dans '${state.currentBranch}'.`,
          timestamp: Date.now()
        });

        return {
          ...state,
          headHash: mergeCommit.hash,
          branches: updatedBranches,
          commits: [...state.commits, mergeCommit],
          committedFiles: mergedFiles,
          workingFiles: { ...state.workingFiles, ...mergedFiles },
          logs: newLogs
        };
      }

      case 'log': {
        const isOneLine = tokens.includes('--oneline');
        let output = '';

        const branchCommits = state.commits.slice().reverse();
        if (isOneLine) {
          branchCommits.forEach((c) => {
            const isHead = c.hash === state.headHash;
            const headBadge = isHead ? `\x1b[36m(HEAD -> ${state.currentBranch})\x1b[0m ` : '';
            output += `\x1b[33m${c.shortHash}\x1b[0m ${headBadge}${c.message}\n`;
          });
        } else {
          branchCommits.forEach((c) => {
            output += `\x1b[33mcommit ${c.hash}\x1b[0m\n`;
            output += `Author: ${c.author}\n`;
            output += `Date:   ${new Date(c.timestamp).toLocaleString()}\n\n`;
            output += `    ${c.message}\n\n`;
          });
        }

        newLogs.push({ type: 'output', text: output, timestamp: Date.now() });
        return { ...state, logs: newLogs };
      }

      case 'push': {
        const remote = tokens[2] || 'origin';
        const branch = tokens[3] || state.currentBranch;

        if (remote !== 'origin') {
          newLogs.push({
            type: 'error',
            text: `fatal: dépôt distant '${remote}' inconnu. Utilisez 'origin'.`,
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        const localHash = state.branches[branch];
        if (!localHash) {
          newLogs.push({
            type: 'error',
            text: `error: la branche locale '${branch}' n'existe pas.`,
            timestamp: Date.now()
          });
          return { ...state, logs: newLogs };
        }

        const newRemoteBranches = {
          ...state.remoteOrigin.branches,
          [branch]: localHash
        };

        newLogs.push({
          type: 'success',
          text: `Énumération des objets: 5, fait.\nCompte des objets: 100% (5/5), fait.\nÉcriture des objets: 100% (3/3), 420 bytes | 420.00 KiB/s, fait.\nTotal 3 (delta 1), réutilisés 0 (delta 0)\nVers https://github.com/datamboa/kamer-ventes-analytics.git\n   ${localHash.substring(0, 7)}..${localHash.substring(0, 7)}  ${branch} -> ${branch}`,
          timestamp: Date.now()
        });

        return {
          ...state,
          remoteOrigin: {
            ...state.remoteOrigin,
            branches: newRemoteBranches,
            commits: [...state.commits]
          },
          logs: newLogs
        };
      }

      case '--help':
      case 'help': {
        const helpText = [
          'Commandes Git supportées par le simulateur :',
          '  git status                      - Affiche l\'état de l\'arbre de travail',
          '  git add <fichier> | git add .   - Indexe les fichiers dans le staging',
          '  git commit -m "message"         - Enregistre un nouveau commit',
          '  git branch [nom]                - Liste ou crée une branche',
          '  git checkout -b <nom>           - Crée et bascule sur une branche',
          '  git checkout <nom>              - Bascule sur une branche existante',
          '  git merge <branche>             - Fusionne la branche dans la courante',
          '  git log [--oneline]             - Affiche l\'historique des commits',
          '  git push origin <branche>       - Envoie les commits sur GitHub distant',
          '  clear                           - Efface la console'
        ].join('\n');
        newLogs.push({ type: 'output', text: helpText, timestamp: Date.now() });
        return { ...state, logs: newLogs };
      }

      default:
        newLogs.push({
          type: 'error',
          text: `git: '${subCommand}' n'est pas une commande git reconnue. Consultez 'git --help'.`,
          timestamp: Date.now()
        });
        return { ...state, logs: newLogs };
    }
  }

  /**
   * Serializes current state to a snapshot
   */
  serialize(state: GitLabState): LabSnapshot {
    return {
      code: state.logs.filter((l) => l.type === 'command').map((l) => l.text.replace(/^\$\s*/, '')).join('\n'),
      timestamp: Date.now(),
      activeExerciseId: state.activeExercise?.id
    };
  }

  /**
   * Restores state from a snapshot
   */
  restore(snapshot: LabSnapshot): GitLabState {
    const defaultExercise = {
      id: snapshot.activeExerciseId || 'git-01',
      slug: 'git-lab',
      labType: 'git' as const,
      title: 'Laboratoire Git',
      instruction: '',
      context: '',
      initialCode: '',
      solutionCode: '',
      rules: [],
      hints: [],
      bloomLevel: 'UNDERSTAND' as const,
      maxPoints: 25
    };
    return {
      currentBranch: 'main',
      branches: { main: 'init123' },
      headHash: 'init123',
      commits: [],
      workingFiles: {},
      stagedFiles: {},
      committedFiles: {},
      logs: [{ type: 'output', text: 'Session Git restaurée.', timestamp: Date.now() }],
      remoteOrigin: { url: '', branches: {}, commits: [] },
      activeExercise: defaultExercise
    };
  }

  /**
   * Validates state against pedagogic rules
   */
  async check(state: GitLabState, rules: CheckRule[]): Promise<LabResult> {
    const details: RuleCheckDetail[] = [];
    let passedCount = 0;

    for (const rule of rules) {
      let passed = false;
      let message: string | undefined;

      try {
        if (rule.validator) {
          passed = rule.validator(state);
        } else {
          passed = true;
        }
      } catch (err) {
        passed = false;
        message = err instanceof Error ? err.message : 'Erreur de validation de la règle';
      }

      if (passed) {
        passedCount++;
      } else if (!message) {
        message = rule.description;
      }

      details.push({
        ruleId: rule.id,
        description: rule.description,
        passed,
        message
      });
    }

    const total = rules.length;
    const score = total > 0 ? Math.round((passedCount / total) * 100) : 100;
    const isSuccess = score === 100;

    return {
      isSuccess,
      score,
      message: isSuccess
        ? 'Félicitations ! Toutes les étapes Git de cet atelier sont validées avec succès.'
        : `Atelier en cours : ${passedCount}/${total} critères validés. Continuez !`,
      details
    };
  }

  /**
   * Exports repository commit log as text file
   */
  async export(state: GitLabState): Promise<Blob> {
    const content = [
      '# Historique Git — DataMboa Portfolio',
      `Date d'export : ${new Date().toISOString()}`,
      `Branche active : ${state.currentBranch}`,
      `Dépôt distant : ${state.remoteOrigin.url}`,
      '',
      '## Commits',
      ...state.commits.map(
        (c) => `* [${c.shortHash}] (${c.branch}) ${c.message} - ${c.author} (${new Date(c.timestamp).toLocaleString()})`
      ),
      '',
      '## Fichiers de la branche principale',
      ...Object.keys(state.committedFiles).map((f) => `- ${f}`)
    ].join('\n');

    return new Blob([content], { type: 'text/markdown;charset=utf-8' });
  }

  /**
   * Imports a file into working directory
   */
  async import(file: File): Promise<GitLabState> {
    const text = await file.text();
    const defaultExercise: LabExercise = {
      id: 'git-custom',
      slug: 'git-custom',
      labType: 'git',
      title: 'Dépôt Git Personnalisé',
      instruction: 'Travaillez avec votre fichier importé.',
      context: 'Fichier importé par l\'apprenant.',
      initialCode: 'git status',
      solutionCode: '',
      rules: [],
      hints: [],
      bloomLevel: 'APPLY',
      maxPoints: 25
    };
    const loaded = await this.load(defaultExercise);
    loaded.workingFiles[file.name] = text;
    loaded.logs.push({
      type: 'output',
      text: `Fichier '${file.name}' importé dans le répertoire de travail.`,
      timestamp: Date.now()
    });
    return loaded;
  }
}
