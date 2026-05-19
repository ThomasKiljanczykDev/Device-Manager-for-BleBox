import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

// The app ships dark-only (see __root.tsx), so the theme is hardcoded rather
// than read from next-themes as the stock shadcn component does.
function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
