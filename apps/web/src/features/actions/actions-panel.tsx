import { Link } from '@tanstack/react-router';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { triggerTypeLabel } from '@blebox/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useActionsDraftStore } from '@/stores/actions-draft';
import { actionSummary, configuredActions, firstEmptySlotId } from './helpers';

interface ActionsPanelProps {
  deviceIp: string;
  inputCount: number;
}

/** Per-input action tables, sourced from the in-memory draft. */
export function ActionsPanel({ deviceIp, inputCount }: ActionsPanelProps) {
  const working = useActionsDraftStore((s) => s.working);
  const deleteAction = useActionsDraftStore((s) => s.deleteAction);

  const slotsFull = firstEmptySlotId(working) === null;
  const configured = configuredActions(working);
  const inputs = Array.from({ length: inputCount }, (_, index) => index);

  return (
    <div className="flex flex-col gap-4">
      {inputs.map((input) => {
        const rows = configured.filter((action) => action.input === input);
        return (
          <Card key={input}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-sm">Input {input + 1}</CardTitle>
              {slotsFull ? (
                <Button size="sm" variant="outline" disabled title="All 30 action slots are in use">
                  <Plus /> Add action
                </Button>
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link
                    to="/devices/$deviceIp/actions/$inputId/new"
                    params={{ deviceIp, inputId: String(input) }}
                  >
                    <Plus /> Add action
                  </Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {rows.length === 0 ? (
                <p className="text-xs text-muted-foreground">No actions configured.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Trigger</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead className="w-24 text-right">Edit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((action) => (
                      <TableRow key={action.id}>
                        <TableCell>
                          <div className="font-medium">{triggerTypeLabel(action.triggerType)}</div>
                          {action.name ? (
                            <div className="text-xs text-muted-foreground">{action.name}</div>
                          ) : null}
                        </TableCell>
                        <TableCell className="font-mono text-xs break-all">
                          {actionSummary(action)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button asChild size="icon" variant="ghost">
                              <Link
                                to="/devices/$deviceIp/actions/$inputId/$actionId/edit"
                                params={{
                                  deviceIp,
                                  inputId: String(input),
                                  actionId: String(action.id),
                                }}
                              >
                                <Pencil />
                              </Link>
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteAction(action.id)}
                              title="Delete action"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
