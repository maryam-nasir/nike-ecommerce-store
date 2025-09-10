"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
  onSubmit: (formData: FormData) => Promise<{ok: boolean, userId?: string} | void>;
}

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const result = await onSubmit(formData);
      if (result?.ok) {
        router.push(`/`);
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  const labelClasses = "block mb-2 text-sm font-medium text-dark-900";
  const inputClasses =
    "bg-white border border-light-300 text-dark-900 text-sm rounded-lg focus:ring-dark-900 focus:border-dark-900 focus:outline-0 block w-full py-3 px-4";

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      {type === "sign-up" && (
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={inputClasses}
            placeholder="Enter your full name"
            required
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className={labelClasses}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={inputClasses}
          placeholder="johndoe@gmail.com"
          required
        />
      </div>
      <div className="relative">
        <label htmlFor="password" className={labelClasses}>
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          className={inputClasses}
          placeholder="minimum 8 characters"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5"
        >
          {showPassword ? (
            <AiOutlineEyeInvisible className="h-5 w-5 text-dark-700" />
          ) : (
            <AiOutlineEye className="h-5 w-5 text-dark-700" />
          )}
        </button>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
      >
        {type === "sign-in" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;
