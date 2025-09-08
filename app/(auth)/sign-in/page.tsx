import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-base font-normal text-dark-700 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-dark-900 hover:underline"
        >
          Sign Up
        </Link>
      </p>

      <div className="my-8 text-center">
        <h1 className="text-4xl font-bold text-dark-900">Sign In</h1>
        <p className="text-dark-700 mt-2">
          Enter your credentials to access your account
        </p>
      </div>

      <SocialProviders />

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-light-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-dark-700">Or sign in with</span>
        </div>
      </div>

      <AuthForm type="sign-in" />
    </div>
  );
}
