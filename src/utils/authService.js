import axiosClient from './AxiosClient';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'authToken';

// Function to get the token from localStorage
const getToken = () => localStorage.getItem(TOKEN_KEY);

// Function to set the token in localStorage
const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

// Function to remove the token from localStorage
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// Axios Interceptor to add Authorization header
axiosClient.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        // Add X-CSRFToken for non-GET requests if available
        if (config.method !== 'get') {
            const csrfToken = Cookies.get('csrftoken');
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

export const getCSRFToken = () => axiosClient.get('api/v1/auth/csrf/');

export const login = async (credentials) => {
    await getCSRFToken();
    const response = await axiosClient.post('api/v1/auth/login/', credentials);
    if (response.data.token) {
        setToken(response.data.token);
    }
    return response;
};

export const logout = () => {
    removeToken();
    return axiosClient.post('api/v1/auth/logout/', {});
};

export const getME = () => axiosClient.get('api/v1/auth/user/me/');

export const createUser = (userData, userType) => axiosClient.post(`api/v1/auth/user/?type=${userType}`, userData);

export const getAllUsers = () => axiosClient.get('api/v1/auth/user/');

export const updateUser = (userId, updatedData) => axiosClient.put(`api/v1/auth/user/${userId}/`, updatedData);

export const deleteUser = (userId) => axiosClient.delete(`api/v1/auth/user/${userId}/`);

export const getAllGroups = () => axiosClient.get('api/v1/auth/group/');

export const createGroup = (groupData) => axiosClient.post('api/v1/auth/group/', groupData);

export const updateGroup = (groupId, groupData) => axiosClient.put(`api/v1/auth/group/${groupId}/`, groupData);

export const deleteGroup = (groupId) => axiosClient.delete(`api/v1/auth/group/${groupId}/`);

export const getAllPermissions = () => axiosClient.get('api/v1/auth/permission/');

export const getAllVenues = () => axiosClient.get('api/v1/api/venue/');

export const createProposal = (proposalData) => axiosClient.post('api/v1/api/proposal/', proposalData);

export const getUserProposals = () => axiosClient.get('api/v1/api/proposal/get_all_proposals_by_user/');

export const createVenueBooking = (bookingData) => axiosClient.post('api/v1/api/booking/', bookingData);

export const getApprovedProposals = () => axiosClient.get('api/v1/api/proposal/').then(res => res.data.filter(p => p.status === 1));

export const getVenueBookings = () => axiosClient.get('api/v1/api/booking/');

export const approveBooking = (bookingId) => axiosClient.post(`api/v1/api/booking-approval/${bookingId}/approve/`, {});

export const rejectBooking = (bookingId, comments) => axiosClient.post(`api/v1/api/booking-approval/${bookingId}/reject/`, { comments });

export const getAllClubsDetails = () => axiosClient.get(`api/v1/api/club/get_all_club_details/`);

export const getAllClubs = () => axiosClient.get('api/v1/api/club/');

export const submitReport = (formData) => axiosClient.post('api/v1/api/report/', formData, { headers: { "Content-Type": "multipart/form-data" } });