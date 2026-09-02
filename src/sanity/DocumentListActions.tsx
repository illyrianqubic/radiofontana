import { useState, useCallback } from 'react';
import { useClient } from 'sanity';

/**
 * A small "−" delete button that appears next to each document in the
 * "Artikujt dhe Përmbajtja" list. Clicking it shows a confirmation
 * dialog, then deletes the document permanently.
 *
 * Deletes via the Sanity client directly (bypasses useDocumentOperation
 * which returns null for `delete` on published docs in Sanity v5).
 *
 * Used by the custom list item view in sanity.config.tsx.
 */
export function DocumentListDeleteButton({
  documentId,
  documentType: _documentType,
  onDeleted,
}: {
  documentId: string;
  documentType: string;
  onDeleted?: () => void;
}) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      // Delete published doc + any draft of it
      await Promise.all([
        client.delete(documentId).catch(() => {}),
        client.delete(`drafts.${documentId}`).catch(() => {}),
      ]);
      onDeleted?.();
    } catch {
      // doc may already be gone
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }, [client, documentId, onDeleted]);

  void _documentType; // kept for API compatibility

  return (
    <>
      <button
        type="button"
        disabled={deleting}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setConfirmOpen(true);
        }}
        title="Fshij artikullin"
        aria-label="Fshij artikullin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          marginLeft: 8,
          padding: 0,
          background: deleting ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
          border: '1px solid rgba(220, 38, 38, 0.4)',
          borderRadius: 6,
          color: '#DC2626',
          cursor: deleting ? 'wait' : 'pointer',
          flexShrink: 0,
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1,
          opacity: deleting ? 0.7 : 1,
          transition: 'background 0.15s, opacity 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!deleting) {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220, 38, 38, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!deleting) {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }
        }}
      >
        {deleting ? '…' : '−'}
      </button>
      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: 24,
              maxWidth: 400,
              width: '100%',
              color: '#fff',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 700 }}>
              Fshij artikullin?
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
              Ky artikull do të fshihet PËRGJITHMONË. Ky veprim nuk mund të zhbëhet.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setConfirmOpen(false); }}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 6,
                  color: '#fff',
                  cursor: deleting ? 'default' : 'pointer',
                  fontSize: 14,
                  opacity: deleting ? 0.5 : 1,
                }}
              >
                Anulo
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                disabled={deleting}
                style={{
                  padding: '8px 16px',
                  background: '#DC2626',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                  cursor: deleting ? 'wait' : 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? 'Fshihet…' : 'Fshij'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
