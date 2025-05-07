import { ResourceType } from "./resource";

export interface ImageType {
    id: string;
    url: Blob;
    ressources: ResourceType[];
}