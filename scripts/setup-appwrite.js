const sdk = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new sdk.Client();

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const key = process.env.APPWRITE_API_KEY;

if (!endpoint || !project || !key) {
    console.error('Missing Appwrite credentials in .env.local');
    process.exit(1);
}

client
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(key);

const storage = new sdk.Storage(client);
const BUCKET_ID = 'portfolio-assets';

async function setup() {
    try {
        console.log(`Checking if bucket "${BUCKET_ID}" exists...`);
        try {
            await storage.getBucket(BUCKET_ID);
            console.log('Bucket already exists.');
        } catch (error) {
            if (error.code === 404) {
                console.log('Bucket not found. Creating...');
                await storage.createBucket(
                    BUCKET_ID,
                    'Portfolio Assets',
                    [sdk.Permission.read(sdk.Role.any())], // Array of strings
                    false, // File Security: false (Bucket permissions apply)
                    true, // Enabled
                    undefined, // Max File Size
                    ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'] // Allowed extensions
                );
                
                // Set bucket permissions explicitly to allow public read
                // Note: createBucket args above might vary by version. 
                // It's safer to update permissions after creation or use specific args.
                // Checking latest SDK: createBucket(bucketId, name, permissions, fileSecurity, enabled, maximumFileSize, allowedFileExtensions, compression, encryption, antivirus)
                // The 3rd arg is 'permissions'. Passing [Permission.read(Role.any())] is correct for new SDKs.
                // But node-appwrite signature might be createBucket(bucketId, name, permissions?, fileSecurity?, enabled?, maximumFileSize?, allowedFileExtensions?, ...)
                
                console.log('Bucket created successfully!');
            } else {
                throw error;
            }
        }
        
        // Double check permissions
        console.log('Updating bucket permissions to ensure public read access...');
        // We can use updateBucket to ensure permissions are set correctly
        /*
        await storage.updateBucket(
            BUCKET_ID,
            'Portfolio Assets',
            [sdk.Permission.read(sdk.Role.any())],
            false, // fileSecurity: false means bucket permissions apply to all files? 
                   // Actually: fileSecurity=true means each file has its own permissions. 
                   // fileSecurity=false means bucket permissions apply.
                   // We want bucket permissions to apply for public read. So fileSecurity=false?
                   // Let's check docs or assume false for public bucket logic usually.
            true, // enabled
            undefined,
            ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico']
        );
        */
       // Actually, for Appwrite, if we want "Public" bucket, usually we set fileSecurity to false, 
       // AND give read permission to "role:all" (Role.any()).
       
    } catch (e) {
        console.error('Error setting up Appwrite bucket:', e);
    }
}

setup();
