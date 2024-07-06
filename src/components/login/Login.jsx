import { useState } from "react"
import "./login.css"
import { toast } from "react-toastify" // For the notification
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { setDoc,doc } from "firebase/firestore"
import { auth,db, upload } from "../../lib";

export default function Login() {
    // When user uploads an image for Sign Up
    const [avatar,setAvatar] = useState({
        file: null,
        url : ""
    });

    const [loading,setLoading] = useState(false);

    // Function to handle the avatar --> This function will be called when the user selects an image
    const handleAvatar = (e) => {
        if (e.target.files[0]){

            setAvatar({
                file : e.target.files[0],
                url : URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const {email,password} = Object.fromEntries(formData); // From the form

        try{
            await signInWithEmailAndPassword(auth,email,password);
        }catch(err){
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    }

    // Function to handle the registration of the user --> This function will be called when the user submits the form for Sign Up
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);

        const {username,email,password} = Object.fromEntries(formData);

        try{
            const res = await createUserWithEmailAndPassword(auth,email,password);

            const imgUrl = await upload(avatar.file);

            await setDoc(doc(db,"users",res.user.uid),{
                username,
                email,
                avatar : imgUrl,
                id : res.user.uid,
                blocked : []
            })

            await setDoc(doc(db,"userchats",res.user.uid),{
                chats : []
            })

            toast.success("User Created Successfully");
        }catch(err){
            toast.error(err.message);
        }finally{
            setLoading(false);
        }
    }
    
    return (
        <div className="login">
            <div className="item">
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="E-mail" name="email"></input>
                    <input type="password" placeholder="Password" name="password"></input>
                    <button disabled={loading}>{loading ? "Loading": "Log in"}</button>
                </form>
            </div>
            
            <div className="separator"></div>

            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                    Upload an Image
                    </label>
                    <input type="file"  id="file" style={{display:"none"}} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username"/>
                    <input type="email" placeholder="Enter your E-mail" name="email"></input>
                    <input type="password" placeholder="Password" name="password"></input>
                    <button disabled={loading} >{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}