import { getRequest, postRequest, putRequest, deleteRequest} from "./utils";

const BASE_URL = "/panel";

export const getAllPanels = () => getRequest(`${BASE_URL}`);

export const deletePanels = (id) => deleteRequest(`${BASE_URL}/${id}`);

export const updatePanels = (id,data) => putRequest(`${BASE_URL}/${id}`,data);

export const savePanels = (data) => postRequest(`${BASE_URL}`,data);

export const getUser = (id) => getRequest(`${BASE_URL}/${id}`);

export const ContactVolunteer = (id) => getRequest(`/users/${id}`);