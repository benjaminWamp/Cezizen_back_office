import { CitizenType } from "./citizen";
import { ResourceType } from "./resource";

export interface FavoriteType {
    id: string;
    citizen: CitizenType;
    citizenId: string;
    ressource: ResourceType;
    ressourceId: string;
}