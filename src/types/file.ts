import { ResourceType } from "./resource";

export interface FileType {
    id : string;
    path : Blob;
    ressources: ResourceType[]
}