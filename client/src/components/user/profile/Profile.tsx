import "./Profile.scss";
import axios from "api/axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useEffect, useState } from "react";
import IUser from "../../../models/IUser";
import { EditDescriptionModal } from "../modals/edit/description/EditDescriptionModal";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import useAuth from "hooks/useAuth";
import EditAvatarUrlModal from "../modals/edit/avatarUrl/EditAvatarUrlModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="profile-tab-content"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function calculateTime(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const timeSince = now.getTime() - date.getTime();
  if (timeSince < 60000) {
    // Less than a minute
    return `${Math.round(timeSince / 1000)} seconds`;
  }
  if (timeSince < 3600000) {
    // Less than an hour
    return `${Math.round(timeSince / 60000)} minutes`;
  }
  if (timeSince < 86400000) {
    // Less than a day
    return `${Math.round(timeSince / 3600000)} hours`;
  }
  if (timeSince < 2592000000) {
    // Less than a month
    return `${Math.round(timeSince / 86400000)} days`;
  }
  return `${Math.round(timeSince / 2592000000)} months`;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState({} as IUser);
  const [value, setValue] = useState(0);
  const [isOpenDescription, setIsOpenDescription] = useState(false);
  const [isOpenAvatar, setIsOpenAvatar] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth().auth;
  const loggedInUser = auth.username;
  const username = window.location.pathname.slice(9);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(`users/profile/${username}`);
        if (response.status === 200) setUser(response.data);
      } catch (err) {
        navigate("/home");
      }
    }
    getUser();
  }, [navigate, username]);

  function descriptionEdit() {
    if (username === loggedInUser) {
      return (
        <div
          onClick={() => setIsOpenDescription(true)}
          className="description-edit"
        >
          <EditIcon className="icon" />
        </div>
      );
    }
  }

  function avatar() {
    if (username === loggedInUser) {
      return (
        <div
          className="profile-avatar hover"
          onClick={() => setIsOpenAvatar(true)}
          style={{
            backgroundImage: `url("${
              user.avatarUrl ||
              "https://raw.githubusercontent.com/mwisniewski00/Chess/main/client/public/logo512.png"
            }")`,
          }}
        ></div>
      );
    } else {
      <div
        className="profile-avatar"
        style={{
          backgroundImage: `url("${
            user.avatarUrl ||
            "https://raw.githubusercontent.com/mwisniewski00/Chess/main/client/public/logo512.png"
          }")`,
        }}
      ></div>;
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-header profile-box">
          {avatar()}
          <div className="profile-details">
            <div className="profile-name"> {user.username} </div>
            <div className="profile-status-bar">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <AccessAlarmIcon className="icon" />
                    </td>
                    <td>
                      <CalendarMonthIcon className="icon" />
                    </td>
                    <td>
                      <ScoreboardIcon className="icon" />
                    </td>
                  </tr>
                  <tr>
                    <td>{calculateTime(user.lastLoginDate)}</td>
                    <td>{calculateTime(user.registrationDate)}</td>
                    <td>{user.rating ? Math.floor(user.rating) : "unknown"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="profile-section profile-box">
          <div className="profile-tabs-menu">
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit"
              indicatorColor="primary"
              centered
              variant="fullWidth"
            >
              <Tab label="Description" {...a11yProps(0)} />
              <Tab label="Statistics" {...a11yProps(1)} />
              <Tab label="Game History" {...a11yProps(2)} />
            </Tabs>
          </div>
          <TabPanel value={value} index={0}>
            {user.description} {descriptionEdit()}
          </TabPanel>
          <TabPanel value={value} index={1}></TabPanel>
          <TabPanel value={value} index={2}></TabPanel>
        </div>
      </div>

      <EditDescriptionModal
        isOpen={isOpenDescription}
        setIsOpen={setIsOpenDescription}
        userData={user}
      />

      <EditAvatarUrlModal
        isOpen={isOpenAvatar}
        setIsOpen={setIsOpenAvatar}
        userData={user}
      />
    </div>
  );
};

export default Profile;
