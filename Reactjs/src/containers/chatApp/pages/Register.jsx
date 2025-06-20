// src/pages/Register.jsx
import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useHistory, Link } from "react-router-dom";
import { supabase } from "../supabase";


import { useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';

import { LANGUAGES } from '../../../utils'; 

const ChatAppRegister = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

  
    const language = useSelector(state => state.app.language);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
           
            const res = await createUserWithEmailAndPassword(auth, email, password);

            
            let downloadURL = null;
            if (file) {
                const fileName = `${displayName}_${new Date().getTime()}_${file.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("chat-images") 
                    .upload(fileName, file, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) {
                    console.error("Supabase Upload Error:", uploadError);
                    setErr(true);
                    setLoading(false);
                    return;
                }

              
                const { data: publicUrlData } = supabase.storage
                    .from("chat-images")
                    .getPublicUrl(fileName);

                downloadURL = publicUrlData.publicUrl;
            }

           
            try {
                
                await updateProfile(res.user, {
                    displayName,
                    photoURL: downloadURL || "", 
                });

                
                await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    displayName,
                    email,
                    photoURL: downloadURL || "",
                    role: "R3", 
                });

                
                await setDoc(doc(db, "userChats", res.user.uid), {});
                history.replace("/chat-app");
            } catch (err) {
                console.error("Firestore/UpdateProfile Error:", err);
                setErr(true);
                setLoading(false);
            }
        } catch (err) {
            console.error("Firebase Auth Error:", err);
            setErr(true);
            setLoading(false);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Lama Chat</span>
                <span className="title">
                    <FormattedMessage id="chat.register-title" defaultMessage="Đăng ký" />
                </span>
                <form onSubmit={handleSubmit}>
                    <input
                        required
                        type="text"
                        
                        placeholder={language === LANGUAGES.VI ? "Tên hiển thị" : "display name"}
                    />
                    <input
                        required
                        type="email"
                        
                        placeholder={language === LANGUAGES.VI ? "Email" : "email"}
                    />
                    <input
                        required
                        type="password"
                        
                        placeholder={language === LANGUAGES.VI ? "Mật khẩu" : "password"}
                    />
                    <input required style={{ display: "none" }} type="file" id="file" />
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>
                            <FormattedMessage id="chat.add-avatar-label" defaultMessage="Thêm ảnh đại diện" />
                        </span>
                    </label>
                    <button disabled={loading}>
                        <FormattedMessage id="chat.sign-up-button" defaultMessage="Đăng ký" />
                    </button>
                    {loading && (
                        <span>
                            <FormattedMessage id="chat.uploading-message" defaultMessage="Đang tải và nén ảnh, vui lòng đợi..." />
                        </span>
                    )}
                    {err && (
                        <span>
                            <FormattedMessage id="chat.register-error" defaultMessage="Đã xảy ra lỗi!" />
                        </span>
                    )}
                </form>
                <p>
                    <FormattedMessage id="chat.have-account-question" defaultMessage="Bạn đã có tài khoản?" />{" "}
                    <Link to="/chat-app/login">
                        <FormattedMessage id="chat.login-link" defaultMessage="Đăng nhập" />
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ChatAppRegister;
