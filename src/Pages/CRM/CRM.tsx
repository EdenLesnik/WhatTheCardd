import React, { useState, useEffect } from "react";
import axios from "axios";
import { TUser } from "../../Types/TUser";
import { TCard } from "../../Types/TCard";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import UserEditModal from "./UserEditModal"; // Import User Modal
import CardEditModal from "./CardEditModal"; // Import Card Modal
import { useNavigate } from "react-router-dom";
import "./CRM.css";

const ITEMS_PER_PAGE = 20;

const CRM: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Users");
  const [users, setUsers] = useState<TUser[]>([]);
  const [cards, setCards] = useState<TCard[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchCards();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users"
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users.");
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
      );
      setCards(response.data);
    } catch (error) {
      toast.error("Failed to load cards.");
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${userId}`
      );
      toast.success("User deleted successfully.");
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  const handleEditUser = (user: TUser) => {
    setSelectedUser(user);
    setIsUserModalOpen(true); // Open the user modal
  };

  const handleEditCard = (cardId: string) => {
    setSelectedCardId(cardId);
    setIsCardModalOpen(true); // Open the card modal
  };

  const handleUpdateUser = (updatedUser: TUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
    toast.success("User updated successfully.");
  };

  const paginatedData = (data: any[]) =>
    data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalPages = (data: any[]) => Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages(users)) {
      setCurrentPage(page);
    }
  };

  const renderList = (data: any[], type: string) => (
    <ul className="space-y-4">
      {paginatedData(data).map((item) => (
        <li
          key={item._id}
          className="flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg shadow"
        >
          <img
            src={item.image?.url || require("../../Media/IDK.png")}
            alt={item.image?.alt || `${type} Image`}
            className="w-12 h-12 rounded-full"
          />
          <span className="flex-grow dark:text-white">
            {type === "User" || type === "Business"
              ? `${item.name.first} ${item.name.last}`
              : item.title}
          </span>
          <div className="flex space-x-2">
            <button
              className="text-green-300"
              onClick={() =>
                type === "Card" ? handleEditCard(item._id) : handleEditUser(item)
              }
            >
              <FaEdit size={20} />
            </button>
            <button
              className="text-red-500"
              onClick={() => deleteUser(item._id)}
            >
              <FaTrash size={20} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="crm-container flex dark:bg-gray-900 min-h-screen">
      <div className="crm-sidebar bg-gray-500 dark:bg-gray-600 text-white w-1/5 p-4">
        <ul className="space-y-4">
          <li
            className={`cursor-pointer ${
              selectedCategory === "Users" ? "font-bold text-green-300" : ""
            }`}
            onClick={() => setSelectedCategory("Users")}
          >
            Users
          </li>
          <li
            className={`cursor-pointer ${
              selectedCategory === "Business" ? "font-bold text-green-300" : ""
            }`}
            onClick={() => setSelectedCategory("Business")}
          >
            Business
          </li>
          <li
            className={`cursor-pointer ${
              selectedCategory === "Cards" ? "font-bold text-green-300" : ""
            }`}
            onClick={() => setSelectedCategory("Cards")}
          >
            Cards
          </li>
        </ul>
      </div>

      <div className="crm-content flex-grow p-6">
        {selectedCategory === "Users" && renderList(users, "User")}
        {selectedCategory === "Business" &&
          renderList(users.filter((user) => user.isBusiness), "Business")}
        {selectedCategory === "Cards" && renderList(cards, "Card")}

        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1 ? "bg-gray-300" : "bg-green-300 text-white"
            }`}
          >
            Prev
          </button>
          <span className="text-lg font-medium dark:text-white">{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages(users)}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages(users) ? "bg-gray-300" : "bg-green-300 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* User Edit Modal */}
      {selectedUser && (
        <UserEditModal
          isOpen={isUserModalOpen}
          closeModal={() => setIsUserModalOpen(false)}
          user={selectedUser}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* Card Edit Modal */}
      {selectedCardId && (
        <CardEditModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          cardId={selectedCardId}
        />
      )}
    </div>
  );
};

export default CRM;
