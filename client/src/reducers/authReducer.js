import { SET_CURRENT_USER, DROP_COURSE, ENROLL_COURSE, GET_BUDDIES } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = 
{
    isAuthenticated: false,
    user: {},
    buddyList: [],
    bud_loaded: false,
};

export default function(state = initialState, action) 
{
    switch (action.type) 
    {
        case SET_CURRENT_USER:
        {
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
            };
        }

        case DROP_COURSE:
        case ENROLL_COURSE:
        {
            console.log("Now inside the authentication reducer, course changed successfully");
            return {
                ...state,
                user: action.payload,
            };
        }

        case GET_BUDDIES:
        {
            console.log("Now inside the authentication reducer, buddies get succesfully");
            return {
                ...state,
                buddyList: action.payload,
                bud_loaded: true,
            }
        }

        default:
            return state;
    }
}
