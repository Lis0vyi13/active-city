import { notFound } from "next/navigation";

import { getCourtById } from "@/entities/court/api/courts-repository";
import { CourtDetailView } from "@/widgets/court-detail";
import { Header } from "@/widgets/header";

interface CourtPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourtPage({ params }: CourtPageProps) {
  const { id } = await params;
  const court = await getCourtById(id);

  if (!court) {
    notFound();
  }

  return (
    <div className="min-h-full overflow-x-clip bg-[#f5f7f9]">
      <Header />
      <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <CourtDetailView court={court} />
      </main>
    </div>
  );
}
