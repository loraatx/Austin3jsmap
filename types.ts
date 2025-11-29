export interface LandmarkData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number]; // x, y, z
  type: 'building' | 'park' | 'water' | 'district';
  scale?: [number, number, number];
  color?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export type ViewMode = 'map' | 'street';
