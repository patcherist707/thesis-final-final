import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashComponents from "../components/DashComponents";
import DashSidebar from "../components/DashSidebar"
import TagInformation from "../components/TagInformation";
import History from "../components/History";
import { useSelector } from "react-redux";
import io from 'socket.io-client';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const { currentUser, err } = useSelector((state) => state.user);

  const socket = io('http://localhost:3000');
  const uid = currentUser._id;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  });

  useEffect(() => {
    
    
  }, [uid]);

  

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className='w-full lg:w-96 bg-white shadow z-20'>
        <DashSidebar />
      </div>
      {tab === 'profile' && <DashProfile/>}
      {tab === 'overview' && <DashComponents/>}
      {tab === 'tag-info' && <TagInformation/>}
      {tab === 'history' && <History/>}

    </div>
  );
}
