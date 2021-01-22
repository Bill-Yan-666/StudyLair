import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import SwipeDeck from './Swipe/SwipeDeck.js';

import { fetch_and_filter } from '../../../actions/courseActions';
import { get_buddies, remove_buddy, like_buddy, unlike_buddy } from '../../../actions/userActions';

class MyBuddy extends Component
{
    constructor(props)
    {
        super(props);
        const emptyStudent = { name:'', major:'', gender:'', gradYear:'', email:'', classList:[], availability:[], photo:'' };
        this.state = 
        {
            student: emptyStudent, 
            classList: props.classList, 
            index: 0, 
            user: props.user, 
            studentList: null, 
            stu_loaded: false,
            buddyList: null,
            bud_loaded: false,
        }        
    }

    static getDerivedStateFromProps(nextProps, currentState)
    {
        if (nextProps.classList !== currentState.classList)
        {
            if (nextProps.classList[0])
            {
                nextProps.fetch_and_filter(nextProps.classList[0].class_name, nextProps.classList[0].buddy_list, nextProps.classList[0].unlike_list, nextProps.user._id || nextProps.user.id);
                nextProps.get_buddies(nextProps.classList[0].buddy_list);
            }

            return { ...currentState, classList: nextProps.classList, };
        }

        if (nextProps.stu_loaded && !currentState.stu_loaded && nextProps.bud_loaded && !currentState.bud_loaded)
        {
            return { ...currentState, studentList: nextProps.studentList, stu_loaded: true, buddyList: nextProps.buddyList, bud_loaded: true };
        }
        
        if (nextProps.buddyList !== currentState.buddyList || nextProps.studentList !== currentState.studentList)
        {
            return { ...currentState, buddyList: nextProps.buddyList, studentList: nextProps.studentList };
        }

        return null;
    }

    flip = (direction) => 
    {
        this.popUpControl(false);

        let index = this.state.index + direction;
        let course = this.state.classList[index];

        this.setState({ ...this.state, index: index, stu_loaded: false, bud_loaded: false });
        this.props.fetch_and_filter(course.class_name, course.buddy_list, course.unlike_list, this.state.user._id || this.state.user.id);
        this.props.get_buddies(course.buddy_list);
    }

    removeBuddy = (buddyId) =>
    {
        let userId = this.state.user.id || this.state.user._id;
        this.props.remove_buddy(userId, buddyId, this.state.classList[this.state.index].class_name);
    }

    // Define the function handle for api call for liking/unliking
    likeOrUnlike = async (userId, student, status, className ) =>
    {
        if (status === 1)
        {
            await this.props.like_buddy(userId, student._id, className);
        }
        else
        {
            await this.props.unlike_buddy(userId, student._id, className);
        }
    }

    setBuddy = (buddy) =>
    {
        this.setState({ ...this.state, student: buddy });
        this.popUpControl(true);
    }

    timeMapper = (time) =>
    {
        let result = '';
        result += time.day + ':  ';

        if (time.start % 2)
        {
            result += Math.floor(time.start / 2) + ':30 to ';
        }
        else
        {
            result += time.start / 2 + ':00 to ';
        }

        if (time.end % 2)
        {
            result += Math.floor(time.end / 2) + ':30 ';
        }
        else
        {
            result += time.end / 2 + ':00 ';
        }

        return result;
    }

    popUpControl = (show) =>
    {
        const pop = document.getElementById('DetailPopUp');

        pop.style.display = show ? 'block' : 'none';
    }

    updateStatus = (like) =>
    {
        const message = document.getElementsByClassName('swipe_action')[0];

        // Set the display text
        message.innerHTML = like ? 'Liked' : 'Disliked';

        // Remove and add the class name to replay the css animation
        message.classList.remove('swipe_action');
        setTimeout(() => message.classList.add('swipe_action'), 10);
    }

