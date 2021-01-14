import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { logout_User } from "../../actions/userActions.js";
import { add_course } from "../../actions/courseActions";

class InstructorDashboard extends Component {
  constructor() {
    super();
    this.state = { name: '', prof: '', success: true, message: ''};
  }

  static getDerivedStateFromProps(nextProps, currentState)
  {
    if (nextProps.status.success !== currentState.success || nextProps.status.message !== currentState.message)
    {
      return { ...currentState, success: nextProps.status.success, message: nextProps.status.message }
    }
    return null;
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logout_User();
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    console.log(this.state);

    const courseInfo = { students: [], name: this.state.name, prof: this.state.prof, counter: 0 };

    this.props.add_course(courseInfo);
  };

  requestStatus()
  {
    // Check for default
    if (this.state.success && this.state.message === '')
    {
      return;
    }
    else if (this.state.success)
    {
      return (
        <div className="row green lighten-4 green-text" style={{ display:"block", height:"54px", borderRadius:"8px", lineHeight:"54px", fontSize:"15px" }}>
            &nbsp; Course Added Successfully
        </div>
      );
    }
    else
    {
      return (
        <div className="row red lighten-4 red-text" style={{ display:"block", height:"54px", borderRadius:"8px", lineHeight:"54px", fontSize:"15px" }}>
            &nbsp; {this.state.message}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            {/* Log out button section */}
            <button className="waves-effect waves-amber btn-flat" style={{ marginLeft: "-5%" }} onClick={this.onLogoutClick}>
              <i className="material-icons left">keyboard_backspace</i> Log Out
            </button>

            {/* Request status section */}
            {this.requestStatus()}

            {/* Title section */}
            <div className="col s12" style={{ paddingLeft: "11.250px", textAlign: "center" }}>
              <h4>
                Add a course
              </h4>
            </div>

            {/* Form for collecting course information */}
            <form noValidate onSubmit={this.onSubmit}>
              {/* Course name */}
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  id="name"
                  type="text"
                />
                <label htmlFor="name">Course Name</label>
              </div>

              {/* Professor's name */}
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.prof}
                  id="prof"
                  type="text"
                />
                <label htmlFor="prof">Instructor</label>
              </div>

              {/* Submit or clear the form */}
              <div className="col s12">
                {/* Submit button */}
                <button
                  style={{
                    width: "40%",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginLeft: "5%",
                    marginRight: "5%",
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Add
                </button>

                {/* Clear button */}
                <button
                  style={{
                    width: "40%",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginLeft: "5%",
                    marginRight: "5%",
                  }}
                  type="reset"
                  className="btn btn-large waves-effect waves-light hoverable red accent-3"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

InstructorDashboard.propTypes = {
  add_course: PropTypes.func.isRequired,
  logout_User: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  status: PropTypes.object.isRequired,
};

function mapStateToProps(state)
{
  return { auth: state.auth, status: state.status, }
}

export default connect(
  mapStateToProps,
  { add_course, logout_User }
)(InstructorDashboard);
