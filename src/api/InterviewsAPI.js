import { getRequest, postRequest, putRequest, deleteRequest} from "./utils";

const BASE_URL = "/interview/panel";

export const getAllParticipants = (id) => getRequest(`${BASE_URL}/${id}`);

export const getInterviewee = (id) => getRequest(`interviewee/${id}`);

export const deleteInterviews = (id) => deleteRequest(`${BASE_URL}/${id}`);

export const updateParticipants = (id,data) => putRequest(`${BASE_URL}/${id}`,data);

export const saveInterviews = (data) => postRequest(`${BASE_URL}`,data);

export const getUser = (id) => getRequest(`${BASE_URL}/${id}`);

export const changePassword = (data,id) => postRequest(`${BASE_URL}/changePassword/${id}`,data);