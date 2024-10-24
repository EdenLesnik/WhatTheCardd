/* eslint-disable tailwindcss/classnames-order */
import { useSelector } from "react-redux";
import { TRootState } from "../../Store/BigPie";
import { useEffect, useState } from "react";
import axios from "axios";
import { TCard } from "../../Types/TCard";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaPlus, FaSadCry } from "react-icons/fa";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";

const MyCard = () => {
  const [cards, setCards] = useState<TCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8; // Show 8 cards per page
  const pagesToShow = 4; // Show only 4 page numbers at a time
  const nav = useNavigate();
  const searchWord = useSelector((state: TRootState) => state.SearchSlice.search);
  const user = useSelector((state: TRootState) => state.UserSlice);

  const searchCards = () => {
    const lowerCaseSearch = searchWord.toLowerCase();
    return cards
      .filter((item) => item.user_id === user.user!._id) // Show only user's cards
      .filter((item) => item.title.toLowerCase().includes(lowerCaseSearch));
  };

  const totalPages = Math.ceil(searchCards().length / cardsPerPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = searchCards().slice(indexOfFirstCard, indexOfLastCard);

  const getPageRange = () => {
    const startPage = Math.max(
      1,
      Math.min(currentPage - Math.floor(pagesToShow / 2), totalPages - pagesToShow + 1)
    );
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const navToCard = (id: string) => {
    nav("/card/" + id);
  };

  const getData = async () => {
    const res = await axios.get(
      "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards"
    );
    setCards(res.data);
    AOS.refresh(); // Refresh AOS after loading data
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    getData();
  }, []);

  const likeUnlikeCard = async (card: TCard) => {
    const res = await axios.patch(
      `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${card._id}`
    );
    if (res.status === 200) {
      toast.success("Card liked/unliked");
      const newCards = [...cards];
      const index = newCards.indexOf(card);

      if (card.likes.includes(user.user!._id)) {
        newCards[index].likes = card.likes.filter((id) => id !== user.user!._id);
      } else {
        newCards[index].likes.push(user.user!._id);
      }
      setCards(newCards);
    }
  };

  const createCard = () => {
    nav("/createcard");
  };

  const handleGoHome = () => {
    nav("/");
  };

  return (
    
    <div className="flex flex-col items-center justify-start gap-8 p-8">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-green-300" data-aos="fade-up">
        My Cards
      </h1>

      {searchCards().length === 0 ? (
        <div
          data-aos="fade-up"
          className={`text-center flex flex-col items-center gap-6 p-8 w-2/5 m-auto 
                      rounded-lg shadow-lg transition-all duration-300 
                      bg-white dark:bg-black dark:ring-2 dark:ring-green-300`}
        >
          <FaSadCry size={80} className="text-gray-500 animate-bounce dark:text-green-300" />
          <h2 className="text-3xl font-semibold text-gray-700 dark:text-green-300">
            No Cards Yet!
          </h2>
          <p className="text-lg text-gray-600 dark:text-green-300">
            It seems like you haven't created any cards yet. Start creating one and add magic to your profile!
          </p>
          <div className="flex flex-row gap-10">
            <Button
              className="bg-pink-300 bg-gradient-to-r from-red-600 to-blue-500 
                          dark:bg-gradient-to-r from-green-300 to-blue-500-600 py-3 mt-4 shadow-md hover:shadow-lg 
                          transition-transform transform hover:scale-105"
              onClick={handleGoHome}
            >
              Go Back to Home
            </Button>
            <Button
              className="bg-pink-300 bg-gradient-to-r from-red-600 to-pink-500 
                          dark:bg-gradient-to-r from-blue-300 to-pink-500-600 py-3 mt-4 shadow-md hover:shadow-lg 
                          transition-transform transform hover:scale-105"
              onClick={createCard}
            >
              Create Card
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap w-3/5 gap-4 m-auto">
            {currentCards.map((item: TCard) => (
              <div
                key={item._id}
                data-aos="fade-up"
                className="w-2/6 m-auto py-6 shadow-lg p-10"
              >
                <img
                  onClick={() => navToCard(item._id)}
                  src={item.image.url}
                  alt={item.image.alt}
                  className="h-[200px] object-cover cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.src = require("../../Media/IDK.png");
                  }}
                />
                <h1 className="mt-5 text-center dark:text-green-300 text-xl font-bold">{item.title}</h1>
                <h3 className="mt-5 text-center dark:text-green-300 text-md text-gray-700">{item.subtitle}</h3>
                <p className="mt-5 text-center dark:text-green-300 text-sm">{item.description}</p>
                <hr className="mt-5" />
                {user && user.user && (
                  <FaHeart
                    size={24}
                    className="mt-5 m-auto cursor-pointer"
                    color={item.likes.includes(user.user!._id) ? "red" : "black"}
                    onClick={() => likeUnlikeCard(item)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center mt-8 mb-10 space-x-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 bg-gray-200 rounded-md dark:bg-gray-600 dark:text-white ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              Prev
            </button>

            <div className="flex">
              {getPageRange().map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-3 py-1 mx-1 rounded-md ${
                    currentPage === page
                      ? "bg-green-300 text-white"
                      : "bg-gray-200 dark:bg-gray-600 text-black dark:text-white"
                  } transition-all hover:bg-green-300`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 bg-gray-200 rounded-md dark:bg-gray-600 dark:text-white ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      <div className="fixed bottom-4 right-4 p-3 rounded-full bg-green-500 shadow-lg cursor-pointer hover:scale-110 transition-transform">
        <FaPlus className="text-white" size={24} />
      </div>
    </div>
  );
};

export default MyCard;
