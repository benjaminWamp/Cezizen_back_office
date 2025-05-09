import { SessionType } from "./session";

export interface ExerciseType {
    id: number;
    label: string;
    times: string;
    description: string;
    inspiration: number;
    expiration: number;
    apnea: number;
    sessions: SessionType
  }

export interface ExerciseAddType
 {
  data: ExerciseType,
  message: string
 }  

export interface ExercisesType {
    data: ExerciseType[];
    message: string
    total: number;
  }