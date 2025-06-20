import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getAllClinicService } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import './MedicalFacility.scss'

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataClinics: [],
        }
    }

    async componentDidMount() {
        let res = await getAllClinicService()
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleViewClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    handleViewAllClinic = () => {
        if (this.props.history) {
            this.props.history.push(`/all-clinic`)
        }
    }
    

    render() {
        let {dataClinics} = this.state
        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.clinic-popular"/></span>
                        <button className='btn-section' onClick={() => this.handleViewAllClinic()}
                        ><FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div className='section-customize' key={index}
                                            onClick={() => this.handleViewClinic(item)}
                                        >
                                            <div className='bg-image section-medical-facility'
                                                style={{backgroundImage: `url(${item.image})`}}
                                            />
                                            <div className='name-medical'>{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
