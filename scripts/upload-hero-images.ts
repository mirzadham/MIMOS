import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Safely load environment variables from .env file since standalone scripts using tsx
// won't automatically parse Next.js environment configuration.
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.substring(0, eqIdx).trim();
        let val = trimmed.substring(eqIdx + 1).trim();
        // Remove surrounding quotes if they exist
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  });
}

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL as string;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
  console.error("Error: Missing Cloudflare R2 credentials/configuration in .env file.");
  console.error("Required variables: CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, CLOUDFLARE_R2_BUCKET_NAME, CLOUDFLARE_R2_PUBLIC_URL");
  process.exit(1);
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadFile(localPath: string, r2Key: string, contentType: string): Promise<string | null> {
  const absolutePath = path.resolve(process.cwd(), localPath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: Local file not found at ${absolutePath}`);
    return null;
  }

  const fileStats = fs.statSync(absolutePath);
  console.log(`Reading local file: ${localPath} (${(fileStats.size / (1024 * 1024)).toFixed(2)} MB)`);
  const fileBuffer = fs.readFileSync(absolutePath);

  console.log(`Uploading to R2: Bucket="${bucketName}", Key="${r2Key}"...`);
  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: r2Key,
      Body: fileBuffer,
      ContentType: contentType,
    }));
    
    const cdnUrl = `${publicUrl.replace(/\/$/, '')}/${r2Key}`;
    console.log(`Success! File uploaded successfully.`);
    console.log(`Public URL: ${cdnUrl}\n`);
    return cdnUrl;
  } catch (error) {
    console.error(`Failed to upload ${localPath}:`, error);
    throw error;
  }
}

async function main() {
  console.log("=== Start Cloudflare R2 Hero Background Upload ===\n");
  
  const khtpCdnUrl = await uploadFile('public/images/khtp.png', 'hero/khtp.png', 'image/png');
  const tpmCdnUrl = await uploadFile('public/images/tpm.png', 'hero/tpm.png', 'image/png');
  
  console.log("=== Upload Completed Successfully ===");
  console.log("Use the following URLs in your HeroSection.tsx background array:");
  console.log(`- KHTP Image: ${khtpCdnUrl}`);
  console.log(`- TPM Image:  ${tpmCdnUrl}`);
}

main().catch(err => {
  console.error("Fatal Error during upload execution:", err);
  process.exit(1);
});
