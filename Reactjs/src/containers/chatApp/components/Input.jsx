// src/components/Input.jsx
import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
    arrayUnion,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { supabase } from "../supabase";


import { useSelector } from 'react-redux';

import { FormattedMessage } from 'react-intl';

import { LANGUAGES } from '../../../utils'; 

const Input = () => {
    const [text, setText] = useState("");
    const [img, setImg] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    
    const language = useSelector(state => state.app.language);

    const handleSend = async () => {
        if (text.trim() === "" && !img) {
            return;
        }

        try {
            let messageContent = {
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
            };

            if (img) {
                const fileName = `${uuid()}_${img.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("chat-images")
                    .upload(fileName, img, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) {
                    console.error("Supabase Upload Error:", uploadError);
                    
                    return;
                }

                const { data: publicUrlData } = supabase.storage
                    .from("chat-images")
                    .getPublicUrl(fileName);

                messageContent.img = publicUrlData.publicUrl;
            }

            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion(messageContent),
            });

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text: text || (language === LANGUAGES.VI ? "Đã gửi ảnh" : "Sent an image"),
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text: text || (language === LANGUAGES.VI ? "Đã gửi ảnh" : "Sent an image"),
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });

            setText("");
            setImg(null);
        } catch (error) {
            console.error("Error sending message:", error);
            
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="input">
            <input
                type="text"
                
                placeholder={language === LANGUAGES.VI ? "Gõ tin nhắn..." : "Type something..."}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKey}
                value={text}
            />
            <div className="send">
                <img src={Attach} alt="Attach file" />
                <input
                    type="file"
                    style={{ display: "none" }}
                    id="file"
                    onChange={(e) => setImg(e.target.files[0])}
                />
                <label htmlFor="file">
                    <img src={Img} alt="Send image" />
                </label>
                {/* Sử dụng FormattedMessage cho nút Send */}
                <button onClick={handleSend}>
                    <FormattedMessage id="chat.send-button" defaultMessage="Gửi" />
                </button>
            </div>
        </div>
    );
};

export default Input;