    render()
    {
        const index = this.state.index;
        const classList = this.state.classList;

        return (
            <div className='row'>
                {/* Pop-Up for viewing buddy profile */}
                <div id='DetailPopUp'>
                    {/* Button */}
                    <button className="btn-floating btn-large red" style={{ marginTop: "-2%", left: "97%" }} onClick={(e) => this.popUpControl(false)}>
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
                            <p><b>Courses Enrolled: </b>{this.state.student.classList.map((combo) => combo.class_name + ', ')}</p>
                        </div>

                        {/* Social media */}
                        <div className='col s12' style={{ fontSize: '24px', marginTop: '15px' }}>
                            <b>Social Medias:</b><br/>
                            <div className='col s12 m6 l3' style={{ display: 'flex', alignContent: 'center' }}>
                                <img src='http://blog.mobiversal.com/wp-content/uploads/2016/06/snapchat-icon-1.png' alt='Snapchat' style={{ width: '3rem', padding: '5px' }} />
                                {this.state.student.Snapchat}
                            </div>
                            
                            <div className='col s12 m6 l3' style={{ display: 'flex', alignContent: 'center' }}>
                                <img src='https://cdn.pixelprivacy.com/wp-content/uploads/2018/02/Instagram-Icon.png' alt='Instagram' style={{ width: '3rem', padding: '5px' }} />
                                {this.state.student.Instagram}
                            </div>

                            <div className='col s12 m6 l3' style={{ display: 'flex', alignContent: 'center' }}>
                                <img src='https://coindoo.com/wp-content/uploads/2019/01/facebook-icon.png' alt='Facebook' style={{ width: '3rem', padding: '5px' }} />
                                {this.state.student.Facebook}
                            </div>

                            <div className='col s12 m6 l3' style={{ display: 'flex', alignContent: 'center' }}>
                                <img src='https://image.flaticon.com/icons/png/512/889/889153.png' alt='Wechat' style={{ width: '3rem', padding: '5px' }} />
                                {this.state.student.Wechat}
                            </div>
                        </div>

                        {/* Availabilities */}
                        <div id='Chips' className='col s12' style={{ fontSize: '24px', marginTop: '15px' }}>
                            <b>Availabilities: </b>
                            {this.state.student.availability.map((time) =>
                            (
                                <div className='chip' key={time.day + time.start + time.end}>{this.timeMapper(time)}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Course Switch Bar */}
                <div className='col s12' style={{ textAlign: 'center', marginTop: '2%' }}>
                    <div className='col s3 m2'>
                    {!index ? '' :
                        <button className='btn-flat' onClick={() => this.flip(-1)} style={{ marginTop: '13px'}}>
                            <i className='material-icons' style={{ fontSize: '40px'}}>arrow_back</i>
                        </button>
                    }
                    </div>
                    
                    <div className='col s6 m8'>
                        <h2 style={{ display: 'inline-block', margin: '0px' }}>
                            {classList[index] ? classList[index].class_name : ''}
                        </h2>
                    </div>
                    
                    <div className='col s3 m2'>
                    {(index === classList.length-1) || (classList.length === 0) ? '' :
                        <button className='btn-flat' onClick={() => this.flip(1)} style={{ marginTop: '13px'}}>
                            <i className='material-icons' style={{ fontSize: '40px'}}>arrow_forward</i>
                        </button>
                    }
                    </div>
                </div>
                
                {/* Current Buddies */}
                <div className='col s12 m5'>
                    <div className='col s12'><h5>My Buddies</h5><div className='divider'></div></div>

                    <ul className='collection col s12' style={{ border: 'none', }}>
                        {!this.state.buddyList ? '' : this.state.buddyList.map((item) => 
                        (
                            <li key={item._id} className='collection-item avatar' style={{ paddingLeft: '90px', borderRadius: '20px', marginBottom: '2%', }}>
                                <button style={{ width: '100%', border: 'none', padding: '0', backgroundColor: 'transparent', textAlign: 'inherit', }} onClick={(e) => this.setBuddy(item)}>
                                    <img className='circle' src={item.photo} alt="" style={{ height: '60px', width: '60px', borderRadius: '25%', }} />
                                    <span style={{ fontSize: '20px',  lineHeight: '35px', }}>{item.name}</span>
                                    <p>{item.major}</p>
                                </button>   
                                <button key={item.name} className='btn-floating btn-large' style={{ position: 'absolute', right: '5%', top: '17%', backgroundColor: 'red', zIndex: '0' }} onClick={(e) => this.removeBuddy(item._id)}>
                                    <i className='material-icons large'>delete</i>
                                </button> 
                            </li>
                        ))}
                        
                    </ul>
                </div>

                {/* Tinder */}
                {!this.state.stu_loaded ? <h1>Loading...</h1> : 
                <div className='col s12 m7 cardHolder'>
                    <SwipeDeck 
                        studentInfo={this.props.studentList} 
                        userId={this.state.user.id || this.state.user._id} 
                        className={this.state.classList[this.state.index].class_name} 
                        likeOrUnlike={this.likeOrUnlike}
                        updateStatus={this.updateStatus}
                    />
                </div>}

                 {/* Status box for reporting user action */}
                 <div className='col s12 m7 offset-m5 swipe_action'>
                    This will hold the text for displaying status of action
                </div>
            </div>
        )
    }
}

MyBuddy.propTypes = 
{
    user: PropTypes.object.isRequired,
    classList: PropTypes.array.isRequired,
    studentList: PropTypes.array,
    stu_loaded: PropTypes.bool.isRequired,
    buddyList: PropTypes.array,
    bud_loaded: PropTypes.bool.isRequired,

    fetch_and_filter: PropTypes.func.isRequired,
    get_buddies: PropTypes.func.isRequired,
    remove_buddy: PropTypes.func.isRequired,
    like_buddy: PropTypes.func.isRequired,
    unlike_buddy: PropTypes.func.isRequired,
};

function mapStateToProps(state)
{
    return { 
        user: state.auth.user, 
        classList: state.auth.user.classList, 
        studentList: state.courseInfo.studentList, 
        stu_loaded: state.courseInfo.loaded, 
        buddyList: state.auth.buddyList,
        bud_loaded: state.auth.bud_loaded,
    };
}

export default connect(mapStateToProps, { fetch_and_filter, get_buddies, remove_buddy, like_buddy, unlike_buddy })(MyBuddy);