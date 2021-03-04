import { getRequest, postRequest, putRequest, deleteRequest} from "./utils";

const BASE_URL = "/interviewee";

export const getAllInterviewee = () => getRequest(`${BASE_URL}`);

export const deleteInterviewee = (id) => deleteRequest(`${BASE_URL}/${id}`);

export const updateInterviewee = (id,data) => putRequest(`${BASE_URL}/${id}`,data);

export const saveInterviewee = (data) => postRequest(`${BASE_URL}`,data);
