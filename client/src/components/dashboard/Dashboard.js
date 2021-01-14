import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout_User } from "../../actions/userActions.js";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logout_User();
  };

  printAllUsers(user) {
    const classes = user.classList;
    return (
      <div>
        <h4>classes taken</h4>
        <ul>
          {classes.map((item) => {
            {/* return <li>{item}</li>; */}
            return <li><Link to={"dashboard/"+item}>{item}</Link></li>
          })}
        </ul>
      </div>
    );
  }

  render() {
    const { user } = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
              <Link to='/c1'><b>meow</b></Link>
              <b>Hey there,</b> {user.name.split(" ")[0]}
              {this.printAllUsers(user)}
              {/* {user.classList.forEach((e) => console.log(e))} */}
              <p className="flow-text grey-text text-darken-1"></p>
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem",
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logout_User: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout_User })(Dashboard);
