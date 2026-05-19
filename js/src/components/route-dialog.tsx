import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RouteDialogProps {
  title: string;
  description?: string;
  /** Called when the dialog is dismissed — routes should navigate to a parent. */
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /**
   * Forwarded to the dialog's Escape handler. Call `event.preventDefault()` to
   * keep the dialog open — e.g. when an embedded editor should own the keypress.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

/**
 * A shadcn `Dialog` rendered as an overlay for a dedicated route (TanStack
 * Router + shadcn pattern). The dialog is always open; dismissing it navigates
 * back to the parent route via `onClose`, keeping dialogs deep-linkable.
 */
export function RouteDialog({
  title,
  description,
  onClose,
  children,
  className,
  onEscapeKeyDown,
}: RouteDialogProps) {
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className={className} onEscapeKeyDown={onEscapeKeyDown}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
