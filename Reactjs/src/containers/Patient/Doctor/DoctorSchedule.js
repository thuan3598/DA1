import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorSchedule.scss'
import { getDetailDoctorInfoService, getScheduleDoctorByDateService } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import Select from 'react-select';
import moment from 'moment';
import localization from 'moment/locale/vi'
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        }
    }

    async componentDidMount() {
        let { language } = this.props
        let allDays = this.getArrDays(language)
        this.setState({
            allDays: allDays,
        })
        if (this.props.doctorIdFromParent) {

            let res = await getScheduleDoctorByDateService(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language)
            this.setState({
                allDays: allDays
            })
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language)
            let res = await getScheduleDoctorByDateService(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
    }

    getArrDays = (language) => {
        let arrDays = []
            for (let i = 0; i < 7; i++){
                let object = {}
                if (language === LANGUAGES.VI) {
                    if (i === 0) {
                        let labelViNew = moment(new Date()).format('DD/MM')
                        let today = `Hôm nay - ${labelViNew}`
                        object.label = today
                    }
                    else {
                        let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM') 
                        object.label = this.capitalizeFirstLetter(labelVi)
                    }
                } else {
                    if (i === 0) {
                        let labelNew = moment(new Date()).format('DD/MM')
                        let today = `Today - ${labelNew}`
                        object.label = today
                    }
                    else {
                        object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM')
                    }  
                }

                object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf()
                arrDays.push(object)
        }
        return arrDays
    }

    handleOnchangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent
            let date = event.target.value
            let res = await getScheduleDoctorByDateService(doctorId, date)

            if (res && res.errCode === 0) {
                this.setState({
                   allAvailableTime: res.data ? res.data : []
               })
            }
            console.log('event onchange date value check: ', res)
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state
        let { language } = this.props
        
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => this.handleOnchangeSelect(event)}>
                            {allDays && allDays.length > 0 && 
                                allDays.map((item, index) => {
                                    return <option key={index} value={item.value}>{item.label}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className="far fa-calendar"><span><FormattedMessage id="patient.detail-doctor.schedule"/></span></i>
                        </div>
                        <div className='time-content'>
                            {allAvailableTime && allAvailableTime.length > 0 ? 
                                <>
                                    <div className='time-content-btns'>
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                            return (
                                                <button key={index}
                                                    className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                >{timeDisplay}</button>
                                            )
                                        })}
                                    </div>
                                    <div className='book-free'>
                                        <span><FormattedMessage id="patient.detail-doctor.choose" /> <i class="far fa-hand-point-up"></i> <FormattedMessage id="patient.detail-doctor.book-free" /></span>
                                    </div>
                                </>
                                :
                                <div className='no-schedule'><FormattedMessage id="patient.detail-doctor.no-schedule" /></div>
                                
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal} 
                    dataTime={dataScheduleTimeModal}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
