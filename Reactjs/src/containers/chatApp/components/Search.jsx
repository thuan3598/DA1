import React, { useContext, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    updateDoc,
    serverTimestamp,
    getDoc,
    // Add Firestore compound query for OR logic - NOT DIRECTLY SUPPORTED, must query separately
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../utils';

const Search = () => {
    const [username, setUsername] = useState("");
    const [foundUsers, setFoundUsers] = useState([]); 
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const language = useSelector(state => state.app.language);

    const handleSearch = async () => {
        setFoundUsers([]); 
        setErr(false); 

        if (username.trim() === "") {
            return; 
        }

        try {
            const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid));
            const currentUserRole = currentUserDoc.data().role;
            const targetRole = currentUserRole === "R2" ? "R3" : "R2"; 

            const usersRef = collection(db, "users");

            
            const qDisplayName = query(
                usersRef,
                where("displayName", "==", username.trim()),
                where("role", "==", targetRole)
            );
            const snapshotDisplayName = await getDocs(qDisplayName);

           
            const qEmail = query(
                usersRef,
                where("email", "==", username.trim()),
                where("role", "==", targetRole)
            );
            const snapshotEmail = await getDocs(qEmail);

            const combinedResults = new Map(); 

            snapshotDisplayName.forEach((doc) => {
                const userData = doc.data();
                if (userData.uid !== currentUser.uid) { 
                    combinedResults.set(userData.uid, userData);
                }
            });

            snapshotEmail.forEach((doc) => {
                const userData = doc.data();
                if (userData.uid !== currentUser.uid) { 
                    combinedResults.set(userData.uid, userData); 
                }
            });

            const resultsArray = Array.from(combinedResults.values()); 

            if (resultsArray.length === 0) {
                setErr(true);
            } else {
                setFoundUsers(resultsArray); 
                setErr(false);
            }
        } catch (err) {
            console.error("Error during search:", err);
            setErr(true);
            setFoundUsers([]); 
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

   
    const handleSelect = async (selectedUser) => {
        const combinedId =
            currentUser.uid > selectedUser.uid
                ? currentUser.uid + selectedUser.uid
                : selectedUser.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: selectedUser.uid,
                        displayName: selectedUser.displayName,
                        photoURL: selectedUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", selectedUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }
        } catch (err) {
            console.error("Error during chat selection:", err);
        }

        setFoundUsers([]); 
        setUsername(""); 
    };

    return (
        <div className="search">
            <div className="searchForm">
                <input
                    type="text"
                    placeholder={language === LANGUAGES.VI ? "Tìm kiếm người dùng..." : "Find a user"}
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {err && <span><FormattedMessage id="chat.user-not-found" defaultMessage="Không tìm thấy người dùng!" /></span>}

            
            {foundUsers.length > 0 && (
                <div className="search-results">
                    {foundUsers.map(userItem => (
                        <div className="userChat" key={userItem.uid} onClick={() => handleSelect(userItem)}>
                            <img src={userItem.photoURL || 'https://via.placeholder.com/50'} alt="" />  
                            <div className="userChatInfo">
                                <span>{userItem.displayName}</span>
                                <p>{userItem.email}</p> 
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
