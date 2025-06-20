import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import { LANGUAGES } from '../../../utils'; 
import {
    getAppointmentsForPatientService, 
    cancelBookingByIdService,        
} from '../../../services/userService'; 

import './ManageBooking.scss'; 

class ManageBooking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataBookings: [], 
            isLoading: false, 
        };
    }

    async componentDidMount() {
        
        this.fetchPatientBookings();
    }

    async componentDidUpdate(prevProps, prevState) {
        
        if (this.props.language !== prevProps.language || (this.props.user && this.props.user.id !== prevProps.user.id)) {
            this.fetchPatientBookings();
        }
    }

 
    fetchPatientBookings = async () => {
        let { user, language } = this.props;
        if (!user || !user.id) {
            toast.error(language === LANGUAGES.VI ? "Vui lòng đăng nhập để xem lịch khám!" : "Please login to view your appointments!");
            return;
        }

        this.setState({ isLoading: true });

        try {
            let res = await getAppointmentsForPatientService(user.id);
            if (res && res.errCode === 0) {
                this.setState({
                    dataBookings: res.data,
                });
            } else {
                toast.error(language === LANGUAGES.VI ? "Lỗi khi tải lịch khám: " + res.errMessage : "Failed to load appointments: " + res.errMessage);
            }
        } catch (error) {
            console.error("Error fetching patient bookings:", error);
            toast.error(language === LANGUAGES.VI ? "Lỗi server khi tải lịch khám!" : "Server error when loading appointments!");
        } finally {
            this.setState({ isLoading: false });
        }
    };

   
    buildDoctorName = (doctorData) => {
        let { language } = this.props;
        if (doctorData) {
            return language === LANGUAGES.VI
                ? `${doctorData.lastName} ${doctorData.firstName}`
                : `${doctorData.firstName} ${doctorData.lastName}`;
        }
        return '';
    };

    
    buildTimeDisplay = (item) => {
        let { language } = this.props;
        if (item && item.timeTypeDataPatient && item.date) {
            let time = language === LANGUAGES.VI
                ? item.timeTypeDataPatient.valueVi
                : item.timeTypeDataPatient.valueEn;

            let date = language === LANGUAGES.VI
                ? moment.unix(+item.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+item.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} - ${date}`;
        }
        return '';
    };

  
    handleCancelBooking = async (bookingId) => {
        let { language } = this.props;
        this.setState({ isLoading: true });

        console.log("Cancelling booking with ID:", bookingId);
        try {
            let res = await cancelBookingByIdService(bookingId); 
            if (res && res.errCode === 0) {
                toast.success(language === LANGUAGES.VI ? "Hủy lịch khám thành công!" : "Appointment cancelled successfully!");
                await this.fetchPatientBookings(); 
            } else {
                toast.error(language === LANGUAGES.VI ? "Hủy lịch khám thất bại: " + res.errMessage : "Failed to cancel appointment: " + res.errMessage);
            }
        } catch (error) {
            console.error("Error canceling booking:", error);
            toast.error(language === LANGUAGES.VI ? "Lỗi server khi hủy lịch khám!" : "Server error when canceling appointment!");
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        let { dataBookings, isLoading } = this.state;
        let { language } = this.props;

        return (
            <LoadingOverlay
                active={isLoading}
                spinner
                text={language === LANGUAGES.VI ? 'Đang tải...' : 'Loading...'}
            >
                <div className="manage-booking-container">
                    <div className="m-b-title">
                        <FormattedMessage id="patient.manage-booking.title" defaultMessage="Lịch khám của tôi" />
                    </div>
                    <div className="manage-booking-body">
                        <div className="table-patient-booking">
                            <table id="patientBookings">
                                <thead>
                                    <tr>
                                        <th><FormattedMessage id="patient.manage-booking.numeric" defaultMessage="STT" /></th>
                                        <th><FormattedMessage id="patient.manage-booking.doctor-name" defaultMessage="Tên bác sĩ" /></th>
                                        <th><FormattedMessage id="patient.manage-booking.time" defaultMessage="Thời gian" /></th>
                                        <th><FormattedMessage id="patient.manage-booking.reason" defaultMessage="Lý do khám" /></th>
                                        <th><FormattedMessage id="patient.manage-booking.status" defaultMessage="Trạng thái" /></th>
                                        <th><FormattedMessage id="patient.manage-booking.action" defaultMessage="Hành động" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataBookings && dataBookings.length > 0 ? (
                                        dataBookings.map((item, index) => {
                                            let doctorName = this.buildDoctorName(item.doctorInfoBooking);
                                            let timeDisplay = this.buildTimeDisplay(item);
                                            let statusDisplay = language === LANGUAGES.VI ? item.statusTypeDataPatient.valueVi : item.statusTypeDataPatient.valueEn;

                                            return (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{doctorName}</td>
                                                    <td>{timeDisplay}</td>
                                                    <td>{item.reason}</td>
                                                    <td>{statusDisplay}</td>
                                                    <td>
                                                        {item.statusId === 'S2' && ( 
                                                            <button
                                                                className="btn btn-danger btn-cancel-booking"
                                                                onClick={() => this.handleCancelBooking(item.id)}
                                                            >
                                                                <FormattedMessage id="patient.manage-booking.cancel-btn" defaultMessage="Hủy" />
                                                            </button>
                                                        )}
                                                        
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                                <FormattedMessage id="patient.manage-booking.no-data" defaultMessage="Bạn chưa có lịch khám nào." />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {}; 
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageBooking);
