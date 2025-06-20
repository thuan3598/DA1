import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomeFooter extends Component {
    
    render() {

        return (
            <div className='home-footer'>
                <strong>
                    <p>Copyright &copy; 2025 Made By
                    <a target='_blank' href='https://www.facebook.com/'> NguyenThuan</a></p>
                </strong>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        //inject
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
