import { useState } from "react";
import "./addUser.css"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db,useUserStore } from "../../../../lib";

export default function AddUser() {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();


    // It runs when clicked on search button
    const handleSearch = async e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username"); // get username from the input field

        try {
            // Create a reference to the cities collection
            const userRef = collection(db, "users");

            // Create a query against the collection.
            const q = query(userRef, where("username", "==", username));

            const querySnaphot = await getDocs(q);

            if (!querySnaphot.empty) {
                setUser(querySnaphot.docs[0].data()) // set the user
            }
        } catch (error) {
            console.log("Error on Search User :: ",error);
        }
    }

    // It runs when click on Add User button
    const handleAdd = async e => {
        const chatRef = collection(db, "chats");
        const userChatRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);

            // Create a new Document
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: []
            });

            // Update in userchats for the user
            await updateDoc(doc(userChatRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                }),
            });

            // Update in userchats for the currentUser
            await updateDoc(doc(userChatRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                }),
            });

        } catch (error) {
            console.log("Error on Add User :: ",error);
        }
    }

    return (
        <div className="addUser">
            <form onSubmit={handleSearch} >
                <input type="text" placeholder="Username" name="username" />
                <button> Search </button>
            </form>

            {user && <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    )
}