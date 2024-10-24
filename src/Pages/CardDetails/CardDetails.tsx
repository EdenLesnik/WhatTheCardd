import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TCard } from "../../Types/TCard";
import { FaHeart, FaPhoneAlt } from "react-icons/fa";

const CardDetails = () => {
  const [card, setCard] = useState<TCard>();
  const { id } = useParams<{ id: string }>();

  const getData = async () => {
    const res = await axios.get(
      "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/" + id,
    );
    setCard(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black py-10">
      {card ? (
        <div className="shadow-[0_0_30px_10px_rgba(249,168,212,0.3)] max-w-4xl w-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 dark:shadow-[0_0_40px_20px_rgba(167,243,208,0.8)]">
          {/* Card Image */}
          <img
            src={card.image.url}
            alt={card.image.alt}
            className="w-full h-64 object-cover"
          />
          
          <div className="p-6">
            {/* Card Title */}
            <h1 className="text-3xl font-bold mb-4">{card.title}</h1>

            {/* Card Subtitle */}
            <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-300 mb-2">
              {card.subtitle}
            </h2>

            {/* Card Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {card.description}
            </p>

            <hr className="border-gray-400 my-4" />

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
              {/* Phone */}
              <div className="flex items-center justify-between">
                <span className="font-semibold">Phone:</span>
                <span className="flex items-center">
                  <FaPhoneAlt className="mr-2" /> {card.phone}
                </span>
              </div>
              
              {/* Email */}
              <div className="flex items-center justify-between">
                <span className="font-semibold">Email:</span>
                <a
                  href={`mailto:${card.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {card.email}
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center justify-between">
                <span className="font-semibold">Website:</span>
                <a
                  href={card.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {card.web}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-center justify-between">
                <span className="font-semibold">Address:</span>
                <span>
                  {`${card.address.houseNumber} ${card.address.street}, ${card.address.city}, ${card.address.state}, ${card.address.country}`}
                </span>
              </div>

              {/* Business Number */}
              <div className="flex items-center justify-between">
                <span className="font-semibold">Business Number:</span>
                <span>{card.bizNumber}</span>
              </div>

              {/* Likes */}
              <div className="flex items-center justify-center mt-4">
                <FaHeart size={30} className="text-red-500" />
                <span className="ml-2 text-lg">{card.likes.length}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-white">Loading card details...</p>
      )}
    </div>
  );
};

export default CardDetails;
