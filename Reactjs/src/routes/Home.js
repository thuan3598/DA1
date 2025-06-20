import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleLoginApi } from '../services/userService';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { isLoggedIn, systemMenuPath, userInfo } = this.props;
        console.log('check props home: ', this.props)
        let linkToRedirect = ''
        if (isLoggedIn === true && userInfo.roleId === 'R1') {
            linkToRedirect = '/system/user-manage'
        } else if (isLoggedIn === true && userInfo.roleId === 'R2') {
            linkToRedirect = '/doctor/manage-patient'
        }
        else if (isLoggedIn === true && userInfo.roleId === 'R3') {
            linkToRedirect = '/patient/manage-booking'
        } 
        
        else
            linkToRedirect = '/home'
        return (
            <Redirect to={linkToRedirect} />
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        systemMenuPath: state.app.systemMenuPath,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
