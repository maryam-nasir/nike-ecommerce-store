import ClientCart from "@/components/ClientCart";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-heading-3 text-dark-900 mb-6">Cart</h1>
      <ClientCart />
    </div>
  );
}