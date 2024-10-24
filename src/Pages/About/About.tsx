import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TRootState } from '../../Store/BigPie';

const About = () => {
  const nav = useNavigate();
  const user = useSelector((state: TRootState) => state.UserSlice.user);

  useEffect(() => {
    AOS.init({ duration: 1500, once: true, easing: 'ease-in-out' });
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen 
      bg-gray-100 dark:bg-gradient-to-br from-green-700 via-green-800 to-green-900 
      transition-all duration-500 p-10"
      data-aos="fade-up"
    >
      <h1
        className="text-6xl font-extrabold tracking-wider text-center 
        bg-gradient-to-r from-blue-400 to-pink-500 text-transparent bg-clip-text 
        dark:from-green-400 dark:to-green-300 mb-12 animate-pulse"
        data-aos="zoom-in"
      >
        About Us
      </h1>

      <p
        className="text-lg text-center max-w-3xl 
        text-gray-600 dark:text-gray-300 leading-relaxed mb-10"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Welcome to our platform! We aim to provide seamless card management tools with intuitive
        interfaces and exceptional performance. Explore endless possibilities, whether you are managing your personal or business cards. 
      </p>

      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div
          className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 
          transform transition-transform duration-300 hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-pink-600 dark:text-green-300 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Empower users with powerful tools for managing cards with ease, ensuring simplicity, security, and scalability.
          </p>
        </div>

        <div
          className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 
          transform transition-transform duration-300 hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-blue-500 dark:text-green-400 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We combine cutting-edge technology with beautiful design, ensuring that every interaction you have with our platform feels effortless.
          </p>
        </div>
      </div>

      <div className="mt-16" data-aos="zoom-in" data-aos-delay="700">
  <button
    onClick={() => {
      if (!user) {
        nav("/signup");
      } else {
        nav("/createcard");
      }
    }}
    className="px-8 py-3 text-lg font-semibold text-white rounded-full 
    bg-gradient-to-r from-pink-500 via-red-500 to-blue-500 
    dark:from-green-400 dark:to-blue-500-600 shadow-md 
    transform transition-transform hover:scale-110 duration-300"
  >
    {user ? "Go to Create Card" : "Sign Up"}
  </button>
</div>

    </div>
  );
};

export default About;
