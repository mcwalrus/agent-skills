export type TargetValue = 'cursor' | 'claude' | 'all';
export type TypeValue = 'skill' | 'rule' | 'suggestion';

export interface SourceFile {
  path: string;
  type: TypeValue;
  name: string;
  description: string;
  targets: TargetValue;
  content: string;
}

export interface LockEntry {
  sourcePath: string;
  sourceHash: string;
  outputPath: string;
  outputHash: string;
  timestamp: string;
}

export interface Lockfile {
  entries: LockEntry[];
}
