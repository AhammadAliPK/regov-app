import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { Progress } from "reactstrap";

import AuthService from "../services/auth.service";

import UserService from "../services/user.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const filevalidation = (value) => {
  if (!value)
    return (
      <div className="alert alert-danger" role="alert">
        Please upload a file
      </div>
    );
};

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      successful: false,
      message: "",
      loaded: 0,
      selectedFile: "",
      imagePath: "",
    };
  }
  componentDidMount() {
    this.subscription = UserService.getuploadStatus().subscribe((a) => {
      this.setState({
        loaded: 100,
      });
    });
  }

  componentWillUnmount() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }
  handleFileSelection(e) {
    this.setState({ selectedFile: e.target.files[0] });
  }

  handleUpload(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    // data.append("contentType", "multipart/form-data");
    UserService.uploadFile(data).then((response) => {
      
      this.setState({
        imagePath: response.data.destination,
      });
      console.log(response);
    });
  }
  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false,
      selectedFile: "",
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      debugger;
      AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password,
        this.state.imagePath
      ).then(
        (response) => {
          debugger;
          let result = response.data;
          if (result.status) {
            this.setState({
              message: response.data.message,
              successful: true,
            });
            localStorage.setItem("user", JSON.stringify(response.data));
            //this.props.history.push("/login");
          } else {
            alert("failed");
          }
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage,
          });
        }
      );
    }
  }

  render() {
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={(c) => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    validations={[required, email]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <div>
                    <label htmlFor="fileuploader">
                      Your identification card
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-4 d-flex align-items-center">
                    <Input
                      type="file"
                      accept="image/*"
                      name="selectedFile"
                      onChange={(e) => this.handleFileSelection(e)}
                      validations={[required, filevalidation]}
                    />
                  </div>
                </div>
                <div>
                  {(() => {
                    if (this.state.loaded > 0)
                      return (
                        <Progress
                          max="100"
                          color="success"
                          value={this.state.loaded}
                        >
                          {Math.round(this.state.loaded, 2)}%
                        </Progress>
                      );
                  })()}
                </div>
                {/* {(this.state.loaded > 0)(
                  <Progress max="100" color="success" value={this.state.loaded}>
                    {Math.round(this.state.loaded, 2)}%
                  </Progress>
                )} */}

                <div className="form-group row">
                  <div className="ml-3">
                    <button
                      className="btn btn-secondary"
                      onClick={this.handleUpload.bind(this)}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <button className="btn btn-primary mr-2">Preview</button>
                  <button className="btn btn-primary">Sign Up</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
