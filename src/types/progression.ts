import { CitizenType } from "./citizen";
import { StepType } from "./step";

export interface ProgressionType {
    id: string;
    completed: boolean;
    dateCompleted: Date;
    citizen: CitizenType;
    citizenId: string;
    step: StepType;
    stepId: string;
}