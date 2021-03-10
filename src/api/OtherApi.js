import {  postRequest, putRequest } from "./utils";


export const changepassword = (id,data) => postRequest(`/users/changePassword/${id}`,data);

export const needHelp = (id,data) => putRequest(`/panel/needHelp/${id}`,data)