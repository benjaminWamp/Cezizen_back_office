import { ArticleType } from "./article";

export interface CategoryType {
    id:  number  
    label: string
    ressources: ArticleType[]
}

export interface CategoryAddType
 {
  data: CategoryType,
  message: string
 }  

export interface CategoriesType {
    data: CategoryType[];
    message: string
    total: number;
  }