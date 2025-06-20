import React, { Component } from 'react';
import { connect } from "react-redux";
import './AllClinic.scss'
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllClinicService } from '../../../services/userService'

class AllClinic extends Component {
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

    render() {
        let { dataClinics } = this.state
        console.log('check data: ', dataClinics)
        return (
            <>
                <HomeHeader/>
                <div className='doctor-all-clinic-container'>
                    <div className='body-all-clinic'>
                        <div className='content-all-clinic'>
                            <FormattedMessage id="homepage.all-clinic"/>
                        </div>
                        {dataClinics && dataClinics.length > 0 &&
                                dataClinics.map((item, index) => {
                                    return (
                                        <div className='item-all-clinic' key={index}
                                            onClick={() => this.handleViewClinic(item)}
                                        >
                                            <div className='left-all-clinic'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                            </div>
                                            <div className='right-all-clinic'>
                                                {item.name}
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
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllClinic);
