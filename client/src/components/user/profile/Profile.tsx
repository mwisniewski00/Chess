import useAxiosPrivate from "hooks/useAxiosPrivate";
import axios from "api/axios";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import IUser from "../../../models/IUser";
import "./Profile.scss"
import useUserModal from "hooks/useUserModal";
import {EditUserModal} from "../modals/edit/EditUserModal";
import { useNavigate } from "react-router-dom";


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
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ div: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const Profile: React.FC = () => {
  const [user, setUser] = useState({} as IUser);
  const [value, setValue] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const { isOpen, setIsOpen } = useUserModal();
  const navigate = useNavigate();

  

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getUser() {
      try{
        const username = window.location.pathname.slice(9)
        const response = await axios.get(`users/profile/${username}`)
        if(response.status === 200) setUser(response.data);
      } catch(err){
        navigate("/home");
      }
    }
    getUser()
  }, [])

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-header profile-box">
          <div className="profile-avatar" style={{backgroundImage: `url("${user.avatarUrl || "https://raw.githubusercontent.com/mwisniewski00/Chess/main/client/public/logo512.png"}")`}}></div>
          <div className="profile-details">
            <div className="profile-name"> {user.username} </div>
            <div className="profile-title"> Grand Master </div>
          </div>
          <div onClick={() => setIsOpen(true)} className="profile-edit"> Edit </div>
        </div>

        <div className="profile-section profile-box">
          <div className="profile-tabs-menu">
            <Tabs 
            value={value} 
            onChange={handleChange} 
            textColor="inherit"
            indicatorColor="primary"
            centered 
            variant="fullWidth">
              <Tab label="Description" {...a11yProps(0)} />
              <Tab label="Statistics" {...a11yProps(1)} />
              <Tab label="Game History" {...a11yProps(2)} />
            </Tabs>
          </div>
          <TabPanel value={value} index={0}>
            <p className="profile-description"> {user.description} </p>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className="profile-statistics"></div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="profile-game-history"></div>
          </TabPanel>
        </div>
    
      </div>

      <EditUserModal isOpen={isOpen} setIsOpen={setIsOpen} userData={user}/>

    </div>
  )
}

export default Profile;
