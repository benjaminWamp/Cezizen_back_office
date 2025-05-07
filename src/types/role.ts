export interface RoleType {
  label: string;
  id: string;
}
export interface RoleAddType
 {
  data: RoleType,
  message: string
 }  
export interface RolesType {
    data: RoleType[];
    message: string
  }
