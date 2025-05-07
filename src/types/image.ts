import { ResourceType } from "./article";

export interface ImageType {
    id: string;
    url: Blob;
    ressources: ResourceType[];
}