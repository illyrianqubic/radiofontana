import { useState, useCallback } from 'react';
import { useClient, type DocumentActionComponent } from 'sanity';
import { Trash2 } from 'lucide-react';

/**
 * "Fshij" (Delete) document action for posts.
 *
 * Shows a red Delete button in the document footer for ALL post states
 * (draft, published, scheduled, revision, version) so editors can delete
 * any article without digging through the "…" overflow menu.
 *
 * Deletes via the Sanity client directly (bypasses useDocumentOperation
 * which returns null for `delete` on published docs in Sanity v5).
 * Removes both the published doc and any draft of it.
 *
 * Always asks for confirmation first.
 */
export const DeletePostAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      // Delete published doc + any draft of it
      await Promise.all([
        client.delete(props.id).catch(() => {}),
        client.delete(`drafts.${props.id}`).catch(() => {}),
      ]);
      props.onComplete?.();
    } catch {
      // doc may already be gone — nothing to do
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }, [client, props]);

  return {
    label: deleting ? 'Fshihet…' : 'Fshij',
    tone: 'critical',
    icon: Trash2,
    title: 'Fshij artikullin përgjithmonë',
    disabled: deleting,
    onHandle: () => setConfirmOpen(true),
    dialog: confirmOpen
      ? {
          type: 'confirm',
          tone: 'critical',
          message: props.draft
            ? 'Ky artikull do të fshihet PËRGJITHMONË — publikimi dhe drafti i redaktuar bashkë me të. Vazhdo?'
            : 'Ky artikull do të fshihet PËRGJITHMONË. Vazhdo?',
          onConfirm: handleDelete,
          onCancel: () => setConfirmOpen(false),
        }
      : null,
  };
};
