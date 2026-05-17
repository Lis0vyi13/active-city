import { CheckoutPageContent } from "@/features/checkout";
import { PageShell } from "@/widgets/page-shell";

export default function CheckoutPage() {
  return (
    <PageShell mainClassName="min-w-0 overflow-x-clip">
      <CheckoutPageContent />
    </PageShell>
  );
}
