// Cloudflare Pages Function: /api/cleanup
// Scheduled cleanup job: delete Sanity posts older than 30 days.

interface Env {
  NEXT_PUBLIC_SANITY_PROJECT_ID: string;
  NEXT_PUBLIC_SANITY_DATASET: string;
  NEXT_PUBLIC_SANITY_API_VERSION?: string;
  SANITY_WRITE_TOKEN?: string;
}

interface CleanupResult {
  cutoff: string;
  deletedCount: number;
  scannedCount: number;
}

const API_VERSION = '2024-01-01';
const DEFAULT_PROJECT_ID = 'ksakxvtt';
const DEFAULT_DATASET = 'production';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MUTATION_BATCH_SIZE = 100;

const OLD_POST_IDS_QUERY = `*[_type == "post" && defined(publishedAt) && publishedAt < $cutoff && !(_id in path("drafts.**"))]{
  _id
}`;

function getSanityConfig(env: Env) {
  return {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET,
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || API_VERSION,
  };
}

async function fetchOldPostIds(env: Env, cutoffIso: string): Promise<string[]> {
  if (!env.SANITY_WRITE_TOKEN) {
    throw new Error('Missing SANITY_WRITE_TOKEN environment variable');
  }

  const { projectId, dataset, apiVersion } = getSanityConfig(env);
  const url =
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
    `?query=${encodeURIComponent(OLD_POST_IDS_QUERY)}` +
    `&%24cutoff=${encodeURIComponent(JSON.stringify(cutoffIso))}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Sanity query failed: ${res.status}`);
  }

  const data = (await res.json()) as { result?: Array<{ _id?: string }> };
  return (data.result ?? [])
    .map((doc) => doc._id)
    .filter((id): id is string => typeof id === 'string' && id.length > 0);
}

async function deletePostBatch(env: Env, ids: string[]): Promise<void> {
  if (!env.SANITY_WRITE_TOKEN) {
    throw new Error('Missing SANITY_WRITE_TOKEN environment variable');
  }

  if (ids.length === 0) {
    return;
  }

  const { projectId, dataset, apiVersion } = getSanityConfig(env);
  const mutateUrl = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

  const res = await fetch(mutateUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SANITY_WRITE_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      mutations: ids.map((id) => ({ delete: { id } })),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sanity delete failed: ${res.status} ${body}`);
  }
}

async function runCleanup(env: Env): Promise<CleanupResult> {
  const cutoffIso = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
  const oldIds = await fetchOldPostIds(env, cutoffIso);

  let deletedCount = 0;

  for (let i = 0; i < oldIds.length; i += MUTATION_BATCH_SIZE) {
    const batch = oldIds.slice(i, i + MUTATION_BATCH_SIZE);
    await deletePostBatch(env, batch);
    deletedCount += batch.length;
  }

  return {
    cutoff: cutoffIso,
    scannedCount: oldIds.length,
    deletedCount,
  };
}

export async function onScheduled(
  event: { cron: string; scheduledTime: number },
  env: Env,
): Promise<void> {
  const result = await runCleanup(env);
  console.log(
    `[cleanup-cron] ${event.cron} @ ${new Date(event.scheduledTime).toISOString()} deleted=${result.deletedCount} scanned=${result.scannedCount} cutoff=${result.cutoff}`,
  );
}

export async function onRequestPost(context: { env: Env }): Promise<Response> {
  try {
    const result = await runCleanup(context.env);
    console.log(
      `[cleanup-manual] deleted=${result.deletedCount} scanned=${result.scannedCount} cutoff=${result.cutoff}`,
    );
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cleanup failed';
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
