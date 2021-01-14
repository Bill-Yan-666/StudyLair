import React, { Component } from "react";
import axios from "axios";

class UserCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
    };
  }
  componentWillMount() {
    const courseName = this.props.match.params.courseName;
    console.log(this.props);
    axios.get("/api/courses/" + courseName).then((courseInfo) => {
      this.setState({ students: courseInfo.data.students });
    });

  }

  render() {
    const enrolledStudents = this.state.students.map((student) => (
      <p>{student}</p>
    ));
    // const courseName = this.props.match.params.courseName;
    // console.log(courseName);
    return <div>{enrolledStudents}</div>;
  }
}

export default UserCourse;
