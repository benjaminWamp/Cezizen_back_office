import { ResourceType } from "./resource";

export interface CategoryType {
    id:  string  
    name: string
    description: string 
    ressources: ResourceType[]
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