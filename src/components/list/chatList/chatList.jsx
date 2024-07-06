import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import "./chatList.css";
import { useEffect, useState } from "react";
import {AddUser} from "../../index"
import { db,useChatStore , useUserStore} from "../../../lib";

function ChatList() {
    const [addMode, setAddMode] = useState(false);  // To add a new user

    const [chats, setChats] = useState([]); // It includes both users db and userchats db chats[].element
    /* 
    chats = [
        user : {avatar,blocked[],email,id,username}, --> From users db
        chatId,
        isSeen,
        lastMessage,
        receiverId,
        updatedAt
    ]
    */

    const [input,setInput] = useState("");  // Search for user chats

    const { currentUser } = useUserStore(); // Current Logged in User from the store
    const { changeChat } = useChatStore();

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;  // chats array of userchats db

            const promise = items.map(async (item) => {
                const userDockRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDockRef);

                const user = userDocSnap.data(); // user object from users db

                return { ...item, user }; // includes both users db and userchats.chats[].element
            })

            const chatData = await Promise.all(promise);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => unsub();
    }, [currentUser.id]);


    // It runs when we select an chat
    const handleSelect = async (chat) => {
        // Extract only userchats elements
        const userChats = chats.map((item) => {
            const {user,...rest} = item;
            return rest;
        });

        const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
        userChats[chatIndex].isSeen = true; // Mark it seen

        const userChatsRef = doc(db,"userchats",currentUser.id);

        try {
            // Update it in database
            await updateDoc(userChatsRef,{
                chats : userChats,
            });
            changeChat(chat.chatId, chat.user); // Update the store
        } catch (error) {
            console.log(error);
        }
    }

    const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(input.toLowerCase()));

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt="" />
                    <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)} />
                </div>
                <img src={addMode ? "./minus.png" : "./plus.png"}
                    onClick={() => setAddMode(!addMode)}
                    alt="" className="add" />
            </div>

            {filteredChats.map((chat) => (

                <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}
                    style={{ backgroundColor: chat?.isSeen ? "transparent" : "#2e822778" }} >

                    <img src={chat.user.blocked.includes(currentUser.id) 
                      ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="" />
                    
                    <div className="texts">
                        <span>{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}

            {addMode && <AddUser />}
        </div>
    )
}
export default ChatList;