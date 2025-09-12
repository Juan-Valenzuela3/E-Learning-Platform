import { ROLES } from "./roles";

//Aqui estoy mapeando los roles del backend al frontend

export const roleMapper = {
  STUDENT : ROLES.STUDENT,
  TEACHER: ROLES.TEACHER,
  ADMIN: ROLES.ADMIN
}


export const mapBackendRole = (backendRole) => {
  return roleMapper[backendRole] || null;
};