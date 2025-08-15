import axiosClient from './AxiosClient';
import Cookies from 'js-cookie';

const TOKEN_KEY = 'authToken';

// Function to get the token from localStorage
const getToken = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
};

// Function to set the token in localStorage
const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Function to remove the token from localStorage
const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    console.log('removeToken: Token removed');
};

// Axios Interceptor to add Authorization header
axiosClient.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
            console.log('Axios Interceptor: Adding Authorization header with token');
        }
        // Add X-CSRFToken for non-GET requests if available
        if (config.method !== 'get') {
            const csrfToken = Cookies.get('csrftoken');
            if (csrfToken) {
                config.headers['X-CSRFToken'] = csrfToken;
                console.log('Axios Interceptor: Adding X-CSRFToken');
            }
        }
        console.log('Axios Interceptor: Request config', config);
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

export const createUser = (userData, userType) => {
  let url = 'api/v1/auth/user/';
  if (userType) {
    url += `?type=${userType}`;
  }
  return axiosClient.post(url, userData);
};

export const getAllUsers = () => axiosClient.get('api/v1/auth/user/');

export const updateUser = (userId, updatedData) => axiosClient.put(`api/v1/auth/user/${userId}/`, updatedData);

export const deleteUser = (userId) => axiosClient.delete(`api/v1/auth/user/${userId}/`);

export const getAllGroups = () => axiosClient.get('api/v1/auth/group/');

export const createGroup = (groupData) => axiosClient.post('api/v1/auth/group/', groupData);

export const updateGroup = (groupId, groupData) => axiosClient.put(`api/v1/auth/group/${groupId}/`, groupData);

export const deleteGroup = (groupId) => axiosClient.delete(`api/v1/auth/group/${groupId}/`);

export const getAllPermissions = () => axiosClient.get('api/v1/auth/permission/');

export const getAllVenues = () => axiosClient.get('api/v1/api/venue/');

export const createVenue = (venueData) => axiosClient.post('api/v1/api/venue/', venueData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });

export const updateVenue = (venueId, venueData) => axiosClient.put(`api/v1/api/venue/${venueId}/`, venueData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });

export const deleteVenue = (venueId) => axiosClient.delete(`api/v1/api/venue/${venueId}/`, { withCredentials: true });

export const createProposal = (proposalData) => axiosClient.post('api/v1/api/proposal/', proposalData);

export const updateProposal = (proposalId, proposalData) => axiosClient.put(`api/v1/api/proposal/${proposalId}/`, proposalData);

export const deleteProposal = (proposalId) => axiosClient.delete(`api/v1/api/proposal/${proposalId}/`);

export const getUserProposals = () => axiosClient.get('api/v1/api/proposal/get_all_proposals_by_user/');

export const createVenueBooking = (bookingData) => axiosClient.post('api/v1/api/booking/', bookingData);

export const updateVenueBooking = (bookingId, bookingData) => axiosClient.put(`api/v1/api/booking/${bookingId}/`, bookingData);

export const deleteVenueBooking = (bookingId) => axiosClient.delete(`api/v1/api/booking/${bookingId}/`);

export const getApprovedProposals = () => axiosClient.get('api/v1/api/proposal/').then(res => res.data.filter(p => p.status === 1));

export const getVenueBookings = () => axiosClient.get('api/v1/api/booking/');

export const getVenueBookingsByVenueId = (venueId) => axiosClient.get(`api/v1/api/booking/by_venue/${venueId}/`);

export const approveBooking = (bookingId) => axiosClient.post(`api/v1/api/booking-approval/${bookingId}/approve/`, {});

export const rejectBooking = (bookingId, comments) => axiosClient.post(`api/v1/api/booking-approval/${bookingId}/reject/`, { comments });

export const getAllClubsDetails = () => axiosClient.get(`api/v1/api/club/get_all_club_details/`);

export const getAllClubs = () => axiosClient.get('api/v1/api/club/');

export const submitReport = (formData) => axiosClient.post('api/v1/api/report/', formData, { headers: { "Content-Type": "multipart/form-data" } });

export const createEvent = (eventData) => axiosClient.post('api/v1/api/event/', eventData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const getAllEventTypes = () => axiosClient.get('api/v1/api/event-type/');

export const getAllEvents = (searchTerm = '', eventType = '') => {
    let url = 'api/v1/api/event/';
    const params = new URLSearchParams();

    if (searchTerm) {
        params.append('search', searchTerm);
    }
    if (eventType) {
        params.append('event_type', eventType);
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }
    return axiosClient.get(url);
};

export const deleteEvent = (eventId) => axiosClient.delete(`api/v1/api/event/${eventId}/`);

export const getEventById = (eventId) => axiosClient.get(`api/v1/api/event/${eventId}/`);

export const updateEvent = (eventId, eventData) => axiosClient.put(`api/v1/api/event/${eventId}/`, eventData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const getClubDetailsByName = (clubName) => axiosClient.get(`api/v1/api/club/get_by_name/?name=${clubName}`);

export const approveProposal = (proposalId) => axiosClient.post(`api/v1/api/proposal/${proposalId}/approve/`, {});

export const rejectProposal = (proposalId, comments) => axiosClient.post(`api/v1/api/proposal/${proposalId}/reject/`, { comments });

export const getProposalById = (proposalId) => axiosClient.get(`api/v1/api/proposal/${proposalId}/`);

export const getAllProposals = () => axiosClient.get('api/v1/api/proposal/');

export const getPendingBookings = () => axiosClient.get('api/v1/api/booking-approval/pending/');

export const getVenueBookingById = (bookingId) => axiosClient.get(`api/v1/api/booking/${bookingId}/`);

export const createClub = (clubData) => axiosClient.post('api/v1/api/club/', clubData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const getClubDetails = (clubId) => axiosClient.get(`api/v1/api/club/${clubId}/`);

export const updateClub = (clubId, clubData) => axiosClient.put(`api/v1/api/club/${clubId}/`, clubData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const deleteClub = (clubId) => axiosClient.delete(`api/v1/api/club/${clubId}/`);

export const getClubMembers = (clubId) => axiosClient.get(`api/v1/api/club/${clubId}/members/`);

export const addClubMember = (clubId, userId) => axiosClient.post(`api/v1/api/club/${clubId}/add_member/`, { user: userId });

export const removeClubMember = (clubId, userId) => axiosClient.post(`api/v1/api/club/${clubId}/remove_member/`, { user_id: userId });