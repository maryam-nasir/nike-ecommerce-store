import AuthForm from "@/components/AuthForm";
import SocialProviders from "@/components/SocialProviders";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-base font-normal text-dark-700 text-center">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-dark-900 hover:underline"
        >
          Sign In
        </Link>
      </p>

      <div className="my-8 text-center">
        <h1 className="text-4xl font-bold text-dark-900">Join Nike Today!</h1>
        <p className="text-dark-700 mt-2">
          Create your account to start your fitness journey
        </p>
      </div>

      <SocialProviders />

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-light-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-3 text-dark-700">Or sign up with</span>
        </div>
      </div>

      <AuthForm type="sign-up" />

      <p className="mt-8 text-center text-sm text-dark-700">
        By signing up, you agree to our{" "}
        <Link href="#" className="text-dark-900 hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-dark-900 hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
