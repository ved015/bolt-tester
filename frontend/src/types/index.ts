export interface FileAction {
  type: string;
  filePath: string;
  content: string;
}

export interface BoltArtifact {
  id: string;
  title: string;
  actions: FileAction[];
}