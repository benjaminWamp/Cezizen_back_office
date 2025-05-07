export interface ResourceTypeType {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceAddType
 {
  data: ResourceTypeType,
  message: string
 }  

export interface ResourcesType {
    data: ResourceTypeType[];
    message: string
    total: number;
  }