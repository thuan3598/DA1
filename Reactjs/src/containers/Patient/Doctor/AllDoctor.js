import React, { Component } from 'react';
import { connect } from "react-redux";
import './AllDoctor.scss'
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import * as actions from '../../../store/actions'
import { getAllSpecialtyService } from '../../../services/userService'

class AllDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: [],
        }
    }

    componentDidUpdate(prevProps, prevState, snaptshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors()
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
    }

    render() {
        let { arrDoctors } = this.state
        let { language } = this.props
        return (
            <>
                <HomeHeader/>
                <div className='doctor-all-doctor-container'>
                    <div className='body-all-doctor'>
                        <div className='content-all-doctor'>
                            <FormattedMessage id="homepage.all-doctor"/>
                        </div>
                        {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let imgBase64 = ''
                                    if (item.image) {
                                        imgBase64 = new Buffer(item.image, 'base64').toString('binary')
                                    }

                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`
                                    
                                    return (
                                        <div className='item-all-doctor' key={index}
                                            onClick={() => this.handleViewDetailDoctor(item)}
                                        >
                                            <div className='left-all-doctor'
                                                style={{ backgroundImage: `url(${imgBase64})` }}
                                            >
                                            </div>
                                            <div className='right-all-doctor'>
                                                <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                <div>{item.Doctor_Info.Specialty.name}</div>
                                                <div>{item.Doctor_Info.nameClinic}</div>
                                                
                                            </div>
                                        </div>
                                    )
                                })
                            }
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {    
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllDoctor);
