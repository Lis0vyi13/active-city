import { BookingsList } from "@/features/bookings";
import { Header } from "@/widgets/header";

export default function BookingsPage() {
  return (
    <div className="min-h-full overflow-x-clip bg-[#f5f7f9]">
      <Header />
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
          Мої бронювання
        </h1>
        <BookingsList />
      </main>
    </div>
  );
}
