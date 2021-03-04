import { getRequest, postRequest, putRequest, deleteRequest} from "./utils";

const BASE_URL = "/company";

export const getAllCompanies = () => getRequest(`${BASE_URL}`);

export const deleteCompanies = (id) => deleteRequest(`${BASE_URL}/${id}`);

export const updateCompanies = (id,data) => putRequest(`${BASE_URL}/${id}`,data);

export const getCompanydetails = (id) => getRequest(`/panel/${id}`);

export const getAllCompaniesVolun = (id) => getRequest(`panel/volunteer/${id}`);

export const saveCompamies = (data) => postRequest(`${BASE_URL}`,data);