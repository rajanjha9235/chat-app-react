import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
    currentUser : null,
    isLoading : true,
    fetchUserInfo : async(uid) =>{
        if (!uid) return set({currentUser : null, isLoading : false});

        try{
            const dockRef = doc(db,"users",uid);
            const docSnap = await getDoc(dockRef);

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