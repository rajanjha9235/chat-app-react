// Global State Management tool for User

import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./index";

export const useUserStore = create((set) => ({
    currentUser : null,
    isLoading : true,
    fetchUserInfo : async(uid) =>{
        // When uid is not present
        if (!uid) return set({currentUser : null, isLoading : false});

        try{
            const dockRef = doc(db,"users",uid); // Get the reference of the users collection
            const docSnap = await getDoc(dockRef); // Get the document snapshot

            if(docSnap.exists()){
                set({currentUser : docSnap.data(), isLoading : false});
            }
            else{
                set({currentUser : null, isLoading : false});
            }
        }catch(err){
            console.log(err);
            return set({currentUser : null, isLoading : false});
        }
    }
}));