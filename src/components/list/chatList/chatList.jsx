import "./chatList.css";
import {useState} from "react";
function ChatList(){
    const [addMode, setAddMode] = useState(false);

    return(
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="/search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img src={addMode ? "./minus.png" : "./plus.png"} 
                onClick={() => setAddMode(!addMode)}
                alt="" className="add" />
            </div>

            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="texts">
                    <span>Jane Does</span>
                    <p>Hello</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="texts">
                    <span>Jane Does</span>
                    <p>Hello</p>
                </div>
            </div>

            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="texts">
                    <span>Jane Does</span>
                    <p>Hello</p>
                </div>
            </div>
        </div>
    )
}
export default ChatList;