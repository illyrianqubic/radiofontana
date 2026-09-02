import { useState } from 'react';
import { useDocumentOperation, type DocumentActionComponent } from 'sanity';
import { Trash2 } from 'lucide-react';

/**
 * "Fshij" (Delete) document action for posts.
 *
 * Shows a red, same-sized button next to Publish/Unpublish in the document
 * footer **only when the article is already published**, so editors can
 * delete without digging through the "…" overflow menu.
 *
 * Always asks for confirmation first. Deleting removes the published doc and
 * any draft edits of it.
 */
export const DeletePostAction: DocumentActionComponent = (props) => {
  const { delete: deleteOp } = useDocumentOperation(props.id, props.type);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Only for already-published articles with a working delete operation.
  if (!props.published || deleteOp.disabled) return null;

  return {
    label: 'Fshij',
    tone: 'critical',
    icon: Trash2,
    title: 'Fshij artikullin përgjithmonë',
    onHandle: () => setConfirmOpen(true),
    dialog: confirmOpen
      ? {
          type: 'confirm',
          tone: 'critical',
          message: props.draft
            ? 'Ky artikull do të fshihet PËRGJITHMONË — publikimi dhe drafti i redaktuar bashkë me të. Vazhdo?'
            : 'Ky artikull i publikuar do të fshihet PËRGJITHMONË. Vazhdo?',
          onConfirm: () => {
            deleteOp.execute();
            setConfirmOpen(false);
          },
          onCancel: () => setConfirmOpen(false),
        }
      : null,
  };
};