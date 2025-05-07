import { CategoryType } from "./category";
import { CommentType } from "./comment";
import { FavoriteType } from "./favorite";
import { FileType } from "./file";
import { ImageType } from "./image";
import { StepType } from "./step";
import { ResourceTypeType } from "./resourceTypeType";

export interface ResourceType {
    id: number;
    title: string;
    description: string;
    maxParticipant: number;
    nbParticipant: number;
    category: CategoryType;
    categoryId: string
    typeRessourceId: string
    typeRessource: ResourceTypeType;
    file: FileType;
    fileId: string
    banner: ImageType;
    bannerId: string;
    step: StepType[];
    favorites: FavoriteType[];
    comment: CommentType[];
    isValidate: boolean;
    status: string;
    fileBytes?: File;
    bannerBytes?: File;
    deadLine?: string;
  }

export interface ResourceAddType
 {
  data: ResourceType,
  message: string
 }  
export interface ResourcesType {
    data: ResourceType[];
    message: string
    total: number;
  }