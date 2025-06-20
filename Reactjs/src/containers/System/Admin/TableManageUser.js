// import React, { Component } from 'react';
// import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
// import './TableManageUser.scss';
// import * as actions from '../../../store/actions';

// // Firebase & Supabase Imports
// // Không cần import firebaseAuth nếu không xóa tài khoản Auth từ client
// import {
//     doc,
//     deleteDoc,
//     getDoc,
//     setDoc // Vẫn cần setDoc để cập nhật userChats của người khác
// } from "firebase/firestore";
// import { db as firestoreDb } from '../../chatApp/firebase'; // Firestore DB instance
// import { supabase } from '../../chatApp/supabase'; // Supabase client


// // Định nghĩa các thông báo được bản địa hóa
// const MESSAGES = {
//     'VI': {
//         confirmDeleteUser: 'Bạn có chắc chắn muốn xóa người dùng này? Thao tác này sẽ xóa tài khoản chat, ảnh đại diện và tất cả các cuộc trò chuyện liên quan!',
//         confirmDeleteTitle: 'Xác nhận xóa',
//         deleteSuccess: 'Xóa người dùng thành công!',
//         deleteFailed: 'Xóa người dùng thất bại: ',
//         firebaseFirestoreDeleteError: 'Lỗi xóa dữ liệu Firestore.',
//         supabaseDeleteError: 'Lỗi xóa ảnh từ Supabase.',
//         chatCleanupError: 'Lỗi khi dọn dẹp các cuộc trò chuyện.',
//         confirm_yes: 'Có',
//         confirm_no: 'Không',
//         no_users_found: 'Không tìm thấy người dùng nào',
//         deletingText: 'Đang xóa...',
//         emailHeader: 'Email',
//         firstNameHeader: 'Tên',
//         lastNameHeader: 'Họ',
//         addressHeader: 'Địa chỉ',
//         phoneHeader: 'Số điện thoại',
//         actionsHeader: 'Thao tác'
//     },
//     'EN': {
//         confirmDeleteUser: 'Are you sure you want to delete this user? This will remove their chat account, avatar, and all related conversations!',
//         confirmDeleteTitle: 'Confirm Deletion',
//         deleteSuccess: 'User deleted successfully!',
//         deleteFailed: 'Failed to delete user: ',
//         firebaseFirestoreDeleteError: 'Firestore data deletion error.',
//         supabaseDeleteError: 'Supabase image deletion error.',
//         chatCleanupError: 'Error cleaning up chat conversations.',
//         confirm_yes: 'Yes',
//         confirm_no: 'No',
//         no_users_found: 'No users found',
//         deletingText: 'Deleting...',
//         emailHeader: 'Email',
//         firstNameHeader: 'First name',
//         lastNameHeader: 'Last name',
//         addressHeader: 'Address',
//         phoneHeader: 'Phone number',
//         actionsHeader: 'Actions'
//     }
// };

// const getLocalizedMessage = (key, language = 'EN') => {
//     const lang = language === 'VI' ? 'VI' : 'EN';
//     return MESSAGES[lang]?.[key] || MESSAGES['EN'][key];
// };

// class TableManageUser extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             userRedux: [],
//             // Bỏ showConfirmModal và userToDelete vì không dùng modal tùy chỉnh
//             isDeleting: false,
//             deleteError: '',
//         };
//     }

//     componentDidMount() {
        
//         this.props.fetchUserRedux();
//     }

//     componentDidUpdate(prevProps) {
//         if (prevProps.listUsers !== this.props.listUsers) {
            
//             this.setState({ userRedux: this.props.listUsers });
//         }
//     }

//     getSupabasePathFromUrl = (url) => {
//         if (!url) return null;
//         const parts = url.split('/public/');
//         return parts.length > 1 ? parts[1] : null;
//     };

//     // handleDeleteUser giờ đây sẽ xử lý trực tiếp logic xác nhận và xóa
//     handleDeleteUser = async (user) => {
//         const { language } = this.props;

//         // Sử dụng window.confirm() để xác nhận
//         const confirmDelete = window.confirm(getLocalizedMessage('confirmDeleteUser', language));

