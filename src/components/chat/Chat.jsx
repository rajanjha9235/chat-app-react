import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

import { upload,db,useChatStore,useUserStore } from "../../lib";

function Chat() {
    const [open, setOpen] = useState(false); // To keep track of emoji eomji component open or not
    const [text, setText] = useState(""); // Text to send
    const [chat, setChat] = useState();

    // For the image that user selects to send
    const [img, setImg] = useState({
        file: null,
        url: "",
    })

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const { currentUser } = useUserStore();

    const endRef = useRef(null);

    // Scroll to last message when loading for first time
    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });
        return () => unSub();
    }, [chatId]);

    //console.log(chat);

    // It runs when user selects an emoji
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };


    // It runs when user selects an image to send
    const handleImg = (e) => {
        if (e.target.files[0]) {

            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }


    // It runs when user press send button
    const handleSend = async () => {
        if (text === "") return; // Text is null --> Do nothing

        let imgUrl = null;

        try {
            if (img.file) {
                // When user selects an img --> Upload it on Storage
                imgUrl = await upload(img.file);
            }
            // Update the message on database
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                })
            });

            const userIds = [currentUser.id, user.id];

            // To update the lastMessage, seen, updatedAt
            userIds.forEach(async (id) => {

                const userChatRef = doc(db, "userchats", id); // Reference of document
                const userChatSnapshot = await getDoc(userChatRef);

                if (userChatSnapshot.exists()) {
                    const userChatData = userChatSnapshot.data();

                    const chatIndex = userChatData.chats.findIndex(
                        (c) => c.chatId === chatId
                    )

                    userChatData.chats[chatIndex].lastMessage = text;
                    userChatData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatRef, {
                        chats: userChatData.chats,
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }

        // Set the img and text as nul
        setImg({
            file: null,
            url: "",
        });
        setText("");
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <div className="text">
                        <span>JAne Doe</span>
                        <p>Lorem ipsum dolor sit, amet</p>
                    </div>
                </div>

                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>

            </div>

            <div className="center">
                {chat?.messages?.map((message) => (

                    <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message?.createdAt}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            <span>1 min ago</span>
                        </div>
                    </div>
                ))
                }
                {img.url && <div className="message own">
                    <div className="texts">
                        <img src={img.url} alt="" />
                    </div>
                </div>}
                <div ref={endRef}></div>
            </div>



            <div className="bottom">
                <div className="icons">

                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{ display: "none" }}
                        onChange={handleImg} />

                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>

                <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send message" : "Type a message..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked} />

                <div className="emoji">
                    <img src="./emoji.png" alt=""
                        onClick={() => setOpen(!open)} />

                    <div className="picker">
                        <EmojiPicker open={open}
                            onEmojiClick={handleEmoji} />
                    </div>
                </div>

                <button className="send-button" onClick={handleSend}
                disabled={isCurrentUserBlocked || isReceiverBlocked}
                >Send</button>
            </div>
        </div>
    )
}

export default Chat;