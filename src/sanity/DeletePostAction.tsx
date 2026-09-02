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
 * Uses window.confirm for the confirmation dialog (avoids the "⋯" overflow
 * button that Sanity shows for actions with built-in dialogs).
 */
export const DeletePostAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      // Delete published doc + any draft of it
      const results = await Promise.allSettled([
        client.delete(props.id),
        client.delete(`drafts.${props.id}`),
      ]);
      // Log any failures for debugging
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.warn(`Delete ${i === 0 ? 'published' : 'draft'} failed:`, r.reason);
        }
      });
      props.onComplete?.();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  }, [client, props]);

  return {
    label: deleting ? 'Fshihet…' : 'Fshij',
    tone: 'critical',
    icon: Trash2,
    title: 'Fshij artikullin përgjithmonë',
    disabled: deleting,
    onHandle: () => {
      // Use window.confirm to avoid the "⋯" overflow button
      const confirmed = window.confirm(
        props.draft
          ? 'Ky artikull do të fshihet PËRGJITHMONË — publikimi dhe drafti i redaktuar bashkë me të. Vazhdo?'
          : 'Ky artikull do të fshihet PËRGJITHMONË. Vazhdo?'
      );
      if (confirmed) {
        handleDelete();
      }
    },
  };
};
