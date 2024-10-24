import { Footer as FbFooter } from "flowbite-react";

const Footer = () => {
  return (
    <FbFooter className="bg-pink-300 bg-gradient-to-r from-red-600 to-blue-500 dark:bg-gradient-to-r from-green-500 to-blue-500-600 py-6">
      <div className="flex justify-center w-full">
        <FbFooter.Copyright
          href="#"
          by="Space Web"
          year={2024}
          className="text-slate-100"
        />
      </div>
    </FbFooter>
  );
};

export default Footer;
