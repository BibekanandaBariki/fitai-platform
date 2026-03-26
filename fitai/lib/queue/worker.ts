import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';

// Ensure standard Redis connection URL format
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

console.log('👷 FitAI Background Worker starting up...');

const worker = new Worker('fitai-main-queue', async (job: Job) => {
    switch (job.name) {
        case 'sync-apple-health':
            await handleHealthSync(job.data);
            break;
        case 'send-transactional-email':
            await handleEmailSend(job.data);
            break;
        case 'detect-plateau':
            await handlePlateauDetection(job.data);
            break;
        default:
            console.error(`Unknown job type: ${job.name}`);
    }
}, { connection });

// Job Handlers

async function handleHealthSync(data: { userId: string }) {
    console.log(`[Job: sync-apple-health] Syncing data for user: ${data.userId}`);
    // Simulate Apple HealthKit / Google Fit API sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[Job: sync-apple-health] Successfully synced 400 heart rate data points for user: ${data.userId}`);
}

async function handleEmailSend(data: { to: string, templateId: string, payload: any }) {
    console.log(`[Job: send-email] Sending ${data.templateId} to ${data.to}`);
    // Simulate Resend / AWS SES delivery
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`[Job: send-email] Delivered email successfully to ${data.to}`);
}

async function handlePlateauDetection(data: { userId: string, exerciseId: string }) {
    console.log(`[Job: detect-plateau] Calling ML Service to detect plateau on exercise: ${data.exerciseId}`);
    // Simulate ML microservice API call via HTTP
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`[Job: detect-plateau] ML Service returned: {'is_plateau': false}`);
}

worker.on('completed', job => {
    console.log(`✅ Job ${job.id} (${job.name}) completed successfully!`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.id} failed with error:`, err.message);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    process.exit(0);
});
