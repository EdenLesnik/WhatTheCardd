import { useSelector } from "react-redux";
import { TRootState } from "../../Store/BigPie";
import { Link } from "react-router-dom";
import videoFile from "../../Media/video.mp4"; // Import the video
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const TitleSection = () => {
  const user = useSelector((state: TRootState) => state.UserSlice.user);

  useEffect(() => {
    AOS.init({ duration: 1200, easing: "ease-in-out", once: true });
  }, []);

  return (
    <section
      className="relative flex items-center justify-center w-full min-h-[50vh] overflow-hidden"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full 
        bg-gradient-to-r from-red-600 to-blue-500 
        dark:from-green-700 dark:to-teal-600 opacity-80 z-10"
      ></div>

      {/* Content Section */}
      <div
        className="relative z-20 flex flex-col items-center text-white text-center p-10"
        data-aos="fade-up"
      >
        <h1
          className="text-5xl font-extrabold tracking-wide mb-4 
          dark:text-green-300 animate-fade-in-down"
          data-aos="zoom-in"
        >
          What The Card
        </h1>

        <p
          className="text-2xl font-light mb-6 animate-pulse"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          All the cards in one home
        </p>

        <div
          className="h-1 w-24 bg-white rounded-full mt-4"
          data-aos="zoom-in"
          data-aos-delay="500"
        ></div>

        {!user && (
          <div className="flex space-x-4 m-10" data-aos="fade-up" data-aos-delay="700">
            <div className="group">
              <Link to="/signin">
                <button
                  className="relative border-4 border-white text-white font-semibold py-2 px-6 rounded-lg shadow-md 
                  transition-all ease-in-out duration-500 transform 
                  bg-transparent group-hover:scale-110 group-hover:rotate-3 
                  group-hover:bg-white group-hover:text-black 
                  hover:shadow-2xl"
                >
                  Sign In
                </button>
              </Link>
            </div>

            <div className="group">
              <Link to="/signup">
                <button
                  className="relative bg-white text-black border-4 border-white font-semibold py-2 px-6 rounded-lg shadow-md 
                  transition-all ease-in-out duration-500 transform 
                  group-hover:scale-110 group-hover:-rotate-3 
                  hover:shadow-2xl 
                  group-hover:bg-transparent group-hover:text-white"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TitleSection;
