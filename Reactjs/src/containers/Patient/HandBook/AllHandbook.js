import React, { Component } from 'react';
import { connect } from "react-redux";
import './AllHandbook.scss'
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllHandbookService } from '../../../services/userService'

class AllHandbook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataHandbook: [],
        }
    }

    async componentDidMount() {
        let res = await getAllHandbookService()

        if (res && res.errCode === 0) {
            this.setState({
                dataHandbook: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleViewHandbook = (handbook) => {
        if (this.props.history) {
            this.props.history.push(`/detail-handbook/${handbook.id}`)
        }
    }

    render() {
        let { dataHandbook } = this.state
        console.log('check data: ', dataHandbook)
        return (
            <>
                <HomeHeader/>
                <div className='doctor-all-handbook-container'>
                    <div className='body-all-handbook'>
                        <div className='content-all-handbook'>
                            <FormattedMessage id="homepage.all-handbook"/>
                        </div>
                        {dataHandbook && dataHandbook.length > 0 &&
                                dataHandbook.map((item, index) => {
                                    return (
                                        <div className='item-all-handbook' key={index}
                                            onClick={() => this.handleViewHandbook(item)}
                                        >
                                            <div className='left-all-handbook'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            >
                                            </div>
                                            <div className='right-all-handbook'>
                                                <div>
                                                    {item.name}
                                                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(AllHandbook);
