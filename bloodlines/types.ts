export interface FamilyMember {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unknown';
  birthDate: string;
  deathDate?: string;
  biography: string;
  position: { x: number; y: number };
  parents: string[];
  children: string[];
  partners: string[];
  photo?: string;
}

export type Theme = 'bloodlines' | 'forest' | 'ocean' | 'sunset' | 'royal' | 'custom';
