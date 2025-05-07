import { CategoryType } from "./category";
import { FileType } from "./file";
import { ImageType } from "./image";

export interface ArticleType {
    id: number;
    label: string;
    description: string;
    maxParticipant: number;
    nbParticipant: number;
    category: CategoryType;
    categoryId: string
    file: FileType;
    fileId: string
    banner: ImageType;
    bannerId: string;
    isValidate: boolean;
    status: string;
    fileBytes?: File;
    bannerBytes?: File;
    deadLine?: string;
  }

export interface ArticleAddType
 {
  data: ArticleType,
  message: string
 }  
export interface ArticlesType {
    data: ArticleType[];
    message: string
    total: number;
  }