import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { TCard } from "../../Types/TCard";
import { toast } from "react-toastify";

type CardEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cardId: string;
};

const CardEditModal: React.FC<CardEditModalProps> = ({ isOpen, onClose, cardId }) => {
  const [card, setCard] = useState<TCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cardId) fetchCardData();
  }, [cardId]);

  const fetchCardData = async () => {
    try {
      const res = await axios.get(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`
      );
      setCard(res.data);
    } catch (error) {
      console.error("Error loading card data:", error);
      toast.error("Failed to load card data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCard((prevCard) => (prevCard ? { ...prevCard, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!card) return;
    try {
      console.log("Saving card data:", card); // Debug log
      const response = await axios.put(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards/${cardId}`,
        card,
        { headers: { "Content-Type": "application/json" } } // Ensure headers are set correctly
      );
      console.log("Save response:", response); // Debug log
      toast.success("Card updated successfully");
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving card:", error); // Improved error logging
      toast.error(`Failed to save the card` + error);
    }
  };
  

  if (loading) {
    return <p className="text-gray-600 dark:text-white">Loading...</p>;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-green-300">
                  Edit Card
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={card?.title || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={card?.description || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={card?.phone || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={card?.email || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-300 text-white rounded-md hover:bg-green-400"
                  >
                    Save
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CardEditModal;
