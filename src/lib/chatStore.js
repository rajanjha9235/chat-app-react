// Global state Management store for Chats

import { create } from "zustand"; // Global State Management
import {useUserStore} from "./index";

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    
    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser;

        // Check if current user is blocked by receiver
        if (user.blocked.includes(currentUser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isReceiverBlocked: false,
            })
        }
        // Check if Receiver is blocked
        else if (currentUser.blocked.includes(user.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: false,
                isReceiverBlocked: true,
            })
        }
        else{
            return set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isReceiverBlocked: false,
            })
        }
    },

    changeBlock : ()=>{
        set(state => ({...state,isReceiverBlocked:!state.isReceiverBlocked}))
    }
}));