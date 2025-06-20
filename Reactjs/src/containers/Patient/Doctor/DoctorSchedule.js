import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';
import './DoctorSchedule.scss'
import { getScheduleDoctorByDateService } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import moment from 'moment';
import localization from 'moment/locale/vi'
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';
import chatIcon from '../../../assets/email.png';
import { toast } from 'react-toastify'; // Import toast for user feedback

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

class DoctorSchedule extends Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props)
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
            firebaseUid: null, // firebaseUid của bác sĩ
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
            let firebaseUid = null
            if (res.data && res.data.length > 0 && res.data[0].doctorData) {
                firebaseUid = res.data[0].doctorData.firebaseUid
            }
            this.setState({
                allAvailableTime: res.data ? res.data : [],
                firebaseUid: firebaseUid
            })
            console.log('check firebaseUid in componentDidMount: ', firebaseUid)
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
            let firebaseUid = null
            if (res.data && res.data.length > 0 && res.data[0].doctorData) {
                firebaseUid = res.data[0].doctorData.firebaseUid
            }
            this.setState({
                allAvailableTime: res.data ? res.data : [],
                firebaseUid: firebaseUid
            })
            console.log('check firebaseUid in componentDidUpdate: ', firebaseUid)
        }
    }

    getArrDays = (language) => {
        let arrDays = []
        for (let i = 0; i < 7; i++) {
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

            let firebaseUid = null;
            if (res.data && res.data.length > 0 && res.data[0].doctorData) {
                firebaseUid = res.data[0].doctorData.firebaseUid
            }

            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : [],
                    firebaseUid: firebaseUid
                })
            } else {
                this.setState({
                    allAvailableTime: [],
                    firebaseUid: firebaseUid
                })
            }
            console.log('event onchange date value check: ', res)
            console.log('check firebaseUid on date change: ', firebaseUid);
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

    
    handleChatWithDoctor = async () => {
        const { firebaseUid: doctorUid } = this.state; 
        const { currentUser } = this.context; 

        
        if (!currentUser) {
            toast.warn('Vui lòng đăng nhập vào ứng dụng chat để bắt đầu trò chuyện.');
            console.warn('Người dùng Firebase chưa đăng nhập. Chuyển hướng đến trang đăng nhập chat.');
            if (this.props.history) {
                this.props.history.push('/chat-app/login');
            }
            return;
        }

        
        if (!doctorUid) {
            toast.error('Không tìm thấy Firebase UID của bác sĩ để bắt đầu chat.');
            console.warn('Firebase UID của bác sĩ không có sẵn trong state.');
            return;
        }

        
        let currentUserRole = null;
        let doctorRole = null;

        try {
            const currentUserDoc = await getDoc(doc(firestoreDb, "users", currentUser.uid));
            if (currentUserDoc.exists()) {
                currentUserRole = currentUserDoc.data().role;
            } else {
                toast.error('Không tìm thấy thông tin vai trò của bạn. Vui lòng thử lại.');
                console.error(`Firestore user document not found for UID: ${currentUser.uid}`);
                return;
            }

            const doctorDoc = await getDoc(doc(firestoreDb, "users", doctorUid));
            if (doctorDoc.exists()) {
                doctorRole = doctorDoc.data().role;
            } else {
                toast.error('Không tìm thấy thông tin vai trò của bác sĩ. Vui lòng thử lại.');
                console.error(`Firestore user document not found for doctor UID: ${doctorUid}`);
                return;
            }
        } catch (error) {
            toast.error(`Lỗi khi lấy thông tin vai trò: ${error.message}`);
            console.error('Error fetching user roles:', error);
            return;
        }

        console.log(`Current User Role: ${currentUserRole}, Doctor Role: ${doctorRole}`);

        
        const isAllowedToChat =
            (currentUserRole === 'R2' && doctorRole === 'R3') ||
            (currentUserRole === 'R3' && doctorRole === 'R2');

        if (!isAllowedToChat) {
            toast.error('Bạn không có quyền trò chuyện với bác sĩ này. Chỉ bác sĩ và bệnh nhân mới có thể trò chuyện với nhau.');
            
            return;
        }

        
        try {
            const combinedId =
                currentUser.uid > doctorUid
                    ? currentUser.uid + doctorUid
                    : doctorUid + currentUser.uid;

            const chatDocRef = doc(firestoreDb, "chats", combinedId);
            const chatDocSnap = await getDoc(chatDocRef);

            if (!chatDocSnap.exists()) {
                console.log(`Tạo kênh chat mới với combinedId: ${combinedId}`);
                await setDoc(chatDocRef, { messages: [] });

                const doctorUserDocRef = doc(firestoreDb, "users", doctorUid);
                const doctorUserDocSnap = await getDoc(doctorUserDocRef);
                const doctorInfo = doctorUserDocSnap.exists() ? doctorUserDocSnap.data() : null;

                console.log(`Cập nhật userChats cho người dùng hiện tại UID: ${currentUser.uid}`);
                await updateDoc(doc(firestoreDb, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: doctorInfo?.uid || doctorUid,
                        displayName: doctorInfo?.displayName || 'Bác sĩ (Không rõ tên)',
                        photoURL: doctorInfo?.photoURL || '',
                        role: doctorRole 
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                console.log(`Cập nhật userChats cho bác sĩ UID: ${doctorUid}`);
                await updateDoc(doc(firestoreDb, "userChats", doctorUid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        role: currentUserRole 
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
                toast.success('Kênh chat mới đã được tạo!');
                console.log('Kênh chat mới đã được tạo.');
            } else {
                toast.info('Kênh chat đã tồn tại.');
                console.log(`Kênh chat đã tồn tại với combinedId: ${combinedId}.`);
            }

            // Điều hướng đến trang chat
            if (this.props.history) {
                this.props.history.push(`/chat/${doctorUid}`);
            } else {
                console.error("React Router history object not available. Cannot navigate to chat.");
                toast.error("Không thể điều hướng đến trang chat. Vui lòng kiểm tra cấu hình Router.");
            }

        } catch (err) {
            console.error("Lỗi khi tạo/truy cập kênh chat:", err);
            toast.error(`Đã xảy ra lỗi khi cố gắng bắt đầu trò chuyện: ${err.message || err.toString()}`);
        }
    };

    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state
        let { language } = this.props

        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule-with-chat'>
                        <div className='select-container'>
                            <select onChange={(event) => this.handleOnchangeSelect(event)}>
                                {allDays && allDays.length > 0 &&
                                    allDays.map((item, index) => {
                                        return <option key={index} value={item.value}>{item.label}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='chat-icon' onClick={this.handleChatWithDoctor}>
                            <img src={chatIcon} alt="Chat Icon" />
                            <div className="chat-tooltip">
                                <FormattedMessage id="patient.detail-doctor.chat-button" defaultMessage="Trò chuyện với bác sĩ" />
                            </div>
                        </div>
                    </div>

                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className="far fa-calendar"><span><FormattedMessage id="patient.detail-doctor.schedule" /></span></i>
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
                                        <span><FormattedMessage id="patient.detail-doctor.choose" /> <i className="far fa-hand-point-up"></i> <FormattedMessage id="patient.detail-doctor.book-free" /></span>
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
        language: state.app.language,
        
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule));
