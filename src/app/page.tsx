import { getCourts } from "@/entities/court/api/courts-repository";
import { parseCatalogSearchParams } from "@/features/court-filter/lib/parse-catalog-search-params";
import { CourtCatalog } from "@/widgets/court-catalog";
import { PageShell } from "@/widgets/page-shell";

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;
  const { filters, page } = parseCatalogSearchParams(resolvedSearchParams);
  const courts = await getCourts();

  return (
    <PageShell>
      <CourtCatalog courts={courts} filters={filters} page={page} />
    </PageShell>
  );
}
