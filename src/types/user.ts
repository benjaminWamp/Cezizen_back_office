import { ArticleType } from "./article";
import { RoleType } from "./role";
import { SessionType } from "./session";

export interface UserType {
    id: number;
    firstname: string;
    email: string;
    lastname: string;
    password: string;
    role: RoleType
    roleId: string
    articles: Array<ArticleType>;
    sessions: Array<SessionType>;
  }

export interface UserAddType
 {
  data: UserType,
  message: string
 }  
export interface UsersType {
    data: UserType[];
    message: string
    total: number;
  }