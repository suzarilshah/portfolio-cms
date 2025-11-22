#!/usr/bin/env node

/**
 * Appwrite Bucket Setup Script
 * Creates document and asset buckets with proper permissions and allowed file extensions
 */

const { Client, Storage, Permission, Role, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Read current .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parse env vars
const getEnvVar = (key) => {
  const match = envContent.match(new RegExp(`^${key}=['"]?([^'"\\n]+)['"]?`, 'm'));
  return match ? match[1] : null;
};

const endpoint = getEnvVar('NEXT_PUBLIC_APPWRITE_ENDPOINT');
const projectId = getEnvVar('NEXT_PUBLIC_APPWRITE_PROJECT_ID');
const apiKey = getEnvVar('APPWRITE_API_KEY');

if (!endpoint || !projectId || !apiKey) {
  console.error('❌ Missing Appwrite credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY');
  process.exit(1);
}

console.log('🚀 Starting Appwrite bucket setup...\n');
console.log(`📍 Endpoint: ${endpoint}`);
console.log(`📦 Project ID: ${projectId}\n`);

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const storage = new Storage(client);

async function createBucket(name, allowedExtensions, description) {
  try {
    console.log(`Creating bucket: ${name}...`);
    
    const bucket = await storage.createBucket(
      ID.unique(),
      name,
      [Permission.read(Role.any())], // Public read by default
      false, // Not file security (bucket-level permissions)
      true,  // Enabled
      undefined, // No size limit
      allowedExtensions,
      'gzip', // Compression
      true, // Encryption
      true  // Antivirus
    );
    
    console.log(`✅ Created bucket: ${name}`);
    console.log(`   ID: ${bucket.$id}`);
    console.log(`   Allowed extensions: ${allowedExtensions.join(', ')}\n`);
    
    return bucket.$id;
  } catch (error) {
    if (error.code === 409) {
      console.log(`⚠️  Bucket "${name}" already exists, listing existing buckets...\n`);
      return null;
    }
    throw error;
  }
}

async function listExistingBuckets() {
  try {
    const buckets = await storage.listBuckets();
    console.log('📋 Existing buckets:');
    buckets.buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (ID: ${bucket.$id})`);
      console.log(`     Extensions: ${bucket.allowedFileExtensions.join(', ') || 'all'}`);
    });
    console.log('');
    return buckets.buckets;
  } catch (error) {
    console.error('❌ Error listing buckets:', error.message);
    return [];
  }
}

async function updateEnvFile(docsBucketId, assetsBucketId) {
  let newEnvContent = envContent;
  
  // Check if variables already exist
  const hasDocsBucket = /^APPWRITE_BUCKET_ID_DOCS=/m.test(envContent);
  const hasAssetsBucket = /^APPWRITE_BUCKET_ID_ASSETS=/m.test(envContent);
  
  if (hasDocsBucket) {
    newEnvContent = newEnvContent.replace(
      /^APPWRITE_BUCKET_ID_DOCS=.*/m,
      `APPWRITE_BUCKET_ID_DOCS='${docsBucketId}'`
    );
  } else {
    newEnvContent += `APPWRITE_BUCKET_ID_DOCS='${docsBucketId}'\n`;
  }
  
  if (hasAssetsBucket) {
    newEnvContent = newEnvContent.replace(
      /^APPWRITE_BUCKET_ID_ASSETS=.*/m,
      `APPWRITE_BUCKET_ID_ASSETS='${assetsBucketId}'`
    );
  } else {
    newEnvContent += `APPWRITE_BUCKET_ID_ASSETS='${assetsBucketId}'\n`;
  }
  
  fs.writeFileSync(envPath, newEnvContent);
  console.log('✅ Updated .env.local with bucket IDs\n');
}

async function main() {
  try {
    // First, list existing buckets
    const existingBuckets = await listExistingBuckets();
    
    // Check if we already have suitable buckets
    const docsBucket = existingBuckets.find(b => 
      b.name.toLowerCase().includes('doc') || 
      b.allowedFileExtensions.includes('pdf')
    );
    
    const assetsBucket = existingBuckets.find(b => 
      b.name.toLowerCase().includes('asset') || 
      b.name.toLowerCase().includes('image') ||
      b.allowedFileExtensions.includes('png')
    );
    
    let docsBucketId = docsBucket?.$id;
    let assetsBucketId = assetsBucket?.$id;
    
    // Create buckets if they don't exist
    if (!docsBucketId) {
      docsBucketId = await createBucket(
        'portfolio-documents',
        ['pdf', 'doc', 'docx'],
        'Portfolio documents including resume and CVs'
      );
    } else {
      console.log(`✅ Using existing docs bucket: ${docsBucket.name} (${docsBucketId})\n`);
    }
    
    if (!assetsBucketId) {
      assetsBucketId = await createBucket(
        'portfolio-assets',
        ['png', 'jpg', 'jpeg', 'svg', 'webp', 'ico', 'gif'],
        'Portfolio images including logos, photos, and icons'
      );
    } else {
      console.log(`✅ Using existing assets bucket: ${assetsBucket.name} (${assetsBucketId})\n`);
    }
    
    // Update .env.local if we have bucket IDs
    if (docsBucketId && assetsBucketId) {
      await updateEnvFile(docsBucketId, assetsBucketId);
      
      console.log('🎉 Setup complete!\n');
      console.log('📝 Configuration:');
      console.log(`   Documents Bucket: ${docsBucketId}`);
      console.log(`   Assets Bucket: ${assetsBucketId}\n`);
      console.log('⚠️  Please restart your Next.js dev server for changes to take effect.');
    } else {
      console.error('❌ Could not determine bucket IDs. Please create buckets manually in Appwrite Console.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

main();