//         if (!confirmDelete) {
           
//             return; // Người dùng không xác nhận, thoát
//         }

        
//         this.setState({ isDeleting: true, deleteError: '' }); // Bắt đầu trạng thái xóa

//         try {
//             const firebaseUid = user.firebaseUid; // Lấy firebaseUid từ dữ liệu user
//             if (!firebaseUid) {
//                 console.error("Firebase UID is missing for user:", user);
//                 throw new Error("Firebase UID not found for user.");
//             }
            

//             // --- Step 1: Get user's current photoURL from Firestore (chat app) ---
//             let photoURLToDelete = null;
//             const userDocRef = doc(firestoreDb, "users", firebaseUid);
            
//             const userDocSnap = await getDoc(userDocRef);

//             if (userDocSnap.exists()) {
//                 photoURLToDelete = userDocSnap.data().photoURL;
                
//             } else {
//                 console.warn("Firestore user document not found for UID:", firebaseUid, "Skipping photo deletion and Firestore 'users' doc deletion.");
//             }

//             // --- Step 2: Delete avatar from Supabase Storage ---
//             if (photoURLToDelete) {
//                 const filePath = this.getSupabasePathFromUrl(photoURLToDelete);
//                 if (filePath) {
                    
//                     const { error: deleteStorageError } = await supabase.storage
//                         .from("chat-images") // Assuming 'chat-images' is your bucket
//                         .remove([filePath]);

//                     if (deleteStorageError) {
//                         console.error("Supabase Storage Deletion Error:", deleteStorageError);
//                         throw new Error(getLocalizedMessage('supabaseDeleteError', language));
//                     }
                    
//                 } else {
//                     console.warn("Could not extract file path from photoURL:", photoURLToDelete);
//                 }
//             }

//             // --- Step 3: Delete user's document from Firestore 'users' collection ---
//             if (userDocSnap.exists()) {
                
//                 await deleteDoc(doc(firestoreDb, "users", firebaseUid));
                
//             }

//             // --- Step 4: Delete user's 'userChats' document and related 'chats' documents ---
//             const userChatsDocRef = doc(firestoreDb, "userChats", firebaseUid);
            
//             const userChatsDocSnap = await getDoc(userChatsDocRef);

//             if (userChatsDocSnap.exists()) {
//                 const userChatsData = userChatsDocSnap.data();
//                 const chatIds = Object.keys(userChatsData);
                

//                 for (const chatId of chatIds) {
                    
//                     await deleteDoc(doc(firestoreDb, "chats", chatId));
                    

//                     // Cập nhật userChats của người tham gia còn lại (nếu có)
//                     const otherUid = chatId.replace(firebaseUid, '');
//                     if (otherUid && otherUid !== firebaseUid) {
//                         try {
                           
//                             const otherUserChatDocRef = doc(firestoreDb, "userChats", otherUid);
//                             const otherUserChatDocSnap = await getDoc(otherUserChatDocRef);
//                             if (otherUserChatDocSnap.exists()) {
//                                 const updatedOtherUserChats = { ...otherUserChatDocSnap.data() };
//                                 delete updatedOtherUserChats[chatId]; // Xóa trường combinedId
//                                 await setDoc(otherUserChatDocRef, updatedOtherUserChats); // Ghi lại tài liệu đã cập nhật
//                             } else {
//                                 console.warn(`Other user's userChats document not found for UID: ${otherUid}. Skipping update.`);
//                             }
//                         } catch (otherUserUpdateError) {
//                             console.warn(`Failed to update other user's userChats (${otherUid}) for chat ${chatId}:`, otherUserUpdateError);
//                         }
//                     }
//                 }
//                 // Xóa tài liệu userChats của người dùng hiện tại
//                 await deleteDoc(userChatsDocRef);
//             } 

//             // --- Bước 5: KHÔNG xóa tài khoản Firebase Authentication từ client ---
//             // Phần này bị bỏ qua như yêu cầu.
//             // Nhắc lại: Để xóa tài khoản Firebase Auth của người dùng khác, bạn CẦN backend với Firebase Admin SDK.

