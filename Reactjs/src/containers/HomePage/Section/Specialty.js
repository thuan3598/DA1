import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getAllSpecialtyService } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import './Specialty.scss'
import { withRouter } from 'react-router-dom';

class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSpecialty: [],
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialtyService()
        console.log('check res: ', res)
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleViewSpecialty = (specialty) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialty.id}`)
        }
    }

    handleViewAllSpecialty = () => {
        if (this.props.history) {
            this.props.history.push(`/all-specialty`)
        }
    }
    
    render() {
        let {dataSpecialty} = this.state
        return (
            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.specialty-popular"/></span>
                        <button className='btn-section' onClick={() => this.handleViewAllSpecialty()}>
                            <FormattedMessage id="homepage.more-info" />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            { dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div className='section-customize specialty-child' key={index}
                                            onClick={() => this.handleViewSpecialty(item)}
                                        >
                                            <div className='bg-image section-specialty'
                                                style={{backgroundImage: `url(${item.image})`}}
                                            />
                                            <div className='specialty-name'>{item.name}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
