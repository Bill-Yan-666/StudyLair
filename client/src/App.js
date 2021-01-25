import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { get_and_set_user, logout_User } from './actions/userActions.js';
import { SET_CURRENT_USER } from './actions/types.js';
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import CourseDashboard from './components/dashboard/CourseDashboard';
import InstructorDashboard from "./components/dashboard/InstructorDashboard"
import StudentDashboard from "./components/dashboard/StudentDashboard"
import UserCourse from "./components/usercourse/UserCourse"

import "./App.css";
const _ = require("lodash");

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and authentication, since it takes time to fetch data, use old
  // data to bypass the verification first
  store.dispatch({ type: SET_CURRENT_USER, payload: decoded, });
  store.dispatch(get_and_set_user(decoded));
  store.dispatch(get_and_set_user(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logout_User());

    // Redirect to login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            {/* <Route exact path="/c1" component={Dashboard} /> */}
            <Switch>
              <PrivateRoute exact path='/courseDashboard' component={CourseDashboard} />
              <PrivateRoute exact path="/instructorDashboard" component={InstructorDashboard}/>
              <PrivateRoute exact path="/studentDashboard" component={StudentDashboard}/>
              <PrivateRoute exact path="/dashboard/:courseName" component={UserCourse}/>
              {/* <PrivateRoute exact path="/c1" component={Landing} /> */}
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
