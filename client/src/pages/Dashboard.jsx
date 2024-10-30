import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";

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
      {tab === 'profile' && <DashProfile/>}
    </div>
  );
}
