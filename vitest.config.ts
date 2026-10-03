import {defineConfig} from 'vitest/config';
export default defineConfig({test:{
  include:['tests/**/*.test.{ts,tsx}'],testTimeout:20000,hookTimeout:30000,pool:'forks',maxWorkers:1,
  // Local integration credentials must never affect isolated tests.
  env:{
    FIREBASE_API_KEY:'',FIREBASE_AUTH_DOMAIN:'',FIREBASE_PROJECT_ID:'',FIREBASE_APP_ID:'',
    FIREBASE_CLIENT_EMAIL:'',FIREBASE_PRIVATE_KEY:'',FIREBASE_SERVICE_ACCOUNT_JSON:'',GOOGLE_APPLICATION_CREDENTIALS:'',
    AUTH_GOOGLE_ENABLED:'false',AUTH_EMAIL_ENABLED:'false',AUTH_PHONE_ENABLED:'false',
    SUPABASE_URL:'',SUPABASE_SERVICE_ROLE_KEY:'',
    STRIPE_SECRET_KEY:'',STRIPE_PRICE_ID:'',STRIPE_WEBHOOK_SECRET:'',IDENTITY_HASH_SECRET:'',
    GEMINI_API_KEY:'',AI_ENABLED:'false',AI_PRICING_VERIFIED:'false',
  },
}});
