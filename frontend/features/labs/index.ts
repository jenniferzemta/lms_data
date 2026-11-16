/**
 * Public API of the Labs Feature (V2 Pratique, Rule 40)
 */

export * from './types';
export * from './engines/LabEngine.interface';
export * from './engines/SqlLabEngine';
export * from './engines/PythonLabEngine';
export * from './engines/ExcelLabEngine';
export * from './engines/PowerBiLabEngine';
export * from './components/LabShell';
export * from './components/SqlLabView';
export * from './components/SqlEditor';
export * from './components/SqlResultsTable';
export * from './components/SqlSchemaExplorer';
export * from './components/PythonLabView';
export * from './components/PythonEditor';
export * from './components/PythonConsoleOutput';
export * from './components/PythonDatasetExplorer';
export * from './components/ExcelLabView';
export * from './components/ExcelGrid';
export * from './components/ExcelFormulaBar';
export * from './components/PowerBiLabView';
export * from './components/PowerBiLabContainer';
export * from './components/LabHintsModal';
export * from './data/sampleExercises';
export * from './data/samplePythonExercises';
export * from './data/sampleExcelExercises';
export * from './data/powerBiDataset';
export * from './data/microfinanceDb';
export * from './data/pythonDataset';
export * from './data/excelDataset';

