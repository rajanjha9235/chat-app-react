import "./list.css"
import {ChatList,UserInfo} from "../index";

function List(){

    return(
        <div className="list">
            <UserInfo/>
            <ChatList/>
        </div>
    )
}

export default List;