import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import SwipeDeck from './Swipe/SwipeDeck.js';

import { fetch_and_filter } from '../../../actions/courseActions';
import { get_buddies, remove_buddy } from '../../../actions/userActions';

class MyBuddy extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        { 
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
                nextProps.fetch_and_filter(nextProps.classList[0].class_name, nextProps.classList[0].buddy_list, nextProps.classList[0].unlike_list);
                nextProps.get_buddies(nextProps.classList[0].buddy_list);
            }

            return { ...currentState, classList: nextProps.classList, };
        }

        if (nextProps.stu_loaded && !currentState.stu_loaded && nextProps.bud_loaded && !currentState.bud_loaded)
        {
            return { ...currentState, studentList: nextProps.studentList, stu_loaded: true, buddyList: nextProps.buddyList, bud_loaded: true };
        }
        
        if (nextProps.buddyList !== currentState.buddyList)
        {
            return { ...currentState, buddyList: nextProps.buddyList, studentList: nextProps.studentList, };
        }
        
        return null;
    }

    flip = (direction) => 
    {
        let index = this.state.index + direction;
        let course = this.state.classList[index];

        this.setState({ ...this.state, index: index, stu_loaded: false, bud_loaded: false });
        this.props.fetch_and_filter(course.class_name, course.buddy_list, course.unlike_list);
        this.props.get_buddies(course.buddy_list);
    }

    removeBuddy = (buddyId) =>
    {
        let userId = this.state.user.id || this.state.user._id;
        this.props.remove_buddy(userId, buddyId, this.state.classList[this.state.index].class_name);
    }

    render()
    {
        console.log(this.state.buddyList);
        const index = this.state.index;
        const classList = this.state.classList;

        return (
            <div className='row'>
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
                    <div className='col s12'><h6>My Buddies</h6><div className='divider'></div></div>

                    <ul className='collection col s12' style={{ border: 'none', }}>
                        {!this.state.buddyList ? '' : this.state.buddyList.map((item) => 
                        (
                            <li key={item._id} className='collection-item avatar' style={{ paddingLeft: '90px', borderRadius: '20px', marginBottom: '2%', }}>
                                <button style={{ width: '100%', border: 'none', padding: '0', backgroundColor: 'transparent', textAlign: 'inherit', }} onClick={(e) => console.log('Hi')}>
                                    <img className='circle' src={item.photo} alt="" style={{ height: '60px', width: '60px', borderRadius: '25%', }} />
                                    <span style={{ fontSize: '20px',  lineHeight: '35px', }}>{item.name}</span>
                                    <p>{item.major}</p>
                                </button>   
                                <button key={item.name} className='btn-floating btn-large' style={{ position: 'absolute', right: '5%', top: '17%', backgroundColor: 'red' }} onClick={(e) => this.removeBuddy(item._id)}>
                                    <i className='material-icons large'>delete</i>
                                </button> 
                            </li>
                        ))}
                        
                    </ul>
                </div>

                {/* Tinder */}
                <div id='Deckholder' className='col s12 m7'>
                    {!this.state.stu_loaded ? <h1>Loading...</h1> : <SwipeDeck studentInfo={this.state.studentList} userId={this.state.user.id || this.state.user._id} />}
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

export default connect(mapStateToProps, { fetch_and_filter, get_buddies, remove_buddy })(MyBuddy);