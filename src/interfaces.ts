export interface Note {
    start: number;
    length: number;
    pitch: number;
    type: 'normal' | 'star' | 'freestyle' | 'rap';
    lyrics: string;
}

export type NoLyricNote = Omit<Note, 'lyrics' | 'type'>;

export type Section = NotesSection | PauseSection;

export enum GAME_MODE {
    DUEL,
    PASS_THE_MIC,
}

export interface SingSetup {
    playerTracks: [number, number];
    mode: GAME_MODE;
    tolerance: number;
    skipIntro?: boolean;
}

export interface NotesSection {
    // end: never;
    start: number;
    notes: Note[];
    type: 'notes';
}

export interface PauseSection {
    start: number;
    end: number;
    // notes: never;
    type: 'pause';
}

export interface Song {
    author?: string;
    authorUrl?: string;
    genre?: string;
    year?: string;
    edition?: string;
    language?: string;
    sourceUrl?: string;
    videoGap?: number;
    artist: string;
    title: string;
    video: string;
    previewStart?: number;
    previewEnd?: number;
    gap: number;
    bpm: number;
    bar: number;
    tracks: SongTrack[];
    volume?: number;
}

export interface SongTrack {
    name?: string;
    sections: Section[];
}

export interface SongPreview extends Omit<Song, 'tracks'> {
    file: string;
    tracksCount: number;
    tracks: Array<Pick<SongTrack, 'name'>>;
    search: string;
}

export interface FrequencyRecord {
    timestamp: number;
    frequency: number;
}

export interface NoteFrequencyRecord extends FrequencyRecord {
    preciseDistance: number;
}

export interface PlayerNote {
    start: number;
    length: number;
    distance: number;
    note: Note;
    isPerfect: boolean;
    vibrato: boolean;
    frequencyRecords: NoteFrequencyRecord[];
}

type UndefinedKeys<T> = {
    [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

export type ExtractOptional<T> = Pick<T, Exclude<UndefinedKeys<T>, undefined>>;

export type DetailedScore = Record<Note['type'] | 'perfect' | 'vibrato', number>;
