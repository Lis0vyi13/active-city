import { notFound } from "next/navigation";

import { getCourtById } from "@/entities/court/api/courts-repository";
import { CourtPageGuard } from "@/features/auth";
import { CourtDetailView } from "@/widgets/court-detail";
import { PageShell } from "@/widgets/page-shell";

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
    <PageShell mainClassName="min-w-0 overflow-x-clip">
      <CourtPageGuard>
        <CourtDetailView court={court} />
      </CourtPageGuard>
    </PageShell>
  );
}
