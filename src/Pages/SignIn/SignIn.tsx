import { joiResolver } from "@hookform/resolvers/joi";
import { Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { SignInJoiSchema } from "../../validations/SigninSchema.joi";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userActions } from "../../Store/UserSlice";
import { decode } from "../../Services/tokenService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function SignIn() {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [attempts, setAttempts] = useState<number>(
    parseInt(localStorage.getItem("loginAttempts") || "0")
  );
  
  // Retrieve the lock time from localStorage
  const lockTime = localStorage.getItem("lockTime");

  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });

    // Check if the lock period has expired
    if (lockTime && new Date().getTime() - parseInt(lockTime) > 15 * 60 * 1000) {
      // Reset the attempts and lock time if 15 minutes have passed
      localStorage.removeItem("lockTime");
      localStorage.setItem("loginAttempts", "0");
      setAttempts(0);
      toast.info("Login attempts reset. Please try again.");
    }
  }, [lockTime]);

  const initialFormData = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: initialFormData,
    mode: "onChange",
    resolver: joiResolver(SignInJoiSchema),
  });

  const submit = async (form: typeof initialFormData) => {
    if (attempts >= 3) {
      if (!lockTime) {
        // Set the lock time if not already set
        localStorage.setItem("lockTime", new Date().getTime().toString());
      }
      toast.error("Too many failed attempts. Please try again in 15 minutes.");
      return;
    }

    try {
      const token = await axios.post(
        "https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login",
        form
      );

      localStorage.setItem("token", token.data);
      const id = decode(token.data)._id;
      axios.defaults.headers.common["x-auth-token"] = token.data;
      const user = await axios.get(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${id}`
      );
      dispatch(userActions.login(user.data));
      toast.success("Sign In Successful");

      // Reset attempts on success
      localStorage.setItem("loginAttempts", "0");
      localStorage.removeItem("lockTime");
      setAttempts(0);
      nav("/");
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts.toString());

      toast.error(`Sign In Failed. Attempt ${newAttempts} of 3.`);

      if (newAttempts >= 3) {
        localStorage.setItem("lockTime", new Date().getTime().toString());
        toast.error("Too many failed attempts. Please try again in 15 minutes.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        data-aos="fade-up"
        className="flex flex-col w-2/5 max-w-xl gap-4 p-4 m-auto mt-14 rounded-lg shadow-lg bg-white p-12
        bg-white shadow-[0_0_30px_10px_rgba(249,168,212,0.3)] max-w-4xl w-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-lg overflow-hidden transition-transform duration-1000 ease-in-out hover:scale-105 dark:shadow-[0_0_40px_20px_rgba(167,243,208,0.8)]"
        onSubmit={handleSubmit(submit)}
      >
        <h1 className="text-3xl font-extrabold tracking-wide mb-6 animate-fade-in-down dark:text-green-300">
          Sign In
        </h1>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-green-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       dark:bg-gray-800 dark:text-green-300 placeholder-green-300"
          />
          <span className="text-sm text-red-500">{errors["email"]?.message}</span>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-green-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm 
                       focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       dark:bg-gray-800 dark:text-green-300 placeholder-green-300"
          />
          <span className="text-sm text-red-500">{errors["password"]?.message}</span>
        </div>

        <Button
          className="bg-pink-300 bg-gradient-to-r from-red-600 to-blue-500 dark:bg-gradient-to-r from-green-300 to-blue-500-600 py-3"
          type="submit"
          disabled={!isValid || attempts >= 3}
        >
          Sign In
        </Button>

        <p className="text-center mt-4 dark:text-green-300">
          Don’t have an account yet?{" "}
          <span
            className="text-blue-300 dark:text-white-300 underline cursor-pointer"
            onClick={() => nav("/signup")}
          >
            Create one!
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
