import { ADD_COURSE, SET_COURSE, FETCH_COURSE_INFO } from "../actions/types";

const initialState = 
{
    currentCourse: {},
    studentList: [{}],
    loaded: false,
}

export default function (state = initialState, action){
    switch (action.type) 
    {
        case ADD_COURSE:
            console.log("Now inside the course info reducer, course added successfully");
            return state;

        case SET_COURSE:
            return { ...initialState, currentCourse: action.payload };

        case FETCH_COURSE_INFO:
            return { ...state, studentList: action.payload, loaded: true };

        default:
            return state;
    }
}