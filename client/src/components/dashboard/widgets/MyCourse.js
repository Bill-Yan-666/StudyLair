import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { drop_course, enroll_course, set_course, } from '../../../actions/courseActions.js';
import Search from './Search/Search';
import './Widgets.css';


class MyCourse extends Component
{
    constructor(props)
    {
        super(props);
        const userRef = props.user;
        this.state = { user: userRef, classList: userRef.classList, courseName: "", courseProf: "", };
    }

    static getDerivedStateFromProps(nextProps, currentState)
    {
        if (nextProps.user !== currentState.user)
        {
            return {
                ...currentState,
                user: nextProps.user,
                classList: nextProps.user.classList,
            }
        }
        return null;
    }

    setCourse = (course) => {
        const courseInfo = { name: course[0], prof: course[1] };

        this.props.set_course(courseInfo);
    }

    enrollCourse = (event) => {
        event.preventDefault();

        const courseInfo = { name: event.target[0].value, prof: event.target[1].value };

        this.props.enroll_course(this.state.user, courseInfo);
    }

    removeCourse(course)
    {
        const courseInfo = { name: course.class_name };

        this.props.drop_course(this.state.user, courseInfo);
    }

    render()
    {
        return (
            <div className='container'>
                {/* Title section */}
                <div className="col s12 grey-text text-darken-1" style={{ textAlign:'center', marginTop:'5%'}}>
                    <h2>My Courses</h2>
                </div>

                {/* Course list section */}
                <ul className='collection'>
                    {!this.state.classList ? <h1>loading...</h1> : this.state.classList.map((course) => (
                        <li className='collection-item' key={course.class_name}>
                            <div>
                                <Link to='/courseDashboard' onClick={() => this.setCourse(course)}><h5>{course.class_name}</h5></Link>
                            </div>
                            <button className='secondary-content btn-floating btn-large' style={{ marginTop:'-40px' }} onClick={() => this.removeCourse(course)}>
                                <i className='material-icons large red'>delete</i>
                            </button>
                            <div style={{ marginLeft: "10%" }}>Instructor: {course[1]}</div>
                        </li>
                    ))}
                </ul>

                {/* Add course bar */}
                <div className="row">
                    <form noValidate onSubmit={this.enrollCourse}>
                        <div className="input-field col s5">
                            <i className="material-icons medium prefix">local_library</i>
                            <input id="courseName" type="text" value={this.state.courseName} onChange={(e) => this.setState({ ...this.state, courseName: e.target.value})}></input>
                            <label htmlFor="courseName">Course Name</label>
                        </div>
                        <div className="input-field col s5">
                            <i className="material-icons medium prefix">person</i>
                            <input id="courseProf" type="text" value={this.state.courseProf} onChange={(e) => this.setState({ ...this.state, courseProf: e.target.value})}></input>
                            <label htmlFor="courseProf">Instructor Name</label>
                        </div>
                        <button className="btn-floating btn-large waves-light green" type="submit" style={{ marginLeft:"5%", marginTop:"5px", }}>
                            <i className="material-icons large">add</i>
                        </button>
                    </form>
                </div>
                
                <Search/>
            </div>
        );
    }
}

MyCourse.propTypes = 
{
    drop_course: PropTypes.func.isRequired,
    enroll_course: PropTypes.func.isRequired,
    set_course: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    classList: PropTypes.array.isRequired
};

function mapStateToProps(state)
{
    return { user: state.auth.user, classList: state.auth.user.classList };
};

export default connect(mapStateToProps, { drop_course, enroll_course, set_course, })(MyCourse);