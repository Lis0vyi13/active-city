import { CheckoutPageContent } from "@/features/checkout";
import { Header } from "@/widgets/header";

export default function CheckoutPage() {
  return (
    <div className="min-h-full overflow-x-clip bg-[#f5f7f9]">
      <Header />
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <CheckoutPageContent />
      </main>
    </div>
  );
}
