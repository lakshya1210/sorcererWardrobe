import React from "react";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '../../redux/userSlice'

function Header() {
  const {currentUser} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const location = useLocation()
  
  const getLinkClass = (path) => {
    return location.pathname === path ? 'text-teal-500' : ''
  }


  const handleSignout = async() => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST"
      })
      const data = await res.json()
      if(res.ok){
        dispatch(signOut())
      }
      else{
        return toast.error(data.msg)
      }

    } catch (error) {
      return toast.error(error.message)
    }
  }

  return (
    <Navbar fluid rounded>
      <Link to={'/'} className="text-base sm:text-xl whitespace-nowrap font-semibold">
        <span className="p-1 text-blue-600 rounded-lg font-serif">
          Sorcerer's Wardrobe
        </span>
      </Link>

      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block ">@{currentUser.username}</span>
              <span className="block font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Link to={"/cart"}>
              <Dropdown.Item>Cart</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/signin"}>
            <Button outline gradientDuoTone="pinkToOrange">
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Link to="/"  className={`hover:text-teal-500 ${getLinkClass('/')}`}>
          Home
        </Link>
        <Link to="/collections/Men" className={`hover:text-teal-500 ${getLinkClass('/collections/Men')}`}>Men's</Link>
        <Link to="/collections/Women" className={`hover:text-teal-500 ${getLinkClass('/collections/Women')}`}>Women's</Link>
        <Link to="/collections/Footwear" className={`hover:text-teal-500 ${getLinkClass('/collections/Footwear')}`}>About Us</Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