//             // --- Bước 6: Delete user from Booking Backend ---
//             await this.props.deleteUserRedux(user.id); // Gọi Redux action để xóa từ backend booking system

//             this.setState({
//                 isDeleting: false,
//                 deleteError: '', // Xóa lỗi sau khi thành công
//             });
//             alert(getLocalizedMessage('deleteSuccess', language));
//             this.props.fetchUserRedux(); // Refresh user list sau khi xóa thành công

//         } catch (error) {
//             console.error("Full user deletion process failed:", error);
//             const errorMessage = error.message || error.toString();
//             this.setState({
//                 isDeleting: false,
//                 deleteError: getLocalizedMessage('deleteFailed', language) + errorMessage,
//             });
//             alert(getLocalizedMessage('deleteFailed', language) + errorMessage);
//         }
//     };

//     handleEditUser = (user) => {
//         this.props.handleEditUserFromParent(user);
//     };

//     render() {
//         const { userRedux, isDeleting, deleteError } = this.state;
//         const { language } = this.props;

//         return (
//             <>
//                 <table id='TableManageUser'>
//                     <tbody>
//                         <tr>
//                             <th>{getLocalizedMessage('emailHeader', language)}</th>
//                             <th>{getLocalizedMessage('firstNameHeader', language)}</th>
//                             <th>{getLocalizedMessage('lastNameHeader', language)}</th>
//                             <th>{getLocalizedMessage('addressHeader', language)}</th>
//                             <th>{getLocalizedMessage('phoneHeader', language)}</th>
//                             <th>{getLocalizedMessage('actionsHeader', language)}</th>
//                         </tr>
//                         {userRedux && userRedux.length > 0 ? (
//                             userRedux.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{item.email}</td>
//                                     <td>{item.firstName}</td>
//                                     <td>{item.lastName}</td>
//                                     <td>{item.address}</td>
//                                     <td>{item.phonenumber}</td>
//                                     <td>
//                                         <button
//                                             className='btn-edit'
//                                             onClick={() => this.handleEditUser(item)}
//                                         >
//                                             <i className="fas fa-pencil-alt"></i>
//                                         </button>
//                                         <button
//                                             className='btn-delete'
//                                             onClick={() => this.handleDeleteUser(item)}
//                                             disabled={isDeleting} // Vô hiệu hóa nút trong khi đang xóa
//                                         >
//                                             <i className="fas fa-trash-alt"></i>
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="6" style={{ textAlign: 'center' }}>
//                                     {getLocalizedMessage('no_users_found', language)}
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>

//                 {/* Hiển thị lỗi nếu có, không phải là modal */}
//                 {deleteError && (
//                     <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
//                         {deleteError}
//                     </div>
//                 )}
//             </>
//         );
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         listUsers: state.admin.users,
//         language: state.app.language,
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
//         deleteUserRedux: (id) => dispatch(actions.fetchDeleteUser(id)),
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);


import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from '../../../store/actions'

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
// const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userRedux: [],
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id)
    }

    handleEditUser = (user) => {
        console.log('user edit: ', user)
        this.props.handleEditUserFromParent(user)
    }

    //Life cycle
    //Run Component: 1.Run constructor -> initstate 
    // 2. Did mount (set state)
    // 3. Render 
    render() {
        console.log('check all user:', this.props.listUsers)
        console.log('check state:', this.state.userRedux)
        let arrUsers = this.state.userRedux
        return (
            <>
                <table id='TableManageUser'>
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Phone number</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers && arrUsers.length > 0 && 
                                arrUsers.map((item, index) => {
                                    return (
                                        <>
                                            <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            <td>{item.phonenumber}</td>
                                            <td>
                                                    <button className='btn-edit'
                                                    onClick={() => this.handleEditUser(item)}    
                                                    ><i className="fas fa-pencil-alt"></i></button>

                                                    <button className='btn-delete'
                                                    onClick={() => this.handleDeleteUser(item)}
                                                    ><i className="fas fa-trash-alt"></i></button>
                                            </td>
                                            </tr>
                                        </>
                                    )
                                })    
                            }                    
                        </tbody>    
                </table>   
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        deleteUserRedux: (id) => dispatch(actions.fetchDeleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
