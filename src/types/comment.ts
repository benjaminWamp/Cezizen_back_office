import { CitizenType } from "./citizen";
import { ResourceType } from "./resource";

export interface CommentType {
    id: string;
    tile: string;
    description: string;
    citizen: CitizenType;
    citizenId: string;
    ressource: ResourceType;
    ressourceId: string;
}