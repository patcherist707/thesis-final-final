import { Button, Navbar, Avatar, Dropdown} from "flowbite-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { AiFillNotification } from "react-icons/ai";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import NotificationBell from "./subdashComp/NotificationBell.jsx";
import { FaHistory } from "react-icons/fa";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user);
  const handleSignout = async () => {
    try {
      const res = await fetch('/api/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className="sticky top-0 z-10">
      <Navbar className="border-b-2">
        <div>
          <Link to={'/'} className="flex flex-row mr-0 pr-0">
            <img className="h-15 w-20 pt-0" src="/logo1.png"/>
            <div className="flex flex-col">
              <span className="block text-[14px] font-medium truncate mb-[-5px] mt-[5px]">Warehouse</span>
              <span className="block text-[14px] font-medium truncate mb-[-5px]">Management</span>
              <span className="block text-[14px] font-medium truncate">System</span>
            </div>
          </Link>
        </div>
        
        <div className="flex gap-8 md:order-2 items-center">
        <div>
          <NotificationBell/>
        </div>
          {currentUser ? (
            <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded/>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=overview'}>
              <Dropdown.Item icon={RxDashboard}>
                Dashboard
              </Dropdown.Item>
            </Link>
            {/* <Link to={'/dashboard?tab=tag-info'}>
              <Dropdown.Item icon={MdOutlineInventory}>
                UID
              </Dropdown.Item>
            </Link> */}
            <Link to={'/dashboard?tab=history'}>
              <Dropdown.Item icon={FaHistory}>
                History
              </Dropdown.Item>
            </Link>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item icon={HiUser}>
                Profile
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider/>
            <Dropdown.Item icon={HiArrowSmRight} className='cursor-pointer'
            onClick={handleSignout}>
              Sign Out
            </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
              <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
              </Button>
            </Link>
          )}
          
          <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === '/'} as={'div'} >
            <Link to='/'>
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link as={'div'} active={path === '/about'}>
            <Link to='/about'>
              About
            </Link>
          </Navbar.Link>
          <Navbar.Link as={'div'} active={path === '/feedback'}>
            <Link to='/feedback'>
              Feedback
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
