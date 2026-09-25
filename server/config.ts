import 'dotenv/config';
import { z } from 'zod';
const env = z.object({
  NODE_ENV: z.string().default('development'), PORT: z.coerce.number().default(3001),
  HOST: z.string().default('127.0.0.1'),
  APP_URL: z.string().url().default(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:5173'),
  SUPABASE_URL: z.string().default(''), SUPABASE_SERVICE_ROLE_KEY: z.string().default(''),
  FIREBASE_API_KEY: z.string().default(''), FIREBASE_AUTH_DOMAIN: z.string().default(''),
  FIREBASE_PROJECT_ID: z.string().default(''), FIREBASE_APP_ID: z.string().default(''),
  FIREBASE_CLIENT_EMAIL: z.string().default(''), FIREBASE_PRIVATE_KEY: z.string().default(''),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().default(''),
  STRIPE_PUBLISHABLE_KEY: z.string().default(''), STRIPE_SECRET_KEY: z.string().default(''), STRIPE_WEBHOOK_SECRET: z.string().default(''), STRIPE_PRICE_ID: z.string().default(''),
  ALLOW_LIVE_BILLING: z.enum(['true', 'false']).default('false'),
  GEMINI_API_KEY: z.string().default(''), GEMINI_MODEL: z.string().default('gemini-2.5-flash-lite'),
  AI_INPUT_USD_PER_MILLION: z.coerce.number().positive().default(0.10), AI_OUTPUT_USD_PER_MILLION: z.coerce.number().positive().default(0.40),
  AI_ENABLED: z.enum(['true', 'false']).default('false'), AI_PRICING_VERIFIED: z.enum(['true', 'false']).default('false'),
  IDENTITY_HASH_SECRET: z.string().default(''),
  RESEND_API_KEY: z.string().default(''), EMAIL_FROM: z.string().default(''),
}).parse(process.env);
if (env.STRIPE_SECRET_KEY.startsWith('sk_live_') && env.ALLOW_LIVE_BILLING !== 'true') throw new Error('Live billing is disabled. Use Stripe test keys until launch checks pass.');
export const config = env;
export const readiness = {
  auth: Boolean(env.FIREBASE_API_KEY && env.FIREBASE_AUTH_DOMAIN && env.FIREBASE_PROJECT_ID && env.FIREBASE_APP_ID),
  authServer: Boolean(env.FIREBASE_PROJECT_ID && ((env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) || env.GOOGLE_APPLICATION_CREDENTIALS)),
  database: Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY),
  billing: Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID && env.STRIPE_WEBHOOK_SECRET && env.IDENTITY_HASH_SECRET.length >= 32),
  ai: Boolean(env.GEMINI_API_KEY && env.AI_ENABLED === 'true' && env.AI_PRICING_VERIFIED === 'true'),
};
