import useAxiosPrivate from "hooks/useAxiosPrivate";
import { url } from "inspector";
import { useEffect, useState } from "react";
import User from "../../../models/User";
import "./Profile.scss"

const Profile: React.FC = () => {
  const [user, setUser] = useState(new User());
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getUser() {
      try{
        const response = await axiosPrivate.get("users/find", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,})
        if(response.status === 200) setUser(response.data);
      } catch(err){
        console.log(err);
      }
    }
    getUser()
  }, [])

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar" style={{backgroundImage: `url("${user.avatarUrl || "https://raw.githubusercontent.com/mwisniewski00/Chess/main/client/public/logo512.png"}")`}}></div>
          <div className="profile-name">
            {user.username}
          </div>
          <a className="profile-edit">Edit</a>
        </div>
        <div className="profile-statistics"></div>
        <div className="profile-game-history"></div>
      </div>
    </div>
  )
}

export default Profile;