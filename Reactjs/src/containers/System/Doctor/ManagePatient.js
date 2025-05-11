import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from 'lodash';

class ManagePatient extends Component {
    constructor(props) {
        super(props)
        
    }
    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, listStatus } = this.state
        let {language} = this.props
        return (
            <>
            manage patient
                
            </>
        );
    }
}

const mapStateToProps = state => {
    return {    
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
