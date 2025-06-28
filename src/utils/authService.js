// src/services/authService.js
import axiosClient from './AxiosClient';
import Cookies from 'js-cookie';

export const getCSRFToken = async () => {
    await axiosClient.get('api/v1/auth/csrf/'); 
};

export const login = async (credentials) => {
    await getCSRFToken()

    const csrfToken = Cookies.get('csrftoken');
    console.log("csrf : ", csrfToken);

    const response = await axiosClient.post('api/v1/auth/login/', credentials, {
        headers: {
            "X-CSRFToken": csrfToken, 
            
        },
    });
    return response;
};

export const logout = async () => {
    return axiosClient.post('api/v1/auth/logout/');
};


export const getME=async()=>{
    const csrfToken = Cookies.get('csrftoken');
    const response = await axiosClient.get('api/v1/auth/me/',{
        headers:{
            'X-CSRFToken':csrfToken,
        }
    })
    return response;
}


export const createUser = async (userData, userType) => {
    const csrfToken = Cookies.get('csrftoken');
    console.log("csrf : ", csrfToken);

    const response = await axiosClient.post(
        `api/v1/auth/user/?type=${userType}`,
        userData,
        {
            headers: {
                "X-CSRFToken": csrfToken, 
            },
        }
    );
    return response.data;
};

export const getAllUsers = async () => {
    const csrfToken = Cookies.get('csrftoken');
    const response = await axiosClient.get('api/v1/auth/user/', {
        headers: {
            "X-CSRFToken": csrfToken,
        },
    });
    return response.data;
};


/**
 * Updates a user and their associated profile.
 *
 * @param {Object} updatedData - The complete payload to update.
 * @param {string} userType - One of: 'clubMember', 'studentCouncil', 'facultyAdvisor', 'studentWelfare', 'securityHead'
 *
 * Example `updatedData` structure:
 * {
 *   id: 35,
 *   username: "samantha",
 *   email: "sam@college.edu",
 *   name: "Samantha",
 *   registration_id: "REG4567",
 *   role: 4,
 *   profile: {
 *     learner_id: "L12345",
 *     reg_number: "REG4567",
 *     post: "Vice President",
 *     club_name: "AI Club"
 *   }
 * }
 */
export const updateUser = async (updatedData, userType) => {
    console.log("Updating user with data:", updatedData);
    console.log("User type:", userType);
    const csrfToken = Cookies.get('csrftoken');
    const response = await axiosClient.put(
        `api/v1/auth/user/?type=${userType}`,
        updatedData,
        {
            headers: {
                "X-CSRFToken": csrfToken,
            },
        }
    );
    return response.data;
};

/**
 * Delete a user by ID
 *
 * @param {number} userId - The ID of the user to delete
 *
 * Example:
 * await deleteUser(23)
 */
export const deleteUser = async (user) => {
    const csrfToken = Cookies.get('csrftoken');
    const response = await axiosClient.delete('api/v1/auth/user/', {
      headers: {
        "X-CSRFToken": csrfToken,
      },
      data: {
        user, // Django expects this in request body
      },
    });
    return response.data;
  };
  

/**
 * Get all Venues
 *
 *
 * Example:
 * await getAllVenues()
 */
export const getAllVenues = async () => {
    const csrfToken = Cookies.get('csrftoken');
    const response = await axiosClient.get('api/v1/api/venue/get-all/', {
      headers: {
        "X-CSRFToken": csrfToken,
      }
    });
    return response.data;
  };


  export const createProposal = async (proposalData) => {
  const csrfToken = Cookies.get('csrftoken');
  try {
    const response = await axiosClient.post('api/v1/api/proposal/create/', proposalData, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating proposal:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserProposals = async () => {
  const csrfToken = Cookies.get('csrftoken');
  try {
    const response = await axiosClient.get('api/v1/api/proposal/get-all-by-user/', {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching proposals:', error.response?.data || error.message);
    throw error;
  }
};

export const createVenueBooking = async (bookingData) => {
  const csrfToken = Cookies.get('csrftoken');
  try {
    const response = await axiosClient.post('api/v1/api/booking/create/', bookingData, {
      headers: { "X-CSRFToken": csrfToken }
    });
    return response.data;
  } catch (error) {
    console.error('Booking failed:', error.response?.data || error.message);
    throw error;
  }
};

export const getApprovedProposals = async () => {
  const csrfToken = Cookies.get('csrftoken');
  try {
    const response = await axiosClient.get('api/v1/api/proposal/get-all-by-user/', {
      headers: { "X-CSRFToken": csrfToken }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching proposals:', error.response?.data || error.message);
    throw error;
  }
};

// Get venue bookings
export const getVenueBookings = async () => {
  const csrfToken = Cookies.get('csrftoken');
  try {
    const response = await axiosClient.get('api/v1/api/booking/get-all/', {
      headers: { "X-CSRFToken": csrfToken }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching venue bookings:', error.response?.data || error.message);
    throw error;
  }
};


export const approveBooking = async (bookingId) => {
  const csrfToken = Cookies.get('csrftoken');
  return axiosClient.post(`api/v1/api/approvals/approve/${bookingId}/`, {}, {
    headers: { "X-CSRFToken": csrfToken }
  });
};

export const rejectBooking = async (bookingId, comments) => {
  const csrfToken = Cookies.get('csrftoken');
  return axiosClient.post(`api/v1/api/approvals/reject/${bookingId}/`, { comments }, {
    headers: { "X-CSRFToken": csrfToken }
  });
};

export const getAllClubsDetails = async (bookingId, comments) => {
  const csrfToken = Cookies.get('csrftoken');
  return axiosClient.get(`api/v1/api/club/get-all-club-details/`, {
    headers: { "X-CSRFToken": csrfToken }
  });
};

export const getAllClubs = async () => {
  const csrfToken = Cookies.get('csrftoken');
  const response = await axiosClient.get('api/v1/api/club/get-all/', {
    headers: { "X-CSRFToken": csrfToken }
  });
  return response.data;
};

export const submitReport = async (formData) => {
  const csrfToken = Cookies.get('csrftoken');
  try {
    const response = await axiosClient.post('api/v1/api/reports/', formData, {
      headers: { 
        "X-CSRFToken": csrfToken,
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
