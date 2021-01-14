import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

import { fetch_course_info } from '../../actions/courseActions.js';

import './Dashboard.css';

class CourseDashboard extends Component
{
    constructor(props)
    {
        super(props);
        const emptyStudent = { name:'', major:'', gender:'', gradYear:'', email:'', classList:[], photo:'' };
        this.state = { course: props.course, studentList: [{}], loaded: false, student: emptyStudent };
        props.fetch_course_info(props.course);
    }

    static getDerivedStateFromProps(nextProps, currentState)
    {
        if (nextProps.course !== currentState.course)
        {
            const emptyStudent = { name:'', major:'', gender:'', gradYear:'', email:'', classList:[] };
            return { course: nextProps.course, studentList: [{}], loaded: false, student: emptyStudent };
        }
        else if (nextProps.loaded !== currentState.loaded)
        {
            return { ...currentState, studentList: nextProps.studentList, loaded: true };
        }
        return null;
    }

    setStudent = (student) => 
    {
        this.setState({ ...this.state, student: student });
        this.popUpControl();
    }

    popUpControl()
    {
        const pop = document.getElementById('DetailPopUp');
        const visible = pop.style.display === 'block';

        pop.style.display = visible ? 'none' : 'block';
    }

    render()
    {
        return ( !this.state.course.name ? <Redirect to='/studentDashboard' /> :
        <div>
            {/* Pop-Up for viewing student profile */}
            <div id='DetailPopUp'>
                {/* Button */}
                <button className="btn-floating btn-large red" style={{ marginTop: "-2%", left: "97%" }} onClick={this.popUpControl}>
                    <i className='material-icons large'>close</i>
                </button>

                <div className='row' style={{ width: '90%' }}>
                    {/* Image */}
                    <div className='col s12 m5'>
                        <img src={this.state.student.photo ? this.state.student.photo : 'https://i.pinimg.com/736x/e9/38/3c/e9383c5c660d865b0ff5359a477e2507.jpg'} alt='' style={{ width: '100%', marginTop: '25%', borderRadius: '25%' }} />
                    </div>

                    {/* Personal details */}
                    <div className='col s12 m7' style={{ fontSize: '24px', paddingLeft: '5%' }}>
                        <h2 style={{ textAlign: 'center' }}>{this.state.student.name}</h2>
                        <p><b>Gender: </b>{this.state.student.gender}</p>
                        <p><b>Major: </b>{this.state.student.major}</p>
                        <p><b>Graduating in: </b>{this.state.student.gradYear}</p>
                        <p><b>Email: </b>{this.state.student.email}</p>
                        <p><b>Courses Enrolled: </b>{this.state.student.classList.map((combo) => combo[0] + ', ')}</p>
                    </div>
                </div>
            </div>

            {/* The header section */}
            <div>
                <div className='container'>
                    {/* Button that allows students to navigate back to their dashboard */}
                    <Link to='/studentDashboard'>
                        <div className='s12 col' style={{ marginTop: '5%' }}>
                            <button className='btn-flat white black-text' style={{ fontSize: '20px'}}>
                                <i className='material-icons large left' style={{ fontSize: '40px' }}>arrow_back</i>Dashboard
                            </button>
                        </div>
                    </Link>
                        

                    {/* A giant block displaying the course name and professor */}
                    <div className='row center-align' style={{ height: '200px', fontSize: '24px', }}>
                            <h1>{this.state.course.name}</h1><br/>
                            <i className='material-icons' style={{ fontSize: '40px', verticalAlign: 'bottom', }}>person</i>&nbsp; {this.state.course.prof}
                    </div>
                </div>
            </div>

            {/* Divider for background */}
            <div className='divider' style={{ height: '3px', }}></div>
    
            {/* Student cards section */}
            <div id='CardPanel'>
                <div className='row container'>
                    {!this.state.loaded ? <div className='center-align'><h1>Loading</h1></div> : this.state.studentList.map((student) => 
                        <div className="col s12 m6 l4" key={student.name}>
                            <div className="B-card">
                                <button onClick={() => this.setStudent(student)}>
                                    <img src={student.photo ? student.photo : 'https://gamepress.gg/arknights/sites/arknights/files/2019-11/char_263_skadi_2.png'} alt='' />
                                    <div className='B-card-content'>
                                        <h5>{student.name}</h5>
                                        <p><b>Major:</b> {student.major}</p>
                                        <p><b>Email:</b> {student.email}</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        );
    }
}

CourseDashboard.propTypes = 
{
    course: PropTypes.object.isRequired,
    studentList: PropTypes.array.isRequired,
    loaded: PropTypes.bool.isRequired,
    fetch_course_info: PropTypes.func.isRequired,
}

function mapStateToProps(state)
{
    return(
    { 
        course: state.courseInfo.currentCourse, 
        studentList: state.courseInfo.studentList, 
        loaded: state.courseInfo.loaded,
    });
}

export default connect(mapStateToProps, { fetch_course_info, })(CourseDashboard);