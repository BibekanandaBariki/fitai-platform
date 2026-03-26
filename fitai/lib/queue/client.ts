import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Ensure standard Redis connection URL format
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required by BullMQ
});

// Main Queue for all async background operations
export const fitaiQueue = new Queue('fitai-main-queue', { 
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: 100, // Keep last 100 successful jobs
        removeOnFail: 1000,    // Keep last 1000 failed jobs for debugging
    }
});

// Helper functions for common queue operations
export async function scheduleHealthSync(userId: string) {
    return fitaiQueue.add('sync-apple-health', { userId });
}

export async function scheduleEmail(to: string, templateId: string, payload: any) {
    return fitaiQueue.add('send-transactional-email', { to, templateId, payload });
}

export async function schedulePlateauDetection(userId: string, exerciseId: string) {
    return fitaiQueue.add('detect-plateau', { userId, exerciseId });
}
