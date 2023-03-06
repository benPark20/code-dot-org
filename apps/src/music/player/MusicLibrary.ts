export default interface MusicLibrary {
  groups: FolderGroup[];
}

export type SoundType = 'beat' | 'bass' | 'lead' | 'fx' | 'pattern';

export interface SoundData {
  name: string;
  src: string;
  length: number;
  type: SoundType;
}

interface SoundFolder {
  name: string;
  type?: 'kit';
  path: string;
  imageSrc: string;
  sounds: SoundData[];
}

interface FolderGroup {
  id: string;
  name: string;
  imageSrc: string;
  path: string;
  folders: SoundFolder[];
}
