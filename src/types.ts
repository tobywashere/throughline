export type PersonStatus = 'prospect' | 'pre-date' | 'dating' | 'not-seeing';

export interface Person {
  id: string;
  name: string;
  howMet: string;
  status: PersonStatus;
  /** the status to return to if this person is currently 'not-seeing' */
  previousActiveStatus: 'pre-date' | 'dating' | null;
  greenFlags: string[];
  yellowFlags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface DateEntry {
  id: string;
  personId: string;
  occurredAt: number;
  location: string;
  rating: number; // 1-5
  significantMoments: string;
  feelingTags: string[];
  activityTags: string[];
  createdAt: number;
}

export type NoteTargetType = 'person' | 'date';

export interface Note {
  id: string;
  targetType: NoteTargetType;
  targetId: string;
  text: string;
  createdAt: number;
}
