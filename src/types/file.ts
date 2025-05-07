import { ResourceType } from "./article";

export interface FileType {
    id : string;
    path : Blob;
    ressources: ResourceType[]
}