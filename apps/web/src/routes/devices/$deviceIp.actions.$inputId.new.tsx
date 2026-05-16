import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RouteDialog } from '@/components/route-dialog';
import { ActionWizard } from '@/features/actions/action-wizard';
import { firstEmptySlotId } from '@/features/actions/helpers';
import { useActionsDraftStore } from '@/stores/actions-draft';

export const Route = createFileRoute('/devices/$deviceIp/actions/$inputId/new')({
  component: NewActionDialog,
});

function NewActionDialog() {
  const { deviceIp, inputId } = Route.useParams();
  const navigate = useNavigate();
  const working = useActionsDraftStore((s) => s.working);
  const slotId = firstEmptySlotId(working);

  const close = () => navigate({ to: '/devices/$deviceIp', params: { deviceIp } });

  return (
    <RouteDialog
      title={`New action · Input ${Number(inputId) + 1}`}
      description="Define a trigger and the HTTP GET action it fires."
      onClose={close}
    >
      {slotId === null ? (
        <p className="text-sm text-destructive">
          All action slots on this device are in use. Delete an action first.
        </p>
      ) : (
        <ActionWizard
          deviceIp={deviceIp}
          inputId={Number(inputId)}
          actionId={slotId}
          onClose={close}
        />
      )}
    </RouteDialog>
  );
}
