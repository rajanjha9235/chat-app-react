import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import {auth,useChatStore,useUserStore,db} from "../../lib";
import "./detail.css"

function Detail(){
    const {currentUser} = useUserStore();
    const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();

    // It runs when clicked on Block button
    const handleBlock = async() => {
        if (!user) return;

        const userDocRef = doc(db,"users",currentUser.id); // Reference of this user

        try {
            // If it's blocked --> UnBlock it or  if not blocked --> Block it
            await updateDoc(userDocRef,{
                blocked : isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();  // Update the block status on store
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="detail">
            <div className="user">
                <img src={user.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>Lorem ipsum dolor sit amet.</p>
            </div>

            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>

                    <div className="photos">

                        <div className="photo-item">
                            <div className="photo-detail">
                                <img src="https://images.pexels.com/photos/1112377/pexels-photo-1112377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                                <span>photo_2024_2.png</span>
                            </div>
                            <img src="./download.png" alt="" className="icon" />
                        </div>


                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <button onClick={handleBlock}>
                    {isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}
                </button>
                <button className="log-out" onClick={() => auth.signOut()}>Log Out</button>
            </div>
        </div>
    )
}

export default Detail;