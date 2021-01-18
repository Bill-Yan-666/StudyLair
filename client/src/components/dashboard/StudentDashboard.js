import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout_User, reset_status } from '../../actions/userActions.js';

import MyCourse from './widgets/MyCourse.js';
import MyProfile from './widgets/MyProfile.js';
import MyBuddy from "./widgets/MyBuddy.js";

class StudentDashboard extends Component {
  onLogout = (event) => {
    event.preventDefault();
    this.props.logout_User();
  }

  popUpControl(popUpId)
  {
    let popup = document.getElementById(popUpId);
    let status = popup.style.display;

    if (status === 'block')
    {
      popup.style.display = 'none';
    }
    else
    {
      popup.style.display = 'block';
      this.props.reset_status();
    }
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        {/* Below are the pop-up windows */}
        {/* The My Course pop-up */}
        <div className='PopUp' id="CoursePopUp">
        <button className="btn-floating btn-large red" style={{ position: 'absolute', right: '-30px', top: '-25px' }} onClick={() => this.popUpControl('CoursePopUp')}>
            <i className="material-icons">close</i>
          </button>
          <MyCourse />
        </div>

        {/* The My Profile pop-up */}
        <div className='PopUp' id="ProfilePopUp">
          <button className="btn-floating btn-large red" style={{ position: 'absolute', right: '-30px', top: '-25px' }} onClick={() => this.popUpControl('ProfilePopUp')}>
            <i className="material-icons">close</i>
          </button>
          <MyProfile />
        </div>

        {/* The Find Buddy pop-up */}
        <div className='PopUp' id="BuddyPopUp">
          <button className="btn-floating btn-large red" style={{ position: 'absolute', right: '-30px', top: '-25px' }} onClick={() => this.popUpControl('BuddyPopUp')}>
            <i className="material-icons">close</i>
          </button>
          <MyBuddy />
        </div>

      {/* The main body */}
      <div className="container" style={{ marginTop: '10%' }}>
        <div className="row">
          {/* Logout button here */}
          <div className='col s12' style={{ marginTop: '-10%', marginLeft: '-10%' }}>
            <button style={{ width: "200px", height: '70px', letterSpacing: "1.5px", fontSize: '25px' }} onClick={this.onLogout} className="btn-flat waves-effect waves-red">
              <i className="material-icons left" style={{ fontSize: '40px' }}>power_settings_new</i>
              Logout
            </button>
          </div>

          {/* Title on the top */}
          <div className="col s12" style={{ textAlign:"center", marginTop:'-5%', marginBottom:"10%" }}>
            <h1>Welcome, {this.props.auth.user.name}</h1>
            <h1>Time to explore!</h1>
          </div>

          {/* My Courses Button */}
          <div className='col s12 m4'>
            <button className="btn-large waves-effect waves-light hoverable PopUp-Button" onClick={() => this.popUpControl('CoursePopUp')}>
              <br/><i className="material-icons" style={{ fontSize: "130px" }}>class</i><br/>
              My Courses
            </button>
          </div>

          {/* My Profile Button */}
          <div className='col s12 m4'>
            <button className="btn-large waves-effect waves-light hoverable PopUp-Button" onClick={() => this.popUpControl('ProfilePopUp')}>
              <br/><i className="material-icons" style={{ fontSize: "130px" }}>account_circle</i><br/>
              My Profile
            </button>
          </div>
          

          {/* Find Buddy Button */}
          <div className='col s12 m4'>
            <button className="btn-large waves-effect waves-light hoverable PopUp-Button" onClick={() => this.popUpControl('BuddyPopUp')}>
              <br/><i className="material-icons" style={{ fontSize: "130px" }}>people</i><br/>
              Find a Buddy
            </button>
          </div>
          
        </div>
      </div>
      </div>
    );
  }
}

StudentDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  logout_User: PropTypes.func.isRequired,
  reset_status: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout_User, reset_status, })(StudentDashboard);