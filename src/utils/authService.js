import axiosClient from './AxiosClient';
import Cookies from 'js-cookie';

const getHeaders = () => ({
    headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
});

export const getCSRFToken = () => axiosClient.get('api/v1/auth/csrf/');

export const login = async (credentials) => {
    await getCSRFToken();
    return axiosClient.post('api/v1/auth/login/', credentials, getHeaders());
};

export const logout = () => axiosClient.post('api/v1/auth/logout/', {}, getHeaders());

export const getME = () => axiosClient.get('api/v1/auth/user/me/', getHeaders());

export const createUser = (userData, userType) => axiosClient.post(`api/v1/auth/user/?type=${userType}`, userData, getHeaders());

export const getAllUsers = () => axiosClient.get('api/v1/auth/user/', getHeaders());

export const updateUser = (userId, updatedData) => axiosClient.put(`api/v1/auth/user/${userId}/`, updatedData, getHeaders());

export const deleteUser = (userId) => axiosClient.delete(`api/v1/auth/user/${userId}/`, getHeaders());

export const getAllGroups = () => axiosClient.get('api/v1/auth/group/', getHeaders());

export const createGroup = (groupData) => axiosClient.post('api/v1/auth/group/', groupData, getHeaders());

export const updateGroup = (groupId, groupData) => axiosClient.put(`api/v1/auth/group/${groupId}/`, groupData, getHeaders());

export const deleteGroup = (groupId) => axiosClient.delete(`api/v1/auth/group/${groupId}/`, getHeaders());

export const getAllPermissions = () => axiosClient.get('api/v1/auth/permission/', getHeaders());

export const getAllVenues = () => axiosClient.get('api/v1/api/venue/', getHeaders());

export const createProposal = (proposalData) => axiosClient.post('api/v1/api/proposal/', proposalData, getHeaders());

export const getUserProposals = () => axiosClient.get('api/v1/api/proposal/get_all_proposals_by_user/', getHeaders());

export const createVenueBooking = (bookingData) => axiosClient.post('api/v1/api/booking/', bookingData, getHeaders());

export const getApprovedProposals = () => axiosClient.get('api/v1/api/proposal/', getHeaders()).then(res => res.data.filter(p => p.status === 1));

export const getVenueBookings = () => axiosClient.get('api/v1/api/booking/', getHeaders());

export const approveBooking = (bookingId) => axiosClient.post(`api/v1/api/booking-approval/${bookingId}/approve/`, {}, getHeaders());

export const rejectBooking = (bookingId, comments) => axiosClient.post(`api/v1/api/booking-approval/${bookingId}/reject/`, { comments }, getHeaders());

export const getAllClubsDetails = () => axiosClient.get(`api/v1/api/club/get_all_club_details/`, getHeaders());

export const getAllClubs = () => axiosClient.get('api/v1/api/club/', getHeaders());

export const submitReport = (formData) => axiosClient.post('api/v1/api/report/', formData, { headers: { ...getHeaders().headers, "Content-Type": "multipart/form-data" } });


