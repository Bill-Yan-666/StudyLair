import React, { Component } from "react";
import ReactDOM from "react-dom";

class SearchList extends Component {
  render() {
    return (
      <div>
        {/* hry
            {console.log(this.props.list)} */}
        <ul>
          {this.props.list.map((course) => (
            <li>
              <h5>{course.course_uid}</h5>
              <h6>{course.course_name}</h6>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SearchList;
