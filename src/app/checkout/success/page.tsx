import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { CheckoutSuccessContent } from "@/features/checkout/ui/checkout-success-content";
import { PageShell } from "@/widgets/page-shell";

export default function CheckoutSuccessPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
    </PageShell>
  );
}
