const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const config = require('../config/env');

const LOCAL_UPLOADS_DIR = path.resolve('uploads');

class R2Client {
  constructor() {
    // 1. Native Cloudflare R2 Bucket Binding (when running inside Cloudflare Workers)
    const nativeR2 = globalThis.STORAGE_BUCKET || (globalThis.__CF_ENV__ && globalThis.__CF_ENV__.STORAGE_BUCKET);
    if (nativeR2 && typeof nativeR2.put === 'function') {
      this.nativeR2 = nativeR2;
      this.isNativeR2 = true;
      console.log('☁️ Native Cloudflare R2 Object Storage binding connected');
      return;
    }

    this.isR2Configured = config.cloudflare.r2.isConfigured;
    this.s3Client = null;

    if (this.isR2Configured) {
      const { accountId, accessKeyId, secretAccessKey } = config.cloudflare.r2;
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey
        }
      });
      console.log('☁️ Cloudflare R2 Object Storage client initialized for bucket:', config.cloudflare.r2.bucketName);
    } else {
      console.log('📁 Local Storage active (Fallback mode). Uploads stored at:', LOCAL_UPLOADS_DIR);
      try {
        if (typeof fs.existsSync === 'function' && typeof fs.mkdirSync === 'function') {
          if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
            fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
          }
        }
      } catch (err) {
        // Safe: Cloudflare Workers does not support local fs.mkdirSync
      }
    }
  }

  getNativeR2() {
    if (this.nativeR2) return this.nativeR2;
    const nativeR2 = globalThis.STORAGE_BUCKET || (globalThis.__CF_ENV__ && globalThis.__CF_ENV__.STORAGE_BUCKET);
    if (nativeR2 && typeof nativeR2.put === 'function') {
      this.nativeR2 = nativeR2;
      this.isNativeR2 = true;
      return nativeR2;
    }
    return null;
  }

  // Generate safe unique key
  generateFileKey(originalName) {
    const timestamp = Date.now();
    const cleanName = (originalName || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-');
    return `${timestamp}-${cleanName}`;
  }

  // Upload file buffer
  async uploadFile(buffer, originalName, mimeType) {
    const fileKey = this.generateFileKey(originalName);

    // 1. Native Cloudflare R2 Bucket Binding
    const nativeR2 = this.getNativeR2();
    if (nativeR2) {
      try {
        await nativeR2.put(fileKey, buffer, {
          httpMetadata: { contentType: mimeType || 'application/octet-stream' }
        });
        const publicBase = config.cloudflare.r2.publicUrl || `/uploads`;
        const fileUrl = `${publicBase}/${fileKey}`;
        return {
          fileKey,
          fileUrl,
          originalName,
          mimeType,
          size: buffer ? buffer.length : 0,
          storageType: 'r2'
        };
      } catch (err) {
        console.error('Native Cloudflare R2 Upload failed:', err);
        throw err;
      }
    }

    // 2. AWS S3 SDK Client for Remote R2
    if (this.isR2Configured && this.s3Client) {
      try {
        const command = new PutObjectCommand({
          Bucket: config.cloudflare.r2.bucketName,
          Key: fileKey,
          Body: buffer,
          ContentType: mimeType
        });

        await this.s3Client.send(command);

        const publicBase = config.cloudflare.r2.publicUrl || 
          `https://${config.cloudflare.r2.bucketName}.${config.cloudflare.r2.accountId}.r2.cloudflarestorage.com`;
        const fileUrl = `${publicBase}/${fileKey}`;

        return {
          fileKey,
          fileUrl,
          originalName,
          mimeType,
          size: buffer ? buffer.length : 0,
          storageType: 'r2'
        };
      } catch (err) {
        console.error('Cloudflare R2 Upload failed:', err);
        throw err;
      }
    }

    // 3. Local storage fallback (Node.js VPS mode)
    try {
      const targetPath = path.join(LOCAL_UPLOADS_DIR, fileKey);
      fs.writeFileSync(targetPath, buffer);
      const fileUrl = `/uploads/${fileKey}`;

      return {
        fileKey,
        fileUrl,
        originalName,
        mimeType,
        size: buffer ? buffer.length : 0,
        storageType: 'local'
      };
    } catch (err) {
      console.warn('Local file write skipped:', err.message);
      return {
        fileKey,
        fileUrl: `/uploads/${fileKey}`,
        originalName,
        mimeType,
        size: buffer ? buffer.length : 0,
        storageType: 'memory'
      };
    }
  }

  // Delete file
  async deleteFile(fileKey) {
    const nativeR2 = this.getNativeR2();
    if (nativeR2) {
      try {
        await nativeR2.delete(fileKey);
        return true;
      } catch (err) {
        console.error('Native Cloudflare R2 Delete failed:', err);
        return false;
      }
    }

    if (this.isR2Configured && this.s3Client) {
      try {
        const command = new DeleteObjectCommand({
          Bucket: config.cloudflare.r2.bucketName,
          Key: fileKey
        });
        await this.s3Client.send(command);
        return true;
      } catch (err) {
        console.error('Cloudflare R2 Delete failed:', err);
        return false;
      }
    }

    // Local deletion
    try {
      const targetPath = path.join(LOCAL_UPLOADS_DIR, fileKey);
      if (typeof fs.existsSync === 'function' && fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
        return true;
      }
    } catch (err) {
      console.warn('Local file delete skipped:', err.message);
    }
    return false;
  }

  // List recent uploaded files
  async listFiles() {
    const nativeR2 = this.getNativeR2();
    if (nativeR2) {
      try {
        const listed = await nativeR2.list({ limit: 100 });
        return (listed.objects || []).map(item => ({
          fileKey: item.key,
          fileUrl: `${config.cloudflare.r2.publicUrl || '/uploads'}/${item.key}`,
          size: item.size,
          lastModified: item.uploaded,
          storageType: 'r2'
        }));
      } catch (err) {
        console.error('Native Cloudflare R2 list files error:', err);
        return [];
      }
    }

    if (this.isR2Configured && this.s3Client) {
      try {
        const command = new ListObjectsV2Command({
          Bucket: config.cloudflare.r2.bucketName,
          MaxKeys: 100
        });
        const response = await this.s3Client.send(command);
        return (response.Contents || []).map(item => {
          const publicBase = config.cloudflare.r2.publicUrl || 
            `https://${config.cloudflare.r2.bucketName}.${config.cloudflare.r2.accountId}.r2.cloudflarestorage.com`;
          return {
            fileKey: item.Key,
            fileUrl: `${publicBase}/${item.Key}`,
            size: item.Size,
            lastModified: item.LastModified,
            storageType: 'r2'
          };
        });
      } catch (err) {
        console.error('Cloudflare R2 list files error:', err);
        return [];
      }
    }

    // Local listing
    try {
      if (typeof fs.existsSync === 'function' && !fs.existsSync(LOCAL_UPLOADS_DIR)) return [];
      const files = fs.readdirSync(LOCAL_UPLOADS_DIR);
      return files.map(file => {
        const stats = fs.statSync(path.join(LOCAL_UPLOADS_DIR, file));
        return {
          fileKey: file,
          fileUrl: `/uploads/${file}`,
          size: stats.size,
          lastModified: stats.mtime,
          storageType: 'local'
        };
      });
    } catch (err) {
      return [];
    }
  }
}

const r2Client = new R2Client();
module.exports = r2Client;
