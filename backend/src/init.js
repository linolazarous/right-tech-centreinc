// This file is designed to safely load environment variables before the main server imports.
import * as dotenv from 'dotenv';
dotenv.config();

console.log('✅ Environment variables loaded successfully.');
// The server will now proceed to load the main application.

