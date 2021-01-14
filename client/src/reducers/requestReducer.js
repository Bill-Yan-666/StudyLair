import { REQUEST_RESET, REQUEST_SUCCEED, REQUEST_FAILED } from '../actions/types.js';

const initialState = 
{
    success: true,
    message: '',
}

export default function(state = initialState, action)
{
    switch (action.type)
    {
        case REQUEST_SUCCEED:
        {
            return { ...state, success: true, message: 'Did it' };
        }

        case REQUEST_FAILED:
        {
            console.log(action.payload.message);
            return { ...state, success: false, message: action.payload.message };
        }

        case REQUEST_RESET:
        {
            return initialState;
        }

        default:
        {
            return state;
        }
    }
}