import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { RouteDialog } from '@/components/route-dialog';
import { ActionWizard } from '@/features/actions/action-wizard';
import { useActionsDraftStore } from '@/stores/actions-draft';

export const Route = createFileRoute('/devices/$deviceIp/actions/$inputId/$actionId/edit')({
  component: EditActionDialog,
});

function EditActionDialog() {
  const { deviceIp, inputId, actionId } = Route.useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const working = useActionsDraftStore((s) => s.working);
  const existing = working.find((action) => action.id === Number(actionId));

  const close = () => navigate({ to: '/devices/$deviceIp', params: { deviceIp } });

  return (
    <RouteDialog
      title={t('wizard.editTitle', { n: Number(inputId) + 1 })}
      description={t('wizard.editDescription')}
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
        <p className="text-sm text-destructive">{t('wizard.actionGone')}</p>
      )}
    </RouteDialog>
  );
}
