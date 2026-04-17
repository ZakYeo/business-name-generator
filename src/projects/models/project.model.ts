export interface ProjectPreferences {
  tone?: string;
  industry?: string;
  desiredLength?: number;
  excludedWords?: string[];
}

export interface Project {
  id: string;
  title: string;
  businessDescription: string;
  seedNames: string[];
  targetMarket: string;
  preferences: ProjectPreferences;
  createdAt: string;
  updatedAt: string;
}
