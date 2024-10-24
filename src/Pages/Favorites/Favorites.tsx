import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector } from 'react-redux';
import { TRootState } from '../../Store/BigPie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TCard } from '../../Types/TCard';
import { Card, Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaSadCry } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Favorites = () => {
  const [cards, setCards] = useState<TCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8; // Show 8 cards per page
  const pagesToShow = 4; // Show only 4 page numbers at a time
  const nav = useNavigate();
  const searchWord = useSelector((state: TRootState) => state.SearchSlice.search);
  const user = useSelector((state: TRootState) => state.UserSlice);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    getData();
  }, []);

  const getData = async () => {
    const res = await axios.get('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards');
    setCards(res.data);
  };

  const searchCards = () => {
    const lowerCaseSearch = searchWord.toLowerCase();
    return cards
      .filter((item) => item.likes.includes(user.user!._id))
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

  const likeUnlikeCard = async (card: TCard) => {
    try {
      const res = await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${card._id}`
      );
      if (res.status === 200) {
        toast.success('Card liked/unliked');
        const updatedCards = cards.filter((item) =>
          item._id === card._id ? !item.likes.includes(user.user!._id) : true
        );
        setCards(updatedCards);
      }
    } catch (error) {
      toast.error('Failed to like/unlike card');
      console.error(error);
    }
  };

  const handleGoHome = () => {
    nav('/');
  };

  return (
    <div className="flex flex-col items-center justify-start gap-8 mt-10" data-aos="fade-up">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-green-300">
        Your Favorite Cards
      </h1>

      {searchCards().length === 0 ? (
        <div
          className="text-center flex flex-col items-center gap-6 p-8 w-2/5 m-auto rounded-lg shadow-lg 
                     transition-all duration-300 bg-white dark:bg-black dark:ring-2 dark:ring-green-300"
        >
          <FaSadCry size={80} className="text-gray-500 animate-bounce dark:text-green-300" />
          <h2 className="text-3xl font-semibold text-gray-700 dark:text-green-300">
            No Favorites Yet!
          </h2>
          <p className="text-lg text-gray-600 dark:text-green-300">
            Discover magic by exploring new cards. Start adding favorites to make this space come alive!
          </p>

          <Button
            className="bg-pink-300 bg-gradient-to-r from-red-600 to-blue-500 
                       dark:bg-gradient-to-r from-green-300 to-blue-500-600 py-3 mt-4 shadow-md hover:shadow-lg 
                       transition-transform transform hover:scale-105"
            onClick={handleGoHome}
          >
            Go Back to Home
          </Button>
        </div>
      ) : (
        <>
          <div
            className="flex flex-wrap w-3/5 gap-4 m-auto"
            data-aos="zoom-in"
          >
            {currentCards.map((item: TCard) => (
              <Card
                key={item._id}
                className="w-2/6 m-auto dark:bg-gradient-to-r from-green-300 to-blue-500 py-6 shadow-lg"
                data-aos="fade-up"
              >
                <img
                  onClick={() => nav(`/card/${item._id}`)}
                  src={item.image.url}
                  alt={item.image.alt}
                  className="h-[200px] object-cover cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.src = require('../../Media/IDK.png');
                  }}
                />
                <h1 className="text-xl font-bold">{item.title}</h1>
                <h3 className="text-md text-gray-700">{item.subtitle}</h3>
                <p className="text-sm">{item.description}</p>
                <hr />
                <FaHeart
                  size={24}
                  className="m-auto cursor-pointer mt-2"
                  color={item.likes.includes(user.user!._id) ? 'red' : 'black'}
                  onClick={() => likeUnlikeCard(item)}
                />
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center mt-8 mb-10 space-x-2">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 bg-gray-200 rounded-md dark:bg-gray-600 dark:text-white ${
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-300 dark:hover:bg-gray-500'
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
                      ? 'bg-green-300 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white'
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
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
