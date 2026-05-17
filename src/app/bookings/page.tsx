import { getBookingsByUserId } from "@/entities/booking/api/bookings-repository";
import { BookingsContent } from "@/features/bookings";
import { getServerSession } from "@/lib/auth/get-server-session";
import { PageShell } from "@/widgets/page-shell";

export default async function BookingsPage() {
  const { user } = await getServerSession();
  const bookings = user ? await getBookingsByUserId(user.id) : [];

  return (
    <PageShell mainClassName="min-w-0 flex-1 overflow-x-clip">
      <h1 className="mb-6 shrink-0 text-2xl font-bold text-foreground sm:text-3xl">
        Мої бронювання
      </h1>
      <BookingsContent user={user} bookings={bookings} />
    </PageShell>
  );
}
