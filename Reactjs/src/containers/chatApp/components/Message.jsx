import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import moment from "moment"; // Import momentjs
import 'moment/locale/vi'; 


const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);



  const formatMessageTime = (seconds) => {
    if (!seconds) return ''; 

   
    const messageTime = moment.unix(seconds); 

   
    if (moment().isSame(messageTime, 'day')) {
     
      return messageTime.format('HH:mm');
    } else if (moment().subtract(1, 'days').isSame(messageTime, 'day')) {
      
      return messageTime.calendar(null, {
        sameDay: '[Hôm nay] HH:mm', 
        nextDay: '[Ngày mai] HH:mm', 
        nextWeek: 'dddd HH:mm', 
        lastDay: '[Hôm qua] HH:mm', 
        lastWeek: 'dddd HH:mm', 
        sameElse: 'DD/MM/YYYY HH:mm' 
      });
    } else if (moment().diff(messageTime, 'days') < 7) {
        
        return messageTime.format('dddd HH:mm'); 
    } else {
      
      return messageTime.format('DD/MM/YYYY HH:mm');
    }
  };


  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        {/* Gọi hàm định dạng thời gian */}
        <span>{formatMessageTime(message.date?.seconds)}</span> 
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
