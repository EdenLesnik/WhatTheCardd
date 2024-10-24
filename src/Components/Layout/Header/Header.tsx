import {
  DarkThemeToggle,
  Navbar,
  TextInput,
  Avatar,
  Dropdown,
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { TRootState } from "../../../Store/BigPie";
import { userActions } from "../../../Store/UserSlice";
import { CiSearch } from "react-icons/ci";
import { searchActions } from "../../../Store/SearchSlice";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

const Header = () => {
  const user = useSelector((state: TRootState) => state.UserSlice.user);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const logout = () => {
    dispatch(userActions.logout());
    nav("/");
  };
  const crm = () => {
    nav("/crm");
  };
  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(searchActions.searchWord(value));
  };

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: "ease-in-out", 
      once: false, 
    });
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <Navbar
      fluid
      rounded
      className="bg-white dark:bg-black transition-all duration-300"
    >
      {/* Brand */}
      <Navbar.Brand as={Link} to="/">
        <span className="self-center text-xl font-extrabold text-black whitespace-nowrap dark:text-green-300">
          What The Card
        </span>
      </Navbar.Brand>

      <Navbar.Toggle />

      {/* Main Links */}
      <Navbar.Collapse>
        <Navbar.Link
          as={Link}
          to="/"
          className="text-black hover:scale-105 hover:text-green-300 transition-transform duration-300"
        >
          Home
        </Navbar.Link>

        <Navbar.Link
          as={Link}
          to="/about"
          className="text-black hover:scale-105 hover:text-green-300 transition-transform duration-300"
        >
          About
        </Navbar.Link>

        {!user && (
          <>
            <Navbar.Link
              as={Link}
              to="/signin"
              className="text-black hover:scale-105 hover:text-green-300 transition-transform duration-300"
            >
              Sign In
            </Navbar.Link>
            <Navbar.Link
              as={Link}
              to="/signup"
              className="text-black hover:scale-105 hover:text-green-300 transition-transform duration-300"
            >
              Sign Up
            </Navbar.Link>
          </>
        )}
        {user && (
          <Navbar.Link
            as={Link}
            to="/profile"
            className="text-black hover:scale-105 hover:text-green-300 transition-transform duration-300"
          >
            Profile
          </Navbar.Link>
        )}
        {user?.isAdmin && (
          <Link
            to="/crm"
            className="text-sm font-medium text-red-600 dark:text-red-300 mr-4"
          >
            CRM
          </Link>
        )}
      </Navbar.Collapse>

      {/* Search Input */}
      <TextInput rightIcon={CiSearch} onChange={search} />

      {/* User Dropdown with Avatar */}
      {user && (
        <div onClick={toggleDropdown}>
          <Dropdown
            arrowIcon={false}
            inline
            placement="bottom-end"
            className={`z-50 awful-dropdown ${
              isDropdownOpen ? "aos-animate" : ""
            }`}
            label={
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  img={user.image.url}
                  alt={user.image.alt || "User Avatar"}
                  rounded
                />
                <span className="text-black dark:text-green-300 font-medium">
                  {user.name.first} {user.name.last}
                </span>
              </div>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-bold">
                {user.name.first} {user.name.middle} {user.name.last}
              </span>
              <span className="block text-sm font-medium text-green-300">
                {user.email}
              </span>
            </Dropdown.Header>

            <Dropdown.Item as={Link} to="/profile">
              Profile
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/favorites">
              Favorites
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/mycards">
              My Cards
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/createcard">
              Create Card
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={logout}
              className="font-bold text-red-500 dark:text-red-400"
            >
              Log Out
            </Dropdown.Item>
            <Dropdown.Item
              onClick={crm}
              className="font-bold text-black-300 dark:text-gray-400"
            >
              CRM
            </Dropdown.Item>
          </Dropdown>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <DarkThemeToggle className="gap-3 max-md:flex max-md:flex-col max-md:items-center" />
    </Navbar>
  );
};

export default Header;
