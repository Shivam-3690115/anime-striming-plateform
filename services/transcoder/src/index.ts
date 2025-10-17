import express from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import ffmpeg from 'fluent-ffmpeg';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { createWriteStream } from 'fs';
import { createReadStream } from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Create transcoding queue
const transcodingQueue = new Queue('transcoding', { connection });

// Transcode job processor
const worker = new Worker(
  'transcoding',
  async (job) => {
    const { videoUrl, animeId, episodeId } = job.data;
    
    console.log(`Processing transcoding job for anime ${animeId}, episode ${episodeId}`);

    try {
      // Download video from S3
      const inputPath = `/tmp/input-${episodeId}.mp4`;
      const outputDir = `/tmp/output-${episodeId}`;

      // Transcode to HLS with multiple bitrates
      await transcodeToHLS(inputPath, outputDir);

      // Upload to S3
      await uploadToS3(outputDir, animeId, episodeId);

      // Clean up temporary files
      // fs.rmSync(inputPath);
      // fs.rmSync(outputDir, { recursive: true });

      return { success: true };
    } catch (error) {
      console.error('Transcoding error:', error);
      throw error;
    }
  },
  { connection }
);

async function transcodeToHLS(inputPath: string, outputDir: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        // 1080p
        '-map 0:v:0',
        '-map 0:a:0',
        '-c:v:0 libx264',
        '-b:v:0 5000k',
        '-s:v:0 1920x1080',
        '-c:a:0 aac',
        '-b:a:0 192k',
        // 720p
        '-map 0:v:0',
        '-map 0:a:0',
        '-c:v:1 libx264',
        '-b:v:1 2800k',
        '-s:v:1 1280x720',
        '-c:a:1 aac',
        '-b:a:1 128k',
        // 480p
        '-map 0:v:0',
        '-map 0:a:0',
        '-c:v:2 libx264',
        '-b:v:2 1400k',
        '-s:v:2 854x480',
        '-c:a:2 aac',
        '-b:a:2 96k',
        // HLS options
        '-f hls',
        '-hls_time 6',
        '-hls_playlist_type vod',
        '-hls_segment_filename', `${outputDir}/segment_%v_%03d.ts`,
        '-master_pl_name', 'master.m3u8',
        '-var_stream_map', 'v:0,a:0 v:1,a:1 v:2,a:2',
      ])
      .output(`${outputDir}/stream_%v.m3u8`)
      .on('end', () => {
        console.log('Transcoding completed');
        resolve(true);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .run();
  });
}

async function uploadToS3(outputDir: string, animeId: string, episodeId: string) {
  // Upload all files in output directory to S3
  // This is a simplified version
  console.log(`Uploading to S3: s3://bucket/${animeId}/${episodeId}/`);
  
  // TODO: Implement actual S3 upload
  // const files = fs.readdirSync(outputDir);
  // for (const file of files) {
  //   await s3Client.send(new PutObjectCommand({
  //     Bucket: process.env.AWS_S3_BUCKET,
  //     Key: `${animeId}/${episodeId}/${file}`,
  //     Body: fs.readFileSync(path.join(outputDir, file)),
  //   }));
  // }
}

// API endpoints
app.post('/transcode', async (req, res) => {
  const { videoUrl, animeId, episodeId } = req.body;

  const job = await transcodingQueue.add('transcode', {
    videoUrl,
    animeId,
    episodeId,
  });

  res.json({ jobId: job.id, status: 'queued' });
});

app.get('/status/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const job = await transcodingQueue.getJob(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const state = await job.getState();
  const progress = job.progress;

  res.json({ jobId, state, progress });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'transcoder' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Transcoder service running on port ${PORT}`);
});
