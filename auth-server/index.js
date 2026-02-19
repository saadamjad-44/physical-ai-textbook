import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import express from 'express';
import cors from 'cors';

// Create Neon Postgres pool
const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Create better-auth instance
export const auth = betterAuth({
    database: pool,
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
    basePath: '/api/auth',
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            softwareExp: {
                type: 'string',
                required: false,
                defaultValue: 'beginner',
            },
            hardwareExp: {
                type: 'string',
                required: false,
                defaultValue: 'none',
            },
            education: {
                type: 'string',
                required: false,
                defaultValue: 'undergrad',
            },
            goals: {
                type: 'string',
                required: false,
                defaultValue: '',
            },
        },
    },
    trustedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://saadamjad-44.github.io',
    ],
});

// Express server
const app = express();
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://saadamjad-44.github.io',
    ],
    credentials: true,
}));

// Mount better-auth handler
app.all('/api/auth/*', (req, res) => {
    return auth.handler(req, res);
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Auth server running', service: 'better-auth' });
});

const PORT = process.env.AUTH_PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Auth server running on http://localhost:${PORT}`);
    console.log(`   better-auth endpoints at http://localhost:${PORT}/api/auth/*`);
});
