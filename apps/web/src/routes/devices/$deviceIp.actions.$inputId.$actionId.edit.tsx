import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RouteDialog } from '@/components/route-dialog';
import { ActionWizard } from '@/features/actions/action-wizard';
import { useActionsDraftStore } from '@/stores/actions-draft';

export const Route = createFileRoute('/devices/$deviceIp/actions/$inputId/$actionId/edit')({
  component: EditActionDialog,
});

function EditActionDialog() {
  const { deviceIp, inputId, actionId } = Route.useParams();
  const navigate = useNavigate();
  const working = useActionsDraftStore((s) => s.working);
  const existing = working.find((action) => action.id === Number(actionId));

  const close = () => navigate({ to: '/devices/$deviceIp', params: { deviceIp } });

  return (
    <RouteDialog
      title={`Edit action · Input ${Number(inputId) + 1}`}
      description="Update the trigger or the HTTP GET action."
      onClose={close}
    >
      {existing ? (
        <ActionWizard
          deviceIp={deviceIp}
          inputId={Number(inputId)}
          actionId={Number(actionId)}
          existing={existing}
          onClose={close}
        />
      ) : (
        <p className="text-sm text-destructive">That action no longer exists.</p>
      )}
    </RouteDialog>
  );
}
