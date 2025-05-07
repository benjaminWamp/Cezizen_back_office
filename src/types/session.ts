import { UserType } from "./user";
import { ExerciseType } from "./exercise";

export interface SessionType {
    id: number;
    notes: string;
    endDate: Date;
    user: UserType;
    userId: number;
    exercise: ExerciseType;
    exerciseId: number;
  }

export interface SessionAddType
 {
  data: SessionType,
  message: string
 }  

export interface SessionsType {
    data: SessionType[];
    message: string
  }