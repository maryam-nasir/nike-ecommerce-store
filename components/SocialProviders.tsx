"use client";

import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";

const SocialProviders = () => {
  const buttonClasses =
    "w-full inline-flex items-center justify-center py-3 px-4 text-sm font-medium text-dark-900 bg-white border border-light-300 rounded-lg hover:bg-gray-50 focus:z-10 focus:ring-2 focus:ring-light-300 cursor-pointer";

  return (
    <div className="flex flex-col gap-3 w-full">
      <button className={buttonClasses}>
        <FcGoogle className="w-5 h-5 mr-2" />
        Continue with Google
      </button>
      <button className={buttonClasses}>
        <FaXTwitter className="w-5 h-5 mr-2" />
        Continue with X
      </button>
    </div>
  );
};

export default SocialProviders;
