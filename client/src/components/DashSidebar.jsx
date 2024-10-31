import {Sidebar} from 'flowbite-react'
import {HiUser, HiArrowSmRight} from 'react-icons/hi'
import { RxDashboard } from "react-icons/rx";
import { useEffect, useState } from 'react';
import {Link, useLocation} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {signoutSuccess} from '../redux/user/userSlice';
import { MdOutlineInventory } from "react-icons/md";
import { AiFillNotification } from "react-icons/ai";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();
 

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  });

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/signout', {
        method: 'POST',
      })

      const data = res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={'/dashboard?tab=overview'}>
            <Sidebar.Item
              active={tab === 'overview'}
              icon={RxDashboard}
              as='div'
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to={'/dashboard?tab=tag-info'}>
            <Sidebar.Item
              active={tab === 'tag-info'}
              icon={MdOutlineInventory}
              as='div'
            >
              UID
            </Sidebar.Item>
          </Link>
          <Link to={'/dashboard?tab=notification'}>
            <Sidebar.Item
              active={tab === 'notification'}
              icon={AiFillNotification}
              as='div'
            >
              
              <div className="flex justify-between">
                Notification
                <span className='rounded-full bg-red-600 w-6 text-center text-white'></span>
              </div>
              
            </Sidebar.Item>
          </Link>
          <Link to={'/dashboard?tab=profile'}>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={'User'}
              labelColor = 'dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' as='div' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
