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
 * ✅ Updates a user and their associated profile.
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
 * 🔥 Delete a user by ID
 *
 * @param {number} userId - The ID of the user to delete
 *
 * Example:
 * await deleteUser(23)
 */
export const deleteUser = async (userId) => {
    const csrfToken = Cookies.get('csrftoken');
    const response = await axiosClient.delete('api/v1/auth/user/', {
      headers: {
        "X-CSRFToken": csrfToken,
      },
      data: {
        id: userId, // Django expects this in request body
      },
    });
    return response.data;
  };
  