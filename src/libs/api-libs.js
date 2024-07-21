<<<<<<< HEAD
import axios from 'axios';

export const getLogin = async (username, password) => {
    try {
        const response = await axios.post('https://dummyjson.com/auth/login', {
            username,
            password
        });
        return response;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response from server');
        } else {
            // Something else caused the error
            throw new Error(error.message);
        }
    }
=======
import axios from 'axios';

export const getLogin = async (username, password) => {
    try {
        const response = await axios.post('https://dummyjson.com/auth/login', {
            username,
            password
        });
        return response;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 2xx
            throw new Error(error.response.data.message || 'Login failed');
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response from server');
        } else {
            // Something else caused the error
            throw new Error(error.message);
        }
    }
>>>>>>> 5e06176eb4014e5f90154783ec7aa0f7665779a4
};