import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TCard } from "../../Types/TCard";
import { toast } from "react-toastify";

const CardEdit = () => {
  const [card, setCard] = useState<TCard | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const getData = async () => {
    try {
      const res = await axios.get(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/" + id,
      );
      setCard(res.data);
    } catch (error) {
      console.error("Error loading card data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCard((prevCard) => prevCard ? { ...prevCard, [name]: value } : null);
  };

  
  const handleSave = async () => {
    if (!card) return;
  
    // Only include the fields you want to update
    const finalSanitizedCard = {
      image: {
        url: card.image.url,
        alt: card.image.alt,
      },
      title: card.title,
      subtitle: card.subtitle,
      description: card.description,
      phone: card.phone,
      email: card.email,
      web: card.web,
      address: {
        houseNumber: card.address.houseNumber,
        street: card.address.street,
        city: card.address.city,
        state: card.address.state,
        country: card.address.country,
        zip: card.address.zip,
      },
    };
  
    try {
      await axios.put(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/" + id,
        finalSanitizedCard
      );
      toast.success("Card updated successfully");
      nav("/card/" + id); // Redirect to card details after saving
    } catch (error) {
      console.error("Error saving card", error);
      toast.error("Failed to save the card");
    }
  };
  
  const handleCancel = () => {
    nav("/card/" + id); // Navigate back to card details without saving
  };

  useEffect(() => {
    getData();
  }, [id]);

  if (loading) {
    return <p className="text-gray-600 dark:text-white">Loading card details...</p>;
  }

  if (!card) {
    return <p className="text-gray-600 dark:text-white">Card not found</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black py-10">
      <div className="shadow-[0_0_30px_10px_rgba(249,168,212,0.3)] max-w-4xl w-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 dark:shadow-[0_0_40px_20px_rgba(167,243,208,0.8)]">
        {/* Card Edit Form */}
        <div className="p-6">
          {/* Card Image */}
          <div className="mb-6 flex items-center space-x-4">
            <div className="w-32 h-32">
              <img
                src={card.image.url}
                alt={card.image.alt}
                className="object-cover w-full h-full rounded"
              />
            </div>
            <div className="flex-grow">
              <label className="block font-semibold">Image URL:</label>
              <input
                type="text"
                name="image.url"
                value={card.image.url}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Card Title */}
          <div className="mb-6">
            <label className="block font-semibold">Title:</label>
            <input
              type="text"
              name="title"
              value={card.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Card Subtitle */}
          <div className="mb-6">
            <label className="block font-semibold">Subtitle:</label>
            <input
              type="text"
              name="subtitle"
              value={card.subtitle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Card Description */}
          <div className="mb-6">
            <label className="block font-semibold">Description:</label>
            <textarea
              name="description"
              value={card.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block font-semibold">Phone:</label>
              <input
                type="text"
                name="phone"
                value={card.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold">Email:</label>
              <input
                type="email"
                name="email"
                value={card.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block font-semibold">Website:</label>
              <input
                type="text"
                name="web"
                value={card.web}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-semibold">Address:</label>
              <input
                type="text"
                name="address"
                value={`${card.address.houseNumber} ${card.address.street}, ${card.address.city}, ${card.address.state}, ${card.address.country}`}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Business Number */}
          <div className="mb-6">
            <label className="block font-semibold">Business Number:</label>
            <input
              type="text"
              name="bizNumber"
              value={card.bizNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:from-green-500 hover:to-blue-600 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-500 py-3 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:from-red-500 hover:to-red-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEdit;
