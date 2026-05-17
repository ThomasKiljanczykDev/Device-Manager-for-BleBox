import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { RouteDialog } from '@/components/route-dialog';
import { ActionWizard } from '@/features/actions/action-wizard';
import { firstEmptySlotId } from '@/features/actions/helpers';
import { useActionsDraftStore } from '@/stores/actions-draft';

export const Route = createFileRoute('/devices/$deviceIp/actions/$inputId/new')({
  component: NewActionDialog,
});

function NewActionDialog() {
  const { deviceIp, inputId } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const working = useActionsDraftStore((s) => s.working);
  const slotId = firstEmptySlotId(working);

  const close = () => navigate({ to: '/devices/$deviceIp', params: { deviceIp } });

  return (
    <RouteDialog
      title={t('wizard.newTitle', { n: Number(inputId) + 1 })}
      description={t('wizard.newDescription')}
      onClose={close}
    >
      {slotId === null ? (
        <p className="text-sm text-destructive">{t('wizard.noFreeSlots')}</p>
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
