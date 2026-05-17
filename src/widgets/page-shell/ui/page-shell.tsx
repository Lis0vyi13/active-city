import { cn } from "@/lib/utils";
import { Header } from "@/widgets/header";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
}

export function PageShell({
  children,
  className,
  mainClassName,
}: PageShellProps) {
  return (
    <div className={cn("flex min-h-full flex-1 flex-col bg-[#f5f7f9]", className)}>
      <Header />
      <main
        className={cn(
          "mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
          mainClassName
        )}
      >
        {children}
      </main>
    </div>
  );
}
