import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashComponents from "../components/DashComponents";
import DashSidebar from "../components/DashSidebar"
import TagInformation from "../components/TagInformation";
import Notifications from "../components/Notifications";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      {tab === 'profile' && <DashProfile/>}
      {tab === 'overview' && <DashComponents/>}
      {tab === 'tag-info' && <TagInformation/>}
      {tab === 'notification' && <Notifications/>}

    </div>
  );
}
