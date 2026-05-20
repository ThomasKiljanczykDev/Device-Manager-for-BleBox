import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Dark-only theme; `class="dark"` is set on <html> in index.html. */}
        <div className="min-h-screen bg-background text-foreground">
          <Outlet />
        </div>
        <Toaster richColors />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
