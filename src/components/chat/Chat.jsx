import EmojiPicker from "emoji-picker-react";
import "./chat.css"
import { useEffect, useRef, useState } from "react";

function Chat(){
    const [open,setOpen] = useState(false);
    const [text,setText] = useState("");

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({behavior: "smooth"});
    },[])

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    }

    return(
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src="./avatar.png" alt="" />
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

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere et fugit quidem laboriosam quibusdam maiores, veritatis rerum magnam aperiam iure, suscipit nulla, modi quia sequi possimus numquam adipisci porro aliquid!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <img src="https://images.pexels.com/photos/25742728/pexels-photo-25742728/free-photo-of-wind-turbines-on-the-coast-of-lanzarote.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere et fugit quidem laboriosam quibusdam maiores, veritatis rerum magnam aperiam iure, suscipit nulla, modi quia sequi possimus numquam adipisci porro aliquid!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere et fugit quidem laboriosam quibusdam maiores, veritatis rerum magnam aperiam iure, suscipit nulla, modi quia sequi possimus numquam adipisci porro aliquid!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere et fugit quidem laboriosam quibusdam maiores, veritatis rerum magnam aperiam iure, suscipit nulla, modi quia sequi possimus numquam adipisci porro aliquid!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message">
                    <img src="./avatar.png" alt="" />
                    <div className="texts">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere et fugit quidem laboriosam quibusdam maiores, veritatis rerum magnam aperiam iure, suscipit nulla, modi quia sequi possimus numquam adipisci porro aliquid!</p>
                        <span>1 min ago</span>
                    </div>
                </div>

                <div className="message own">
                    <div className="texts">
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere et fugit quidem laboriosam quibusdam maiores, veritatis rerum magnam aperiam iure, suscipit nulla, modi quia sequi possimus numquam adipisci porro aliquid!</p>
                        <span>1 min ago</span>
                    </div>

                    <div ref={endRef}></div>
                </div>

            </div>


            <div className="bottom">
                <div className="icons">
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>

                <input type="text" placeholder="Type a message..." 
                value={text}
                onChange={(e) => setText(e.target.value)}/>

                <div className="emoji">
                    <img src="./emoji.png" alt=""
                    onClick={() => setOpen(!open)} />

                    <div className="picker">
                        <EmojiPicker open={open} 
                        onEmojiClick={handleEmoji} />
                    </div>
                </div>

                <button className="send-button">Send</button>
            </div>
        </div>
    )
}

export default Chat;