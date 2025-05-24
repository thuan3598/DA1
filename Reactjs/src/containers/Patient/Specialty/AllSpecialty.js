import React, { Component } from 'react';
import { connect } from "react-redux";
import './AllSpecialty.scss'
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllSpecialtyService } from '../../../services/userService'

class AllSpecialty extends Component {
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

    render() {
        let { dataSpecialty } = this.state
        console.log('check data: ', dataSpecialty)
        return (
            <>
                <HomeHeader/>
                <div className='doctor-all-specialty-container'>
                    <div className='body-all-specialty'>
                        <div className='content-all-specialty'>
                            <FormattedMessage id="homepage.all-specialty"/>
                        </div>
                        {dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    return (
                                        <div className='item-all-specialty' key={index}
                                            onClick={() => this.handleViewSpecialty(item)}
                                        >
                                            <div className='left-all-specialty'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                            </div>
                                            <div className='right-all-specialty'>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllSpecialty);
