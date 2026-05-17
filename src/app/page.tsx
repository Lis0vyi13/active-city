import { getCourts } from "@/entities/court/api/courts-repository";
import { CourtCatalog } from "@/widgets/court-catalog";
import { Header } from "@/widgets/header";

export default async function CatalogPage() {
  const courts = await getCourts();

  return (
    <div className="min-h-full bg-[#f5f7f9]">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <CourtCatalog courts={courts} />
      </main>
    </div>
  );
}
