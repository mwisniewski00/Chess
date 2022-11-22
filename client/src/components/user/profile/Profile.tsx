import { url } from "inspector";
import "./Profile.scss"

const Profile: React.FC = () => {
  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar" style={{backgroundImage: 'url("https://cdn.dribbble.com/users/1078367/screenshots/7128092/c_for_chess_logo-100_4x.jpg")'}}></div>
          <div className="profile-name">
            Admin
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