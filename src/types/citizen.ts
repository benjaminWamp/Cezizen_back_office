import { RoleType } from "./role";

export interface CitizenType {
    id: string;
    name: string;
    email: string;
    surname: string;
    password: string;
    role: RoleType
    roleId: string
  }

export interface CitizenAddType
 {
  data: CitizenType,
  message: string
 }  
export interface CitizensType {
    data: CitizenType[];
    message: string
    total: number;
  }