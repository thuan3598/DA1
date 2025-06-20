import React, { Component } from 'react';
import { connect } from "react-redux";
import './SearchSpecialty.scss'
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import { fetchSearchSpecialty } from '../../../store/actions/adminActions';

class SearchSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentDidMount() {

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

    handleOnKeyDown = async (event) => {
        if (event.key === 'Enter') {
            this.props.fetchSearchSpecialty(event.target.value)
        }
    }

    render() {
        let { dataSpecialty } = this.props

        return (
            <>
                <HomeHeader/>
                <div className='doctor-search-specialty-container'>
                    <div className='body-search-specialty'>
                        <div className='content-search-specialty'>
                            <div><FormattedMessage id="homepage.search-specialty" /></div>
                            <div className='search'>
                                <i className="fas fa-search"></i>
                                <input type='text' placeholder='Search ...' onKeyDown={(event) => this.handleOnKeyDown(event)}/>
                            </div>
                        </div>
                        {dataSpecialty && dataSpecialty.length > 0 ?
                            dataSpecialty.map((item, index) => {
                                    let imgBase64 = ''
                                    if (item.image) {
                                        imgBase64 = new Buffer(item.image, 'base64').toString('binary')
                                    }
                                    return (
                                        <div className='item-search-specialty' key={index}
                                            onClick={() => this.handleViewSpecialty(item)}
                                        >
                                            <div className='left-search-specialty'
                                                style={{ backgroundImage: `url(${imgBase64})` }}
                                            >
                                            </div>
                                            <div className='right-search-specialty'>
                                                {item.name}
                                            </div>
                                        </div>
                                    )
                            })
                            :
                            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '600', color: '#666', padding: '30px' }}>
                                <FormattedMessage id="homepage.no-search-specialty" />
                            </div>
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
        dataSpecialty: state.admin.dataSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchSearchSpecialty: (nameInput) => dispatch(fetchSearchSpecialty(nameInput))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSpecialty);
