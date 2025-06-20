import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { getDetailDoctorInfoService, saveScheduleDoctorsService, getScheduleDoctorByDateService } from '../../../services/userService'; // Import getScheduleDoctorByDateService
import * as actions from '../../../store/actions'
import { LANGUAGES, CRUD_ACTIONS, CommonUtils, dateFormat } from "../../../utils";
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';

import chatIcon from "../../../assets/email.png";

// Firebase & Firestore Imports
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db as firestoreDb } from '../../chatApp/firebase';
import { AuthContext } from '../../chatApp/context/AuthContext';

class ManageSchedule extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            isDoctorRole: false,
        };
    }

    async componentDidMount() {
        this.props.fetchGetAllDoctors();
        this.props.fetchGetAllScheduleTime();
        await this.checkUserRoleAndSetDoctor(); // Await this to ensure selectedDoctor is set before fetching schedule
        // Fetch schedule initially if doctor and date are available
        if (this.state.selectedDoctor.value && this.state.currentDate) {
            this.fetchAndSetActiveSchedule(this.state.selectedDoctor.value, this.state.currentDate);
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        
        if (prevProps.allDoctors !== this.props.allDoctors || prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            });
           
            await this.checkUserRoleAndSetDoctor(); // Await this
        }

        
        if (prevProps.allSchedule !== this.props.allSchedule) {
            let data = this.props.allSchedule;
            if (data && data.length > 0) {
                data = data.map(item => ({ ...item, isSelected: false }));
            }
            this.setState({
                rangeTime: data
            });
            
            if (this.state.selectedDoctor.value && this.state.currentDate) {
                this.fetchAndSetActiveSchedule(this.state.selectedDoctor.value, this.state.currentDate);
            }
        }

        
        if (prevProps.userInfo !== this.props.userInfo) {
            await this.checkUserRoleAndSetDoctor(); // Await this
        }

       
        if ((prevState.selectedDoctor.value !== this.state.selectedDoctor.value && this.state.selectedDoctor.value) ||
            (prevState.currentDate !== this.state.currentDate && this.state.currentDate)
        ) {
            if (this.state.selectedDoctor.value && this.state.currentDate) {
                this.fetchAndSetActiveSchedule(this.state.selectedDoctor.value, this.state.currentDate);
            }
        }
    }

    checkUserRoleAndSetDoctor = async () => { // Thêm async
        const { userInfo, allDoctors, language } = this.props;
        if (userInfo && userInfo.roleId === 'R2' && allDoctors && allDoctors.length > 0) {
            const doctorInfo = allDoctors.find(doctor => doctor.id === userInfo.id);
            if (doctorInfo) {
                let label = language === LANGUAGES.VI ? `${doctorInfo.lastName} ${doctorInfo.firstName}` : `${doctorInfo.firstName} ${doctorInfo.lastName}`;
                this.setState({
                    selectedDoctor: {
                        label: label,
                        value: doctorInfo.id,
                    },
                    isDoctorRole: true,
                });
                return true; 
            }
        }
        this.setState({
            selectedDoctor: {},
            isDoctorRole: false,
        });
        return false;
    };

    buildDataInputSelect = (inputData) => {
        let res = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                res.push(object);
            });
        }
        return res;
    };

    
    fetchAndSetActiveSchedule = async (doctorId, date) => {
        try {
            
            let formatedDate = new Date(date).getTime(); 

            let res = await getScheduleDoctorByDateService(doctorId, formatedDate);
            let { rangeTime } = this.state; 

            
            let updatedRangeTime = rangeTime.map(item => ({ ...item, isSelected: false }));

            if (res && res.errCode === 0 && res.data && res.data.length > 0) {
                
                res.data.forEach(savedSchedule => {
                    updatedRangeTime = updatedRangeTime.map(timeItem => {
                        if (timeItem.keyMap === savedSchedule.timeType) {
                            return { ...timeItem, isSelected: true };
                        }
                        return timeItem;
                    });
                });
            }
            this.setState({
                rangeTime: updatedRangeTime, 
            });

        } catch (error) {
            console.error("Error fetching and setting active schedule:", error);
            let updatedRangeTime = this.state.rangeTime.map(item => ({ ...item, isSelected: false }));
            this.setState({
                rangeTime: updatedRangeTime,
            });
            toast.error(<FormattedMessage id="manage-schedule.fetch-schedule-error" defaultMessage="Lỗi khi tải lịch làm việc!" />);
        }
    };


    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
        
    };

    handleOnchangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        });
        
    };

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });
            this.setState({
                rangeTime: rangeTime
            });
        }
    };

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let res = [];
        if (!currentDate) {
            toast.error(<FormattedMessage id="manage-schedule.error-date" />);
            return;
        }
        if (_.isEmpty(selectedDoctor)) {
            toast.error(<FormattedMessage id="manage-schedule.error-doctor" />);
            return;
        }

        let formatedDate = new Date(currentDate).getTime();

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let obj = {};
                    obj.doctorId = selectedDoctor.value;
                    obj.date = formatedDate;
                    obj.timeType = schedule.keyMap;
                    res.push(obj);
                });
            } else {
                toast.error(<FormattedMessage id="manage-schedule.error-time" />);
                return;
            }
        }

        let resultData = await saveScheduleDoctorsService({
            arrSchedule: res,
            doctorId: selectedDoctor.value,
            formatedDate: formatedDate
        });
        if (resultData && resultData.errCode === 0) {
            toast.success(<FormattedMessage id="manage-schedule.save-success" />);
            this.fetchAndSetActiveSchedule(selectedDoctor.value, currentDate);
        } else {
            toast.error(<FormattedMessage id="manage-schedule.save-error" />);
        }
    };

    handleChatWithSelf = async () => {
        const { userInfo } = this.props;
        const { currentUser } = this.context;

        if (!currentUser) {
            
            if (this.props.history) {
                this.props.history.push('/chat-app/login');
            }
            return;
        }

        if (this.props.history) {
            this.props.history.push('/chat-app');
        } else {
            console.warn("React Router history object not available. Cannot navigate to chat.");
            toast.error("Không thể điều hướng đến trang chat. Vui lòng kiểm tra cấu hình Router.");
        }
    };

    render() {
        let { rangeTime, isDoctorRole, selectedDoctor } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

        return (
            <div className='manage-schedule-container'>
                {isDoctorRole && (
                    <div className="chat-button" onClick={() => this.handleChatWithSelf()}>
                        <img src={chatIcon} alt="Chat Icon" className="chat-icon-img" />
                        
                    </div>
                )}

                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-doctor" /></label>
                            {isDoctorRole ? (
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedDoctor.label || ''}
                                    disabled
                                />
                            ) : (
                                <Select
                                    value={this.state.selectedDoctor}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.listDoctors}
                                />
                            )}
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnchangeDatePicker}
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 ?
                                rangeTime.map((item, index) => {
                                    return (
                                        <button className={item.isSelected === true
                                            ? 'btn btn-schedule active'
                                            : 'btn btn-schedule'}
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}
                                        >
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                                :
                                <div className='no-schedule-message'>
                                    <FormattedMessage id="manage-schedule.no-time-slots" defaultMessage="Không có khung giờ nào được chọn cho ngày này." />
                                </div>
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary my-3'
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allSchedule: state.admin.allSchedule,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGetAllDoctors: () => dispatch(actions.fetchGetAllDoctors()),
        fetchGetAllScheduleTime: () => dispatch(actions.fetchGetAllScheduleTime()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageSchedule));
