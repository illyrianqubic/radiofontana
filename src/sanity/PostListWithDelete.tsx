import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useClient } from 'sanity';
import { IntentLink, useIntentLink } from 'sanity/router';
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
    <Card
      padding={0}
      marginBottom={2}
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
      }}
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

        {/* Delete button — the "-" */}
        <DocumentListDeleteButton
          documentId={post._id}
          documentType={post._type}
          onDeleted={onDeleted}
        />
      </Flex>
    </Card>
  );
}

export function PostListWithDelete() {
  const [posts, setPosts] = useState<PostDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const client = useClient({ apiVersion: '2024-01-01' });
  const mountedRef = useRef(true);
  const newArticleLink = useIntentLink({
    intent: 'create',
    params: { type: 'post' },
  });

  const onDeleted = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleNewArticle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      // Navigate to create a new post using the intent link
      newArticleLink.onClick(e as unknown as React.MouseEvent<HTMLElement>);
    },
    [newArticleLink]
  );

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
          title="Shto artikull të ri"
          data-href={newArticleLink.href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            padding: 0,
            background: '#DC2626',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#B91C1C';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = '#DC2626';
          }}
        >
          +
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
