import React from "react";
import {
  Button,
  Navbar,
  TextInput,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Dropdown,
  DropdownHeader,
  Avatar,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import { Link, useLocation } from "react-router";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { toast } from "react-toastify";
import axios from 'axios'
import {
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";


const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { error } = useSelector((state) => state.user);
  const path = useLocation().pathname;
  const handleSignOut = async () => {
    try {
      dispatch(signoutStart());
      const response = await axios.get('/api/user/logout');
      if (response.data.success) {
        dispatch(signoutSuccess());
      }
      else {
        dispatch(signoutFailure(response.data.message))
      }
    } catch (err) {
      dispatch(signoutFailure(err.message))
      toast.error(error.message);
    }
  };

  return (
    <Navbar className="border-b-2 ">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white "
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Aditya's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color={"gray"} pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          onClick={() => dispatch(toggleTheme())}
          className="w-12 h-10 hidden sm:inline "
          color={"gray"}
          pill
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>

        {currentUser ? (
          <Dropdown
            dismissOnClick={false}
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="font-medium block text-sm truncate">
                {currentUser.email}
              </span>
            </DropdownHeader>

            <Link to={"/dashboard?tab=profile"}>
              <DropdownItem>Profile</DropdownItem>
            </Link>
            <DropdownDivider />
            <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to={"sign-in"}>
            <Button outline color={"yellow"}>
              Sign In
            </Button>
          </Link>
        )}

        <NavbarToggle />
      </div>
      <NavbarCollapse className="order-1">
        <NavbarLink active={path === "/"} as={"div"}>
          <Link to={"/"} className="text-white">
            Home
          </Link>
        </NavbarLink>

        <NavbarLink active={path === "/about"} as={"div"}>
          <Link to={"/about"} className="text-white">
            About
          </Link>
        </NavbarLink>

        <NavbarLink active={path === "/projects"} as={"div"}>
          <Link to={"/projects"} className="text-white">
            Projects{" "}
          </Link>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
