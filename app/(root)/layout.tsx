import Navbar from "@/components/Navbar";
import LandingFooter from "@/components/LandingFooter";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <LandingFooter />
      <Footer />
    </>
  );
}
