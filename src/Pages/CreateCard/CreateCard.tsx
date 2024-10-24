import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TCard } from '../../Types/TCard';
import { cardSchema } from '../../validations/CCardScheme.joi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { TRootState } from '../../Store/BigPie';
import { Button } from 'flowbite-react';

type CreateCardType = Omit<TCard, '_id' | 'likes'>;

const CreateCard: React.FC = () => {
  const user = useSelector((state: TRootState) => state.UserSlice.user);
  const [formData, setFormData] = useState<CreateCardType>({
    title: '',
    subtitle: '',
    description: '',
    phone: '',
    email: '',
    web: '',
    image: { url: '', alt: '' },
    address: {
      state: '',
      country: '',
      city: '',
      street: '',
      houseNumber: 0,
      zip: 0,
    },
    bizNumber: 0,
    user_id: user?._id || '',
  });

  const [errors, setErrors] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (
    field: keyof CreateCardType['address'],
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleImageChange = (field: 'url' | 'alt', value: string) => {
    setFormData((prev) => ({
      ...prev,
      image: { ...prev.image, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = cardSchema.validate(formData, { abortEarly: false });

    if (error) {
      setErrors(error.details.map((detail) => detail.message).join(', '));
      return;
    }

    try {
      const response = await axios.post(
        'https://monkfish-app-z9uza.ondigitalocean.app/bcard2/cards',
        formData
      );
      toast.success('Card created successfully!');
      nav('/');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.response?.data || err.message);
        setErrors(
          err.response?.data?.message || 'An unexpected error occurred'
        );
      } else {
        console.error('Error:', err.message);
        setErrors(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-2/5 gap-6 p-12 m-auto mt-10 mb-10 rounded-lg shadow-lg bg-white dark:bg-black 
                  dark:ring-2 dark:ring-green-300 dark:backdrop-blur-md transition-all transition-transform duration-1000 ease-in-out hover:scale-105 dark:shadow-[0_0_40px_20px_rgba(167,243,208,0.8)]"
      >
        <h1 className="text-3xl font-extrabold tracking-wide mb-6 dark:text-green-300">
          Create New Card
        </h1>

        {errors && (
          <div
            className="relative px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded"
            role="alert"
          >
            {errors}
          </div>
        )}

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full px-4 py-2 border rounded text-green-300 -md dark:bg-gray-800 dark:text-green-300"
          required
        />

        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          placeholder="Subtitle"
          className="w-full px-4 py-2 border rounded-md  text-green-300 dark:bg-gray-800 dark:text-green-300"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-4 py-2 border rounded text-green-300 -md dark:bg-gray-800 dark:text-green-300"
          required
        />

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full px-4 py-2 border text-green-300  rounded-md dark:bg-gray-800 dark:text-white"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />

        <input
          type="url"
          name="web"
          value={formData.web}
          onChange={handleChange}
          placeholder="Website"
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
        />

        <div className="grid grid-cols-2 gap-4">
          {['state', 'country', 'city', 'street'].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              value={(formData.address as any)[field]}
              onChange={(e) =>
                handleAddressChange(
                  field as keyof CreateCardType['address'],
                  e.target.value
                )
              }
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full px-4 py-2 border rounded-md text-green-300 dark:bg-gray-800 dark:text-green-300"
            />
          ))}
          <input
            type="number"
            name="houseNumber"
            value={formData.address.houseNumber}
            onChange={(e) =>
              handleAddressChange('houseNumber', +e.target.value)
            }
            placeholder="House Number"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-green-300"
          />
          <input
            type="number"
            name="zip"
            value={formData.address.zip}
            onChange={(e) => handleAddressChange('zip', +e.target.value)}
            placeholder="ZIP Code"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-green-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="url"
            value={formData.image.url}
            onChange={(e) => handleImageChange('url', e.target.value)}
            placeholder="Image URL"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-green-300"
          />
          <input
            type="text"
            name="alt"
            value={formData.image.alt}
            onChange={(e) => handleImageChange('alt', e.target.value)}
            placeholder="Image Alt Text"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-green-300"
          />
        </div>

        <Button
          className="bg-pink-300 bg-gradient-to-r from-red-600 to-blue-500 dark:bg-gradient-to-r from-green-300 to-blue-500-600 py-3"
          type="submit"
     
        >
          Create Card
        </Button>
      </form>
    </div>
  );
};

export default CreateCard;
