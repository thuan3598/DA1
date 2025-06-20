import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from '../../../store/actions';
import './ManageAccount.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { auth as firebaseAuth } from '../../chatApp/firebase';
import { updateProfile, signOut } from "firebase/auth";
import { supabase } from '../../chatApp/supabase';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db as firestoreDb } from '../../chatApp/firebase';
import { processLogout } from '../../../store/actions/userActions';

const MESSAGES = {
    'VI': {
        missingParam: 'Thiếu tham số bắt buộc: ',
        invalidEmailFormat: 'Email không hợp lệ.',
        weakPassword: 'Mật khẩu phải có ít nhất 6 ký tự.',
        firebaseAuthError: 'Lỗi xác thực Firebase: ',
        supabaseUploadError: 'Lỗi tải ảnh lên Supabase.',
        supabaseDeleteError: 'Lỗi xóa ảnh cũ trên Supabase.',
        unexpectedError: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.',
        updateSuccess: 'Cập nhật tài khoản thành công! Bạn sẽ được đăng xuất để cập nhật thông tin.',
        noChanges: 'Không có thay đổi nào để lưu.',
        failedToLogout: 'Cập nhật thành công nhưng không thể đăng xuất tự động. Vui lòng đăng xuất thủ công.'
    },
    'EN': {
        missingParam: 'Missing required parameter: ',
        invalidEmailFormat: 'Invalid email format.',
        weakPassword: 'Password must be at least 6 characters long.',
        firebaseAuthError: 'Firebase authentication error: ',
        supabaseUploadError: 'Error uploading image to Supabase.',
        supabaseDeleteError: 'Error deleting old image from Supabase.',
        unexpectedError: 'An unexpected error occurred. Please try again.',
        updateSuccess: 'Account updated successfully! You will be logged out to refresh information.',
        noChanges: 'No changes to save.',
        failedToLogout: 'Update successful but failed to log out automatically. Please log out manually.'
    }
};

const getLocalizedMessage = (key, language = 'EN') => {
    return MESSAGES[language]?.[key] || MESSAGES['EN'][key];
};

class ManageAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderAll: [],
            previewImgURL: '',
            isOpen: false,
            id: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            avatar: '',
            selectedFile: null,
            firebaseUid: '',
            originalData: null,
            isLoadingFirebase: false,
            firebaseError: '',
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.loadUserDataIntoForm();
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.userInfo !== this.props.userInfo && this.props.userInfo) {
            this.loadUserDataIntoForm();
        }

        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            if (!this.state.gender && arrGenders && arrGenders.length > 0) {
                this.setState({ gender: arrGenders[0].keyMap });
            }
            this.setState({ genderAll: arrGenders });
        }
    }

    loadUserDataIntoForm = () => {
        const { userInfo } = this.props;
        if (userInfo && userInfo.id) {
            let imgBase64 = '';
            if (userInfo.image) {
                imgBase64 = new Buffer(userInfo.image, 'base64').toString('binary');
            }

            this.setState({
                id: userInfo.id,
                email: userInfo.email,
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                phoneNumber: userInfo.phonenumber,
                address: userInfo.address,
                gender: userInfo.gender,
                position: userInfo.positionId,
                role: userInfo.roleId,
                avatar: userInfo.image,
                previewImgURL: userInfo.firebasePhotoURL || imgBase64,
                firebaseUid: userInfo.firebaseUid || '',
                originalData: {
                    firstName: userInfo.firstName,
                    lastName: userInfo.lastName,
                    phoneNumber: userInfo.phonenumber,
                    address: userInfo.address,
                    gender: userInfo.gender,
                    previewImgURL: userInfo.firebasePhotoURL || imgBase64,
                }
            });
        }
    };

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectURL = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectURL,
                avatar: base64, // Store only the clean Base64 string
                selectedFile: file
            });
        }
    };

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        });
    };

    getSupabasePathFromUrl = (url) => {
        if (!url) return null;
        const parts = url.split('/public/');
        if (parts.length > 1) {
            return parts[1];
        }
        return null;
    };

    handleSaveAccount = async () => {
        const { id, email, firstName, lastName, phoneNumber, address, gender, position, role,
                avatar, selectedFile, firebaseUid, previewImgURL, originalData } = this.state;
        const currentLang = this.props.language;

        const isDataChanged =
            firstName !== originalData.firstName ||
            lastName !== originalData.lastName ||
            phoneNumber !== originalData.phoneNumber ||
            address !== originalData.address ||
            gender !== originalData.gender ||
            selectedFile !== null ||
            previewImgURL !== originalData.previewImgURL;

        if (!isDataChanged) {
            alert(getLocalizedMessage('noChanges', currentLang));
            return;
        }

        let isValid = true;
        const arrCheck = ['firstName', 'lastName', 'phoneNumber', 'address', 'gender'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert(getLocalizedMessage('missingParam', currentLang) + arrCheck[i]);
                return;
            }
        }

        this.setState({ isLoadingFirebase: true, firebaseError: '' });

        try {
            let photoURL = previewImgURL;
            let isPhotoChanged = false;

            if (selectedFile) {
                isPhotoChanged = true;
                const userDocRef = doc(firestoreDb, "users", firebaseUid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists() && userDocSnap.data().photoURL && userDocSnap.data().photoURL !== 'https://via.placeholder.com/150') {
                    const oldFirebasePhotoURL = userDocSnap.data().photoURL;
                    const oldFilePath = this.getSupabasePathFromUrl(oldFirebasePhotoURL);
                    if (oldFilePath) {
                        const { error: deleteError } = await supabase.storage
                            .from("chat-images")
                            .remove([oldFilePath]);

                        if (deleteError) {
                            console.error("Supabase Delete Error:", deleteError);
                            this.setState({ firebaseError: getLocalizedMessage('supabaseDeleteError', currentLang), isLoadingFirebase: false });
                            return;
                        }
                    }
                }

                const fileName = `${email}_${new Date().getTime()}_${selectedFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("chat-images")
                    .upload(fileName, selectedFile, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) {
                    console.error("Supabase Upload Error:", uploadError);
                    this.setState({ firebaseError: getLocalizedMessage('supabaseUploadError', currentLang), isLoadingFirebase: false });
                    return;
                }

                const { data: publicUrlData } = supabase.storage
                    .from("chat-images")
                    .getPublicUrl(fileName);

                photoURL = publicUrlData.publicUrl;
            } else if (previewImgURL === '' && originalData.previewImgURL !== '') {
                isPhotoChanged = true;
                photoURL = '';

                const oldFilePath = this.getSupabasePathFromUrl(originalData.previewImgURL);
                if (oldFilePath) {
                    const { error: deleteError } = await supabase.storage
                        .from("chat-images")
                        .remove([oldFilePath]);
                    if (deleteError) {
                        console.error("Supabase Delete Error (on clear):", deleteError);
                        this.setState({ firebaseError: getLocalizedMessage('supabaseDeleteError', currentLang), isLoadingFirebase: false });
                        return;
                    }
                }
            }

            const firebaseUser = firebaseAuth.currentUser;
            if (firebaseUser && firebaseUser.uid === firebaseUid) {
                const firebaseDisplayName = `${lastName} ${firstName}`;
                let authUpdateData = {};

                if (firebaseDisplayName !== firebaseUser.displayName) {
                    authUpdateData.displayName = firebaseDisplayName;
                }
                if (isPhotoChanged) {
                    authUpdateData.photoURL = photoURL;
                }

                if (Object.keys(authUpdateData).length > 0) {
                    await updateProfile(firebaseUser, authUpdateData);
                    console.log("Firebase Auth profile updated!");
                }
            }

            if (firebaseUid) {
                let firestoreUpdateData = {};
                const firebaseDisplayName = `${lastName} ${firstName}`;

                if (firebaseDisplayName !== this.state.originalData.firstName + " " + this.state.originalData.lastName) {
                    firestoreUpdateData.displayName = firebaseDisplayName;
                }
                if (isPhotoChanged) {
                    firestoreUpdateData.photoURL = photoURL;
                } else if (previewImgURL === '' && originalData.previewImgURL !== '') {
                    firestoreUpdateData.photoURL = '';
                }

                if (Object.keys(firestoreUpdateData).length > 0) {
                    await updateDoc(doc(firestoreDb, "users", firebaseUid), firestoreUpdateData);
                    console.log("Firebase Firestore user document updated!");
                }
            } else {
                console.warn("Firebase UID not found, cannot update Firebase Firestore profile.");
            }

            // Ensure avatar is a string or null
            const userData = {
                id: id,
                email: email,
                firstName: firstName,
                lastName: lastName,
                address: address,
                phonenumber: phoneNumber,
                gender: gender,
                roleId: role,
                positionId: position,
                avatar: avatar || '', // Ensure avatar is a string or empty
                firebaseUid: firebaseUid,
            };

            console.log("Sending user data to backend:", userData);
            this.props.editUser(userData);

            alert(getLocalizedMessage('updateSuccess', currentLang));
            try {
                await signOut(firebaseAuth);
                this.props.processLogoutRedux();
            } catch (logoutErr) {
                console.error("Error during auto-logout:", logoutErr);
                alert(getLocalizedMessage('failedToLogout', currentLang));
            }

        } catch (error) {
            console.error("General error during account update:", error);
            this.setState({
                firebaseError: getLocalizedMessage('unexpectedError', currentLang) + (error.message || ''),
                isLoadingFirebase: false
            });
        }
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    };

    render() {
        let genderData = this.state.genderAll;
        let language = this.props.language;
        let { email, firstName, lastName, phoneNumber, address, gender, previewImgURL, isLoadingFirebase, firebaseError } = this.state;

        return (
            <div className='user-redux-container manage-account-container'>
                <div className='title'>
                    <FormattedMessage id="manage-account.title" defaultMessage="Quản lý tài khoản" />
                </div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-4'>
                                <strong><FormattedMessage id="manage-account.edit-info" defaultMessage="Chỉnh sửa thông tin tài khoản" /></strong>
                            </div>
                            <div className='row col-12 my-2'>
                                <div className='col-3'>
                                    <label><FormattedMessage id="manage-user.email" /></label>
                                    <input className='form-control' type='email'
                                        value={email}
                                        disabled
                                    />
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="manage-user.firstName" /></label>
                                    <input className='form-control' type='text'
                                        value={firstName}
                                        onChange={(event) => { this.onChangeInput(event, 'firstName') }}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="manage-user.lastName" /></label>
                                    <input className='form-control' type='text'
                                        value={lastName}
                                        onChange={(event) => { this.onChangeInput(event, 'lastName') }}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="manage-user.phoneNumber" /></label>
                                    <input className='form-control' type='text'
                                        value={phoneNumber}
                                        onChange={(event) => { this.onChangeInput(event, 'phoneNumber') }}
                                    />
                                </div>
                            </div>
                            <div className='row col-12 my-2'>
                                <div className='col-9'>
                                    <label><FormattedMessage id="manage-user.address" /></label>
                                    <input className='form-control' type='text'
                                        value={address}
                                        onChange={(event) => { this.onChangeInput(event, 'address') }}
                                    />
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="manage-user.gender" /></label>
                                    <select className="form-control"
                                        onChange={(event) => { this.onChangeInput(event, 'gender') }}
                                        value={gender}
                                    >
                                        {genderData && genderData.length > 0 &&
                                            genderData.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-3'>
                                    <label><FormattedMessage id="manage-user.image" /></label>
                                    <div className='preview-img-container'>
                                        <input id='previewImg' type='file' hidden
                                            onChange={(event) => this.handleOnChangeImage(event)}
                                        />
                                        <label className='label-upload' htmlFor='previewImg'>
                                            <FormattedMessage id="manage-user.preview-image" />
                                            <i className="fas fa-upload"></i>
                                        </label>
                                        {previewImgURL && (
                                            <span className="delete-image-btn" onClick={() => this.setState({ previewImgURL: '', selectedFile: null, avatar: '' })}>
                                                <i className="fas fa-times"></i>
                                            </span>
                                        )}
                                        <div className='preview-image'
                                            style={{ backgroundImage: `url(${previewImgURL})` }}
                                            onClick={() => this.openPreviewImage()}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            {firebaseError && <div className="text-danger my-2">{firebaseError}</div>}
                            <div className='col-12 mb-3'>
                                <button
                                    className="btn btn-warning"
                                    onClick={() => this.handleSaveAccount()}
                                    disabled={isLoadingFirebase}
                                >
                                    {isLoadingFirebase ? "Đang xử lý..." : <FormattedMessage id="manage-account.update" defaultMessage="Cập nhật" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        editUser: (data) => dispatch(actions.fetchEditUser(data)),
        processLogoutRedux: () => dispatch(processLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccount);