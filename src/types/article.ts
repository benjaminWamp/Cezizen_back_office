import { CategoryType } from "./category";
import { ImageType } from "./image";
import { UserType } from "./user";

export interface ArticleType {
    id: number;
    label: string;
    description: string;
    content: string;
    category: CategoryType;
    categoryId: string
    user: UserType;
    userId: number;
    createdAt: string;
    updatedAt: string;
    articleImages: ImageType[];
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