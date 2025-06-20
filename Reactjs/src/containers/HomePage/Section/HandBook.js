import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { getAllHandbookService } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import './HandBook.scss'
import { withRouter } from 'react-router-dom';

class HandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataHandbook: [],
        }
    }

    async componentDidMount() {
        let res = await getAllHandbookService()
        console.log('check res: ', res)
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

    handleViewAllHandbook = () => {
        if (this.props.history) {
            this.props.history.push(`/all-handbook`)
        }
    }
    
    render() {
        let {dataHandbook} = this.state
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="homepage.handbook"/></span>
                        <button className='btn-section' onClick={() => this.handleViewAllHandbook()}>
                            <FormattedMessage id="homepage.more-handbook" />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            { dataHandbook && dataHandbook.length > 0 &&
                                dataHandbook.map((item, index) => {
                                    return (
                                        <div className='section-customize handbook-child' key={index}
                                            onClick={() => this.handleViewHandbook(item)}
                                        >
                                            <div className='bg-image section-handbook'
                                                style={{backgroundImage: `url(${item.image})`}}
                                            />
                                            <div className='handbook-name'>
                                                <p
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        lineClamp: 1,
                                                        WebkitLineClamp: 1,
                                                        WebkitBoxOrient: "vertical",
                                                        maxWidth: 310
                                                    }}
                                                >
                                                    {item.name}
                                                </p>
                                            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
