import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


import { useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';

import { LANGUAGES } from '../../../utils'; 

const ChatAppLogin = () => {
    const [err, setErr] = useState(false);
    const history = useHistory();

   
    const language = useSelector(state => state.app.language);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.replace("/chat-app");
        } catch (err) {
            console.log("Login Error:", err.message);
            setErr(true);
        }
    };

    return (
        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">Lama Chat</span>
                <span className="title">
                    <FormattedMessage id="chat.login-title" defaultMessage="Đăng nhập" />
                </span>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        
                        placeholder={language === LANGUAGES.VI ? "Email" : "email"}
                    />
                    <input
                        type="password"
                        
                        placeholder={language === LANGUAGES.VI ? "Mật khẩu" : "password"}
                    />
                    <button>
                        <FormattedMessage id="chat.sign-in-button" defaultMessage="Đăng nhập" />
                    </button>
                    {err && (
                        <span>
                            <FormattedMessage id="chat.login-error" defaultMessage="Đã xảy ra lỗi!" />
                        </span>
                    )}
                </form>
                <p>
                    <FormattedMessage id="chat.no-account-question" defaultMessage="Bạn chưa có tài khoản?" />{" "}
                    <Link to="/chat-app/register">
                        <FormattedMessage id="chat.register-link" defaultMessage="Đăng ký" />
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ChatAppLogin;
