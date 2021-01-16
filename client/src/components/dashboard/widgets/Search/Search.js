import React, { Component } from "react";
import axios from "axios";
import SearchList from './SearchList';
class Search extends Component {
  state = {
    courses: null,
    loading: false,
    value: "",
  };
  search = async (val) => {
    this.setState({ loading: true });
    const res = await axios("/api/courses/courseSearch/" + val);
    const courses = await res.data.courses;
    this.setState({ courses, loading: false });
  };

  onChangeHandler = async e => {
    this.search(e.target.value);
    this.setState({ value: e.target.value });
  };

  get renderCourses() {
    let courses = <h1>There's no courses</h1>;
    console.log(this.state.value);
    if (this.state.courses) {
        courses = <SearchList list = {this.state.courses}/>;
    }

    return courses;
  }

  render() {
    return (
      <div>
        <input
          id="className"
          value={this.state.value}
          onChange={(e) => this.onChangeHandler(e)}
          placeholder="Type something to search"
        />
        {this.renderCourses}
        ...
      </div>
    );
  }
}

export default Search;
