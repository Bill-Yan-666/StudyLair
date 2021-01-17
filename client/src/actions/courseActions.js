import axios from 'axios';
import { DROP_COURSE, ENROLL_COURSE, SET_COURSE, REQUEST_SUCCEED, REQUEST_FAILED, FETCH_COURSE_INFO } from './types';

export const fetch_course_info = (courseInfo) => async (dispatch) => {
    console.log('Inside course actions, start fetching course info');

    axios.post('/api/courses/fetchCourse', courseInfo)

    // When the array of students is fetched
    .then((response) => dispatch(
    {
        type: FETCH_COURSE_INFO,
        payload: response.data.studentList,
    }))

    // If cannot find the course
    .catch((error) => console.log(error));
}

// The course should be an object structure as
// { name: 'course name', pro: 'instructor name'}
export const add_course = (course) => async (dispatch) => {
    console.log('Inside course actions, start adding course');

    axios.post('/api/courses/profAddCourse', course)

    // When the promise is fulfilled, dispatch a success note
    .then(dispatch(
    {
        type: REQUEST_SUCCEED,
        payload: null,
    }))

    // If error comes up, dispatch a failed note
    .catch((error) => dispatch(
    {
        type: REQUEST_FAILED,
        payload: error.response.data,
    }));
}

// The course should be an object like above
// The student should be the one stored as props.auth.user
export const enroll_course = (student, course) => async (dispatch) => {
    console.log('Now inside actions, start enrolling course');

    try
    {
        const id = student.id ? student.id : student._id;

        // Update both the course and the student
        const { data } = await axios.patch(`/api/users/enrollCourse/${id}`, course);

        // Dispatch to update the student
        dispatch({
            type: ENROLL_COURSE,
            payload: data,
        })

        // Report success
        dispatch({
            type: REQUEST_SUCCEED,
            payload: null,
        })
    }
    catch (error)
    {
        console.log(error);
        dispatch({
            type: REQUEST_FAILED,
            payload: error.response.data,
        });
    }
}

export const drop_course = (student, course) => async (dispatch) => {
    console.log('Now inside course actions, start droping course');

    try
    {
        const id = student.id ? student.id : student._id;

        // Update both the student and the course
        const { data } = await axios.patch(`/api/users/dropCourse/${id}`, course);

        // Dispatch to update the student
        dispatch({
            type: DROP_COURSE,
            payload: data,
        })

        // Report success
        dispatch({
            type: REQUEST_SUCCEED,
            payload: null,
        })
    }
    catch (error)
    {
        dispatch({
            type: REQUEST_FAILED,
            payload: error.response.data,
        });
    }
}

export const set_course = (courseInfo) => (dispatch) => {
    console.log('Now inside course actions, setting the current course');

    dispatch({
        type: SET_COURSE,
        payload: courseInfo,
    })
}