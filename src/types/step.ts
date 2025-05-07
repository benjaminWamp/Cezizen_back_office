import { ProgressionType } from "./progression";
import { ResourceType } from "./resource";

export interface StepType {
    id: string;
    title: string;
    description: string;
    order: number;
    ressource: ResourceType;
    ressourceId: string;
    progression: ProgressionType[]
}