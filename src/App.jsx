import { useEffect } from "react";
import { Chat,Detail,List,Login,Notification } from "./components";

import { onAuthStateChanged } from "firebase/auth";
import { auth,useChatStore,useUserStore } from "./lib";

function App() {

  const {currentUser,isLoading,fetchUserInfo } = useUserStore(); // Get the user information from the store
  const {chatId} = useChatStore();

  useEffect(()=> {
    const unSub = onAuthStateChanged(auth,(user)=>{
      fetchUserInfo(user?.uid);
    })
    return () => unSub();
  },[fetchUserInfo])


  if(isLoading) return <div className="loading">Loading...</div>  // Show Loading
  
  return (
    <div className="container">
      {
        currentUser ? ( 
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : ( 
          <Login />
        )
      }
      <Notification /> 
    </div>
  )
}

export default App
