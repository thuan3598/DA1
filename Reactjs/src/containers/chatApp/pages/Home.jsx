import React, { useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom"; 
const ChatAppHome = () => { 
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    
    if (!currentUser) {
      history.replace("/chat-app/login");
    }
  }, [currentUser, history]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className='home'> 
      <div className="container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  );
};

export default ChatAppHome;