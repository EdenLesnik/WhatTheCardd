/* eslint-disable tailwindcss/classnames-order */
import { useSelector } from "react-redux";
import { TRootState } from "../../Store/BigPie";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegAddressCard, FaChartLine } from "react-icons/fa";

const Profile = () => {
  const user = useSelector((state: TRootState) => state.UserSlice.user);
  const cardsOpened = 25; // Example: Fetch or calculate dynamically

  if (!user) return <p>Loading...</p>;

  const { name, phone, email, image, address, isAdmin, isBusiness } = user;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="mt-10 text-4xl font-bold tracking-wide text-gray-800 dark:text-green-300 mt-10">
        Profile Overview
      </h1>

      <div
        className="mt-10 mb-10 flex flex-col items-center gap-8 w-4/5 md:w-2/5 m-auto p-8 rounded-xl shadow-xl 
                   transition-all duration-500 bg-white dark:bg-gray-800 dark:ring-2 dark:ring-green-400"
      >
        {/* Profile Picture */}
        <img
          src={image.url}
          alt={image.alt || "User Avatar"}
          className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-green-300"
        />

        {/* User Name */}
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-green-300">
          {name.first} {name.middle} {name.last}
        </h2>

        {/* Contact Information */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-green-300">
            <FaEnvelope className="text-green-400" /> 
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-green-300">
            <FaPhone className="text-green-400" /> 
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-green-300">
            <FaMapMarkerAlt className="text-green-400" /> 
            <span>{`${address.street} ${address.houseNumber}, ${address.city}, ${address.state}, ${address.country} - ${address.zip}`}</span>
          </div>
        </div>

        {/* Account Information */}
        <div className="w-full mt-4">
          <h3 className="text-2xl font-medium text-gray-800 dark:text-green-300 mb-2">
            Account Details
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-lg text-gray-600 dark:text-green-300">
            <div className="flex items-center gap-2">
              <span className="font-medium">Role:</span> 
              {isAdmin ? "Administrator" : "Regular User"}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Account Type:</span> 
              {isBusiness ? "Business" : "Personal"}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full mt-6">
          <h3 className="text-2xl font-medium text-gray-800 dark:text-green-300 mb-2">
            User Stats
          </h3>
          <div className="flex flex-col md:flex-row justify-around gap-6 mt-4">
            <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-green-300">
              <FaRegAddressCard className="text-green-300" size={24} />
              <span>Cards Opened: {cardsOpened}</span>
            </div>
            <div className="flex items-center gap-3 text-lg text-gray-600 dark:text-green-300">
              <FaChartLine className="text-green-300" size={24} />
              <span>Active Since: {new Date().getFullYear() - 1} Year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Push Fix */}
      <div className="mt-auto"></div>
    </div>
  );
};

export default Profile;
