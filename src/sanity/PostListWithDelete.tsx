import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useClient } from 'sanity';
import { IntentLink } from 'sanity/router';
import { Spinner, Badge, Flex, Card, Text, Stack } from '@sanity/ui';
import { DocumentListDeleteButton } from './DocumentListActions';

/**
 * Custom "Artikujt dhe Përmbajtja" list view.
 *
 * Renders every post with its title, status badges, and a visible "−" delete
 * button on each row — so authors can delete articles in one click without
 * opening each document.
 *
 * Clicking anywhere on the row opens the document editor. The "−" button
 * deletes the article (with confirmation) and does NOT open the editor.
 *
 * Uses Sanity's real-time client; re-fetches after every delete so the list
 * stays current.
 */

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  publishedAt,
  breaking,
  featured,
  "authorName": coalesce(author->name, "Radio Fontana"),
  "categoryTitle": coalesce(category->title, "Pa kategori"),
  "hasDraft": defined(*[_id in path("drafts." + ^._id)][0])
}`;

interface PostDoc {
  _id: string;
  _type: string;
  title: string | null;
  slug: { current: string } | null;
  publishedAt: string | null;
  breaking: boolean;
  featured: boolean;
  authorName: string;
  categoryTitle: string;
  hasDraft: boolean;
}

interface PostRowProps {
  post: PostDoc;
  onDeleted: () => void;
}

function PostRow({ post, onDeleted }: PostRowProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('sq-AL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Pa datë';

  return (
    <>
      <style>{`
        .post-row-card:hover {
          border-color: rgba(255,255,255,0.3) !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important;
        }
      `}</style>
      <Card
        padding={0}
        marginBottom={3}
        style={{
          border: '1px solid rgba(255,255,255,0.18)',
          borderLeft: '3px solid #DC2626',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.03)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        className="post-row-card"
      >
      <Flex align="center" gap={3} padding={3}>
        {/* Title + meta — clickable area opens the editor */}
        <IntentLink
          intent="edit"
          params={{ id: post._id, type: post._type }}
          style={{ flex: 1, minWidth: 0, textDecoration: 'none', color: 'inherit' }}
        >
          <Stack flex={1} space={2} style={{ minWidth: 0 }}>
            <Text size={2} weight="semibold" style={{ color: '#fff' }}>
              {post.title || 'Pa titull'}
            </Text>
            <Flex align="center" gap={2} style={{ flexWrap: 'wrap' }}>
              <Text size={1} muted>
                {post.categoryTitle} · {post.authorName} · {date}
              </Text>
            </Flex>
          </Stack>
        </IntentLink>

        {/* Divider */}
        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: 'rgba(255,255,255,0.1)',
            margin: '0 4px',
          }}
        />

        {/* Status badges */}
        <Flex align="center" gap={2}>
          {post.breaking && (
            <Badge mode="outline" tone="critical" style={{ fontSize: 10, fontWeight: 700 }}>
              LAJM I FUNDIT
            </Badge>
          )}
          {post.featured && (
            <Badge mode="outline" tone="caution" style={{ fontSize: 10, fontWeight: 700 }}>
              E SPIKATUR
            </Badge>
          )}
          {post.hasDraft && (
            <Badge mode="outline" tone="default" style={{ fontSize: 10, fontWeight: 600 }}>
              DRAFT
            </Badge>
          )}
        </Flex>

        {/* Divider */}
        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: 'rgba(255,255,255,0.1)',
            margin: '0 4px',
          }}
        />

        {/* Delete button — the "-" */}
        <DocumentListDeleteButton
          documentId={post._id}
          documentType={post._type}
          onDeleted={onDeleted}
        />
      </Flex>
    </Card>
    </>
  );
}

export function PostListWithDelete() {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [creating, setCreating] = useState(false);
  const [newDocId, setNewDocId] = useState<string | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const client = useClient({ apiVersion: '2024-01-01' });
  const mountedRef = useRef(true);

  const onDeleted = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleNewArticle = useCallback(async () => {
    setCreating(true);
    try {
      // Create a new draft post directly
      const doc = await client.create({
        _type: 'post',
        title: 'Artikull i ri',
        publishedAt: new Date().toISOString(),
        featured: false,
        breaking: false,
      });
      // Refresh list to show the new article
      setRefreshKey((k) => k + 1);
      // Store the new doc ID - the IntentLink will be rendered and auto-clicked
      setNewDocId(doc._id);
    } catch (err) {
      console.error('Failed to create article:', err);
    } finally {
      setCreating(false);
    }
  }, [client]);

  // Auto-click the IntentLink when a new document is created
  useEffect(() => {
    if (newDocId && linkRef.current) {
      linkRef.current.click();
      setNewDocId(null);
    }
  }, [newDocId]);

  useEffect(() => {
    mountedRef.current = true;
    client.fetch<PostDoc[]>(POSTS_QUERY).then((result) => {
      if (mountedRef.current) {
        setPosts(result);
        setLoading(false);
      }
    }).catch(() => {
      if (mountedRef.current) setLoading(false);
    });
    return () => {
      mountedRef.current = false;
    };
  }, [client, refreshKey]);

  if (loading && posts.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ padding: 60 }}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Hidden IntentLink for navigating to newly created documents */}
      {newDocId && (
        <IntentLink
          ref={linkRef}
          intent="edit"
          params={{ id: newDocId, type: 'post' }}
          style={{ display: 'none' }}
        >
          Edit
        </IntentLink>
      )}
      {/* Header with count + "+" button */}
      <Flex align="center" justify="space-between" style={{ padding: '4px 0 12px' }}>
        <Text
          size={1}
          muted
          style={{
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontSize: 11,
          }}
        >
          {posts.length} artikuj
        </Text>
        <button
          type="button"
          onClick={handleNewArticle}
          disabled={creating}
          title="Shto artikull të ri"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            padding: 0,
            background: creating ? '#991B1B' : '#DC2626',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: creating ? 'wait' : 'pointer',
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1,
            opacity: creating ? 0.7 : 1,
          }}
        >
          {creating ? '…' : '+'}
        </button>
      </Flex>

      {/* Rows */}
      {posts.map((post) => (
        <PostRow key={post._id} post={post} onDeleted={onDeleted} />
      ))}

      {posts.length === 0 && !loading && (
        <Card padding={4} tone="transparent" style={{ textAlign: 'center' }}>
          <Text muted>Asnjë artikull në databazë.</Text>
          <Text muted size={1} style={{ marginTop: 8 }}>
            Klikoni + për të krijuar artikullin e parë.
          </Text>
        </Card>
      )}
    </div>
  );
}
