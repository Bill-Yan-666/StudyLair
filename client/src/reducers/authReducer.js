import { SET_CURRENT_USER, DROP_COURSE, ENROLL_COURSE } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = 
{
    isAuthenticated: false,
    user: {},
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
            console.log("Now inside the course info reducer, course changed successfully");
            return {
                ...state,
                user: action.payload,
            };
        }

        default:
            return state;
    }
}
