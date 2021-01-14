import React, { Component } from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

class MyBuddy extends Component
{
    constructor(props)
    {
        super(props);
        this.state = { classList: props.classList, index: 0, buddyList: null, MLList: null, tinderList: null }
    }

    static getDerivedStateFromProps(nextProps, currentState)
    {
        if (nextProps.classList !== currentState.classList)
        {
            return { ...currentState, classList: nextProps.classList, };
        }
        return null;
    }

    flip = (direction) => 
    {
        let index = direction ? this.state.index + 1 : this.state.index - 1;
        this.setState({ ...this.state, index: index });
    }

    render()
    {
        return (
            <div className='row'>
                {/* Course Switch Bar */}
                <div className='col s12 grey-text text-darken-1' style={{ textAlign: 'center', marginTop: '5%' }}>
                    <div className='col s3 m2'>
                    {!this.state.index ? '' :
                        <button className='btn-flat' onClick={() => this.flip(0)} style={{ marginTop: '13px'}}>
                            <i className='material-icons' style={{ fontSize: '40px'}}>arrow_back</i>
                        </button>
                    }
                    </div>
                    
                    <div className='col s6 m8'><h2 style={{ display: 'inline-block', margin: '0px' }}>{this.state.classList[this.state.index][0]}</h2></div>
                    
                    <div className='col s3 m2'>
                    {this.state.index === this.state.classList.length-1 ? '' :
                        <button className='btn-flat' onClick={() => this.flip(1)} style={{ marginTop: '13px'}}>
                            <i className='material-icons' style={{ fontSize: '40px'}}>arrow_forward</i>
                        </button>
                    }
                    </div>
                </div>
                
                <div className='col s12 m5'>
                    {/* Current Buddies */}
                    <div className='col s12'><h6>My Buddies</h6><div className='divider'></div></div>

                    {/* Cards */}
                    <div className='col s12' style={{ height: '220px', overflowY: 'auto' }}>
                        <div className='B-card' style={{ margin: '10px', height: '200px', width: '145px', padding: '0px', borderRadius: '40px', display: 'inline-block' }}>
                            <button style={{ textAlign: 'center', fontSize: '20px' }}>
                                <img src='http://thecartdriver.com/wp-content/uploads/2013/02/jojos-bizarre-adventure-cars-maniacal-laugh-460x258.jpg' alt=''
                                    style={{ height: '150px', borderRadius: '40px'}} />
                                Someone
                            </button>
                        </div>

                        <div className='B-card' style={{ margin: '10px', height: '200px', width: '145px', padding: '0px', borderRadius: '40px', display: 'inline-block' }}>
                            <button style={{ textAlign: 'center', fontSize: '20px' }}>
                                <img src='http://thecartdriver.com/wp-content/uploads/2013/02/jojos-bizarre-adventure-cars-maniacal-laugh-460x258.jpg' alt=''
                                    style={{ height: '150px', borderRadius: '40px'}} />
                                Someone
                            </button>
                        </div>

                        <div className='B-card' style={{ margin: '10px', height: '200px', width: '145px', padding: '0px', borderRadius: '40px', display: 'inline-block' }}>
                            <button style={{ textAlign: 'center', fontSize: '20px' }}>
                                <img src='http://thecartdriver.com/wp-content/uploads/2013/02/jojos-bizarre-adventure-cars-maniacal-laugh-460x258.jpg' alt=''
                                    style={{ height: '150px', borderRadius: '40px'}} />
                                Someone
                            </button>
                        </div>
                    </div>
                
                    {/* Recommendations */}
                    <div className='col s12'><h6>Recommended Buddies</h6><div className='divider'></div></div>

                    {/* Cards */}
                    <div className='col s12' style={{ height: '220px', overflowY: 'auto' }}>
                        <div className='B-card' style={{ margin: '10px', height: '200px', width: '145px', padding: '0px', borderRadius: '40px', display: 'inline-block' }}>
                            <button style={{ textAlign: 'center', fontSize: '20px' }}>
                                <img src='http://thecartdriver.com/wp-content/uploads/2013/02/jojos-bizarre-adventure-cars-maniacal-laugh-460x258.jpg' alt=''
                                    style={{ height: '150px', borderRadius: '40px'}} />
                                Someone
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tinder */}
                <div className='col s12 m7' style={{ textAlign: 'center' }}>
                    <div className='col s3 m2' style={{ marginTop: '200px'}}>
                        <button className='btn-flat'><i className='material-icons' style={{ fontSize: '50px' }}>chevron_left</i></button>
                    </div>

                    <div className='col s6 m8' style={{ height: '410px', padding: '0px', marginTop: '20px', marginBottom: '20px' }}>
                        <div className='B-card' style={{ width: '300px', margin: 'auto', height: '100%' }}>
                            <img src='https://i.ytimg.com/vi/8iL4Izfx8DM/maxresdefault.jpg' alt='' style={{ borderRadius: '10px' }} />
                            <p>Some Info</p>
                        </div>
                    </div>

                    <div className='col s3 m2' style={{ marginTop: '200px'}}>
                        <button className='btn-flat'><i className='material-icons' style={{ fontSize: '50px'}}>chevron_right</i></button>
                    </div>

                    <div className='col s12'><button className='btn-large green'>Accept</button></div>
                </div>
            </div>
        )
    }
}

MyBuddy.propTypes = 
{
    user: PropTypes.object.isRequired,
    classList: PropTypes.array.isRequired,
};

function mapStateToProps(state)
{
    return { user: state.auth.user, classList: state.auth.user.classList, };
}

export default connect(mapStateToProps, { })(MyBuddy);