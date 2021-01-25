import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileBase from 'react-file-base64';

import PropTypes from 'prop-types';
import M from 'materialize-css';

import { update_user } from '../../../actions/userActions.js';

class MyProfile extends Component
{
    constructor(props)
    {
        super(props);
        const userRef = props.user;
        this.state = 
        {
            name: userRef.name, gender: userRef.gender, major: userRef.major, gradYear: userRef.gradYear,
            email: userRef.email, bio: userRef.bio, photo: userRef.photo,

            Snapchat: userRef.Snapchat, Instagram: userRef.Instagram, Facebook: userRef.Facebook, Wechat: userRef.Wechat,

            availability: userRef.availability,
            day: 'Monday', start: 0, end: 0,

            input: false,
        }
    }

    static getDerivedStateFromProps(nextProps, currentState)
    {
        const userRef = nextProps.user;

        if (!currentState.input)
        {
            return {
                ...currentState,
                name: userRef.name, gender: userRef.gender, major: userRef.major, gradYear: userRef.gradYear,
                email: userRef.email, bio: userRef.bio, photo: userRef.photo,

                Snapchat: userRef.Snapchat, Instagram: userRef.Instagram, Facebook: userRef.Facebook, Wechat: userRef.Wechat,

                availability: userRef.availability,
            };
        }
        return null;
    }

    componentDidMount()
    {
        this.componentDidUpdate();
    }

    componentDidUpdate()
    {
        // Check if this update comes from user input
        if (this.state.input)
        {
            return;
        }

        let elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
        
        // Set form to be disabled
        const inputList = document.getElementsByTagName('input');

        for (const item of inputList) 
        {
            if (item.getAttribute('id') === 'courseName' || item.getAttribute('id') === 'courseProf')
            {
                continue;
            }
            item.setAttribute('disabled', '');
        }
        
        // Set all labels to be active
        const labelList = document.getElementsByTagName('label');

        for (const item of labelList)
        {
            for (const label of ['gender', 'day', 'start', 'end'])
            {
                if (item.getAttribute('for') !== label)
                {
                    item.setAttribute('class', 'active');
                }
                else
                {
                    item.removeAttribute('class');
                    break;
                }
            }
        }
    }

    onChange = (e) => 
    {
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    }

    formEdit = () => 
    {
        const inputList = document.getElementsByTagName('input');
        const editable = this.state.input;

        for (const item of inputList) 
        {
            if (item.getAttribute('id') === 'courseName' || item.getAttribute('id') === 'courseProf')
            {
                continue;
            }
            editable ? item.setAttribute('disabled', '') : item.removeAttribute('disabled');
        }

        const editButton = document.getElementById('editButton');
        const cancelButton = document.getElementById('cancelButton');

        editButton.textContent = editable ? 'Edit' : 'Save';
        cancelButton.style.display = editable ? 'none' : 'inline-block';

        if (editable)
        {
            this.saveEntry();
        }
        
        this.setState({ ...this.state, input: !editable });
    }

    formCancel = () => 
    {
        const inputList = document.getElementsByTagName('input');

        for (const item of inputList) 
        {
            if (item.getAttribute('id') === 'courseName' || item.getAttribute('id') === 'courseProf')
            {
                continue;
            }
            item.setAttribute('disabled', '');    
        }

        const editButton = document.getElementById('editButton');
        const cancelButton = document.getElementById('cancelButton');

        editButton.textContent = 'Edit';
        cancelButton.style.display = 'none';

        this.setState({ ...this.state, input: false });
    }

    async saveEntry()
    {
        const user = this.props.user;

        for (const key in this.state) 
        {
            if (this.state.hasOwnProperty.call(this.state, key)) 
            {
                const element = this.state[key];
                user[key] = element;
            }
        }

        await this.props.update_user(user);
    }

    timeCreator()
    {
        let array = [];

        for (let i = 0; i < 24; i++)
        {
            array.push(<option value={2*i} key={2*i}>{i+':00'}</option>);
            array.push(<option value={2*i+1} key={2*i+1}>{i+':30'}</option>)
        }

        return array;
    }

