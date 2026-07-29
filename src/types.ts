export interface Vaani {
  id: string;
  title: string;
  text: string;
  meaning?: string;
  source?: string;
  badge?: string;
}

export interface SubSection {
  id: string;
  title: string;
  vaanis: Vaani[];
  refrain?: {
    label: string;
    text: string;
    meaning: string;
  };
  phalashruti?: {
    label: string;
    text: string;
    meaning: string;
  };
}

export interface VaaniSection {
  id: string;
  label: string;
  title: string;
  description: string;
  vaanis: Vaani[];
  subSections?: SubSection[];
  isGrid?: boolean;
  refrain?: {
    label: string;
    text: string;
    meaning: string;
  };
  phalashruti?: {
    label: string;
    text: string;
    meaning: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
