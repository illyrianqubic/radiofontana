import { useClient, type DocumentActionComponent } from 'sanity';
import { Trash2 } from 'lucide-react';

/**
 * "Fshij" (Delete) document action for posts.
 * Shows a red Delete button in the document footer for ALL post states.
 * Deletes via the Sanity client directly (useDocumentOperation returns null
 * for delete on published docs in Sanity v5).
 */
export const DeletePostAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: '2024-01-01' });

  return {
    label: 'Fshij',
    tone: 'critical',
    icon: Trash2,
    title: 'Fshij artikullin përgjithmonë',
    onHandle: () => {
      const msg = props.draft
        ? 'Ky artikull do të fshihet PËRGJITHMONË — publikimi dhe drafti i redaktuar bashkë me të. Vazhdo?'
        : 'Ky artikull do të fshihet PËRGJITHMONË. Vazhdo?';
      if (window.confirm(msg)) {
        Promise.all([
          client.delete(props.id).catch(() => {}),
          client.delete(`drafts.${props.id}`).catch(() => {}),
        ]).then(() => props.onComplete?.());
      }
    },
  };
};
