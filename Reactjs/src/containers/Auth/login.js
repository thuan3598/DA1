import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import "./login.scss";
import { FormattedMessage } from "react-intl";
import {handleLoginApi} from "../../services/userService"

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Fill your username",
      password: "Fill your password",
      isshowPassword: false,
      errMessage:""
    };
  }
  handleOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  };
  handleOnChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  };
  handleLogin = async() => {
    // console.log(this.state.username);
    this.setState({
      errMessage:""
    })
    try{
      let data=await handleLoginApi(this.state.username,this.state.password);
      if(data&&data.errCode!==0){
        this.setState({
          errMessage:data.message
        })
      }
      else{
        this.props.userLoginSuccess(data.user);
        console.log('Login succeeds');
      }
    }catch(error){
      if(error.response){
        if(error.response.data){
          this.setState({
            errMessage:error.response.data.message
          })
        }
      }
      // console.log(e);
      
    }

  };
  handleShowHidePassword = () => {
    this.setState({
      isshowPassword:!this.state.isshowPassword
    })
  };
  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Login</div>
            <div className="col-12 form-group login-input">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={(event) => this.handleOnChangeUsername(event)}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label>Password</label>
              <div className="custom-input-password">
                <input
                  type={this.state.isshowPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={(event) => this.handleOnChangePassword(event)}
                />

                <span
                  onClick={() => {
                    this.handleShowHidePassword();
                  }}
                >
                  <i class={this.state.isshowPassword?'far fa-eye':'far fa-eye-slash'}></i>
                </span>
              </div>
            </div>
            <div className="col-12" style={{color:'red'}}>
                  {this.state.errMessage}
            </div>
            <div className="col-12 ">
              <button
                className="btn-login"
                onClick={() => {
                  this.handleLogin();
                }}
              >
                Login
              </button>
            </div>
            <div className="col-12 forgot-password">
              <span>Forgot your password?</span>
            </div>
            <div className="col-12 text-center mt-3">
              <span className="text-other-login">Or login with:</span>
            </div>
            <div className="col-12 social-login">
              <i className="fab fa-google-plus-g"></i>
              <i className="fab fa-facebook-f"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess:(userInfo)=>dispatch(actions.userLoginSuccess(userInfo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
