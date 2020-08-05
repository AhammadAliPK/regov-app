import React, { Component } from "react";
import AuthService from "../services/auth.service";



export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
    };
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="container">
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
        {/* <p>
          <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
          {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
        </p> */}
        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>

        <p>
          <strong>User name:</strong> {currentUser.username}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <strong>Photo:</strong>
        <div className="mt-3">
          <img
            src={window.location.origin + "/passport-sample.jpg"}
            alt="profile-img"
            className="profile-img"
          />
        </div>
        <div className="form-group m-3">
          <button className="btn btn-primary"> Edit</button>
        </div>
      
      </div>
    );
  }
}
