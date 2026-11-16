import { LabType, LabExercise, LabSnapshot, CheckRule, LabResult } from '../types';

/**
 * Standard LabEngine Adapter Interface (Rule 40, Master Prompt §7.2)
 * All interactive laboratory engines (SQL, Python, Excel, Git, Power BI) must implement this contract.
 */
export interface LabEngine<TState, TResult = LabResult> {
  id: LabType;
  
  /**
   * Initializes the engine with the provided exercise context, data, and initial state.
   */
  load(exercise: LabExercise): Promise<TState>;

  /**
   * Serializes current state to a snapshot for automatic local storage persistence and session resume.
   */
  serialize(state: TState): LabSnapshot;

  /**
   * Restores an engine state from a previously saved snapshot.
   */
  restore(snapshot: LabSnapshot): TState;

  /**
   * Evaluates the user's solution against pedagogic check rules.
   */
  check(state: TState, rules: CheckRule[]): Promise<TResult>;

  /**
   * Exports the user's work as a downloadable file (.sql, .py, .xlsx, .zip).
   */
  export(state: TState): Promise<Blob>;

  /**
   * Imports a user-supplied file into the engine.
   */
  import(file: File): Promise<TState>;
}

