import axios from 'axios';
import setAuthToken from '../utils/setAuthToken.js';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER, REQUEST_RESET } from './types.js';

// Register User
export const register_User = (userData, history) => async (dispatch) => {
    console.log('Inside user actions, registering user');

    try
    {
        // Make register request to server
        await axios.post('/api/users/register', userData);

        // Send user to login
        history.push('/login');
    }
    catch (error)
    {
        // Send to reducer to deal with any error
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data,
        });
    }
}

// Login user
export const login_user = (userData) => async (dispatch) => {
    console.log('Inside user actions, logging in');

    try
    {
        // Make login request to server
        const response = await axios.post('/api/users/login', userData);

        // The response contains the user token
        const token = response.data.token;

        // Save token on user's browser
        localStorage.setItem('jwtToken', token);

        // Set the auth property header
        setAuthToken(token);

        // Decode the token to get the user object
        const user = jwt_decode(token);

        // Set the current user in the state
        dispatch({
            type: SET_CURRENT_USER,
            payload: user,
        });
    }
    catch (error)
    {
        // Send to reducer to deal with any error
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data,
        })
    }
}

// Logout user
export const logout_User = () => async (dispatch) => {
    console.log('Inside user actions, logging out')

    // Remove the token from user's browser
    localStorage.removeItem('jwtToken');

    // Clear the auth property header
    setAuthToken(false);

    // Finally set the current user to nothing
    dispatch({
        type: SET_CURRENT_USER,
        payload: {},
    });
}

// Fetch the latest user info from server and set it to state
export const get_and_set_user = (user) => async (dispatch) => {
    console.log('Inside user actions, fetching and setting user');

    // Pull out the user's id and use that to find the user
    const userId = user.id ? user.id : user._id;
    const { data } = await axios.get(`/api/users/getStudent/${userId}`);

    // Set the user
    dispatch({
        type: SET_CURRENT_USER,
        payload: data,
    });
}

export const get_user = (user) => async (dispatch) => {
    console.log('Inside user actions, start fetching user info');

    const userId = user.id ? user.id : user._id;

    const response = await axios.get(`/api/users/getStudent/${userId}`);

    return response.data;
}

export const update_user = (user) => async (dispatch) => {
    console.log('Inside user actions, start updating user');

    await axios.patch('/api/users/updateStudent', user);

    return;
}

export const reset_status = () => (dispatch) => {
    console.log('Inside user actions, reseting the request status');

    dispatch({
        type: REQUEST_RESET,
        payload: null,
    })
}