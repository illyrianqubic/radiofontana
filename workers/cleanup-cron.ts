interface Env {
  CLEANUP_ENDPOINT: string;
  CLEANUP_CRON_SECRET?: string;
}

interface CronController {
  scheduledTime: number;
  cron: string;
}

const cleanupCronWorker = {
  async scheduled(controller: CronController, env: Env): Promise<void> {
    if (!env.CLEANUP_ENDPOINT) {
      throw new Error('Missing CLEANUP_ENDPOINT environment variable');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (env.CLEANUP_CRON_SECRET) {
      headers['x-cleanup-secret'] = env.CLEANUP_CRON_SECRET;
    }

    const response = await fetch(env.CLEANUP_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        source: 'cleanup-cron-worker',
        scheduledTime: new Date(controller.scheduledTime).toISOString(),
        cron: controller.cron,
      }),
    });

    const bodyText = await response.text();
    if (!response.ok) {
      throw new Error(`Cleanup endpoint failed (${response.status}): ${bodyText}`);
    }

    console.log(`[cleanup-cron-worker] trigger OK: ${bodyText}`);
  },
};

export default cleanupCronWorker;