    timeAdder = (e) => 
    {
        let start = Number(this.state.start);
        let end = Number(this.state.end);

        // Button only active when the form is being edited
        if (!this.state.input)
        {
            return;
        }
        // Inspect if end time is larger than start time
        else if (end <= start)
        {
            return;
        }
        
        // Create a new time object
        const time = { day: this.state.day, start: start, end: end };

        // Pullout the current state's availability
        const availability = this.state.availability.slice();

        // Add to the list
        availability.push(time);

        // Set state
        this.setState({ ...this.state, availability: availability });
        
    }

    timeRemover = (time) => 
    {
        // Check if the form is being editing
        if (!this.state.input)
        {
            return;
        }

        // Pullout the current state's availability
        const availability = this.state.availability.slice();

        // Filter the array
        const newAvailability = availability.filter((item) => item !== time);

        // Set state
        this.setState({ ...this.state, availability: newAvailability });
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

    render()
    {
        return (
            <div className='MyProfile' style={{ width: '100%' }}>
                {/* Title section */}
                <div className='black-text text-lighten-1' style={{ textAlign:'center', marginTop:'2%' }}>
                    <h2>My Profile</h2>
                </div>

                {/* Photo and info section */}
                <div className='row' style={{ marginTop:'5%' }}>
                    {/* Photo section */}
                    <div className='col s12 m5 file-field'>
                        <div className='btn-floating' style={{ position:'relative', width:'70%', paddingTop:'70%', marginTop:'4%', marginLeft:'15%' }}>
                            <img src={this.state.photo ? this.state.photo : 'https://i.pinimg.com/236x/d7/bf/13/d7bf13137b64840c0e7b2bae17ed6ed4.jpg'} 
                                style={{ position:'absolute', top:'0', right:'0', bottom:'0', left:'0', width:'100%' }} alt='' />
                            <FileBase type='file' multiple={false} onDone={({ base64 }) => this.setState({ ...this.state, photo: base64 })} />
                        </div>
                    </div>

                    {/* Info section */}
                    <div className='row col s12 m6'>
                        {/* Name */}
                        <div className='input-field col s12 m6 l4'>
                            <input id='name' value={this.state.name || ''} onChange={this.onChange} />
                            <label htmlFor='name'>Name</label>
                        </div>

                        {/* Gender */}
                        <div className="input-field col s12 m6 l4">
                            <select id='gender' defaultValue={this.state.gender} onChange={this.onChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value=""></option>
                            </select>
                            <label htmlFor='gender'>Gender</label>
                        </div>

                        {/* Year of Graduation */}
                        <div className='input-field col s12 m6 l4'>
                            <input id='gradYear' type='number' value={this.state.gradYear || ''} onChange={this.onChange}></input>
                            <label htmlFor='gradYear'>Year of Graduation</label>
                        </div>

                        {/* Major */}
                        <div className='input-field col s12 m6 l6'>
                            <input id='major' value={this.state.major || ''} onChange={this.onChange}></input>
                            <label htmlFor='major'>Major</label>
                        </div>
                    
                        {/* Email */}
                        <div className='input-field col s12 m12 l6'>
                            <input id='email' type='email' value={this.state.email || ''} onChange={this.onChange}></input>
                            <label htmlFor='email'>Email</label>
                        </div>

                        {/* Bio */}
                        <div className='input-field col s12 m12 l12'>
                            <input id='bio' type='text' value={this.state.bio || ''} onChange={this.onChange}></input>
                            <label htmlFor='bio'>Biography about Yourself</label>
                        </div>

                        {/* Social Medias */}
                        <div className='input-field col s12 m6 l3'>
                            <img className='prefix' src='http://blog.mobiversal.com/wp-content/uploads/2016/06/snapchat-icon-1.png' alt='' style={{ padding: '5px' }} />
                            <input id='Snapchat' type='text' value={this.state.Snapchat || ''} onChange={this.onChange}></input>
                            <label htmlFor='Snapchat'>Snapchat</label>
                        </div>

                        <div className='input-field col s12 m6 l3'>
                            <img className='prefix' src='https://cdn.pixelprivacy.com/wp-content/uploads/2018/02/Instagram-Icon.png' alt='' style={{ padding: '5px' }} />
                            <input id='Instagram' type='text' value={this.state.Instagram || ''} onChange={this.onChange}></input>
                            <label htmlFor='Instagram'>Instagram</label>
                        </div>

                        <div className='input-field col s12 m6 l3'>
                            <img className='prefix' src='https://coindoo.com/wp-content/uploads/2019/01/facebook-icon.png' alt='' style={{ padding: '5px' }} />
                            <input id='Facebook' type='text' value={this.state.Facebook || ''} onChange={this.onChange}></input>
                            <label htmlFor='Facebook'>Facebook</label>
                        </div>

                        <div className='input-field col s12 m6 l3'>
                            <img className='prefix' src='https://logos-download.com/wp-content/uploads/2017/01/WeChat_logo_icon.png' alt='' style={{ padding: '5px' }} />
                            <input id='Wechat' type='text' value={this.state.Wechat || ''} onChange={this.onChange}></input>
                            <label htmlFor='Wechat'>Wechat</label>
                        </div>

                        {/* Add Availability */}
                        <div className='input-field col s12 m4 l4'>
                            <select id='day' value={this.state.day} onChange={this.onChange}>
                                <option value='Monday'>Monday</option><option value='Tuesday'>Tuesday</option><option value='Wednesday'>Wednesday</option><option value='Thursday'>Thursday</option>
                                <option value='Friday'>Friday</option><option value='Saturday'>Saturday</option><option value='Sunday'>Sunday</option>
                            </select>
                            <label htmlFor='day'>Add Availability</label>                         
                        </div>
                        <div className='input-field col s9 m3 l3'>
                            <select id='start' type='number' value={this.state.start} onChange={this.onChange}>
                                {this.timeCreator()}
                            </select>
                            <label htmlFor='start'>From</label>
                        </div>
                        <div className='input-field col s9 m3 l3'>
                            <select id='end' type='number' value={this.state.end} onChange={this.onChange}>
                                {this.timeCreator()}
                            </select>
                            <label htmlFor='end'>To</label>                      
                        </div>
                        <div className='col s3 m2 l2' style={{ minHeight: '70px', textAlign: 'center' }}>
                            <button className='btn-floating green medium' style={{ marginTop: '25%' }} onClick={this.timeAdder}><i className='material-icons'>add</i></button>
                        </div>
                    </div>
                </div>

                {/* Availability Chips */}
                <div id='Chips' style={{ width: '80%', marginLeft: '10%'}}>
                    <h6>Availabilities: &nbsp;</h6> &nbsp; &nbsp;
                    {!this.state.availability ? '' : this.state.availability.map((time) =>
                        <div className='chip' key={time.day + time.start + time.end}>
                            {this.timeMapper(time)}
                            <button className='btn-floating' onClick={() => this.timeRemover(time)}>
                                <i className='material-icons' style={{ lineHeight: '32px'}}>close</i>
                            </button>
                        </div>
                    )}
                </div>

                {/* Buttons section */}
                <div className='row' style={{ textAlign:'center', }}>
                    <button id='editButton' className='btn-large waves-effect waves-lighten blue' style={{ width:'20%', letterSpacing:'1.5px', }} onClick={this.formEdit}>Edit</button>
                    <button id='cancelButton' className='btn-large waves-effect waves-lighten red' style={{ display: 'none', width:'20%', marginLeft:'10%', letterSpacing:'1.5px', }} onClick={this.formCancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

MyProfile.propTypes = 
{
    update_user: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};

function mapStateToProps(state)
{
    return { user: state.auth.user };
};

export default connect(mapStateToProps, { update_user, })(MyProfile);