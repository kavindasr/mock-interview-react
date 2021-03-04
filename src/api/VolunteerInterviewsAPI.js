import { getRequest, postRequest, putRequest, deleteRequest} from "./utils";

const BASE_URL = "/interview/volunteer";

export const getAllParticipants = (id) => getRequest(`${BASE_URL}/${id}`);

export const deleteInterviewee = (id) => deleteRequest(`${BASE_URL}/${id}`);

export const updateParticipants = (id,data) => putRequest(`/interviewee/volunteer/${id}`,data);

export const saveInterviewees = (data) => postRequest(`/interview`,data);

export const getUser = (id) => getRequest(`${BASE_URL}/${id}`);

export const changePassword = (data,id) => postRequest(`${BASE_URL}/changePassword/${id}`,data);