import {  postRequest } from "./utils";


export const changepassword = (id,data) => postRequest(`/users/changePassword/${id}`,data);