import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSelector } from 'react-redux';
import { TRootState } from '../../Store/BigPie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TCard } from '../../Types/TCard';
import { Card } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaPhoneAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TitleSection from './TitleSection';

const Home = () => {
  const [cards, setCards] = useState<TCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;
  const pagesToShow = 4;
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

  const searchCards = () =>
    cards.filter((item) =>
      item.title.toLowerCase().includes(searchWord.toLowerCase())
    );

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

  const toggleLike = async (card: TCard) => {
    try {
      const res = await axios.patch(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${card._id}`
      );

      if (res.status === 200) {
        const updatedCard = res.data;
        const newCards = cards.map((c) => (c._id === updatedCard._id ? updatedCard : c));
        setCards(newCards);
        toast.success('Card liked/unliked successfully');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to toggle like');
    }
  };

  return (
    <>
      <title>דף הבית - WhatTheCard</title>
      <TitleSection />
      <main
        className="flex flex-col items-center justify-center min-h-screen bg-white py-10 dark:bg-black"
        data-aos="fade-up"
      >
        <div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 md:px-8"
          data-aos="zoom-in"
        >
          {currentCards.map((card, index) => (
            <Card
            key={index}
            className="bg-gray-200 text-black shadow-lg rounded-lg dark:bg-gray-600 dark:text-white 
                       transition-transform duration-500 ease-in-out 
                       hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <img
              src={card.image.url}
              alt={card.image.alt}
              className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
              onClick={() => nav(`/card/${card._id}`)}
              onError={(e) => {
                e.currentTarget.src = require('../../Media/IDK.png');
              }}
            />
            <div className="p-4">
              <h1 className="text-lg font-semibold truncate">{card.title}</h1>
              <p className="text-sm text-gray-400 mb-2 truncate">{card.subtitle}</p>
              <p className="text-sm text-gray-600 line-clamp-3 dark:text-white">
                {card.description}
              </p>
              <hr className="my-4 border-gray-700" />
              <div className="flex items-center justify-center mt-4 space-x-4">
                {user && user.user && (
                  <>
                    <FaHeart
                      size={20}
                      className={`cursor-pointer transition-colors duration-300 ${
                        card.likes.includes(user.user._id)
                          ? 'text-red-500'
                          : 'text-black dark:text-green-300'
                      }`}
                      onClick={() => toggleLike(card)}
                    />
                    {user.user.isAdmin && (
                      <FaEdit
                        size={20}
                        className="cursor-pointer"
                        onClick={() => nav(`/edit-card/${card._id}`)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
          


          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center mt-8 space-x-2">
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
      </main>
    </>
  );
};

export default Home;
