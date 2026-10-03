import { createClient } from '@supabase/supabase-js';
import { config, readiness } from './config.js';
import { AppError } from './policy.js';
export const db = readiness.database ? createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
export function database() { if (!db) throw new AppError(503, 'Account services are not connected yet. Explore the sample workspace meanwhile.'); return db; }
export async function rpc(name: string, args: Record<string, unknown>) {
  const { data, error } = await database().rpc(name, args);
  if (error) throw new AppError(409, error.code === 'P0001' ? error.message : 'The operation could not be saved. Please retry.');
  return data;
}
export async function checked<T extends { error: any; data: any }>(result: PromiseLike<T>): Promise<T['data']> {
  const { data, error } = await result;
  if (error) throw new AppError(503, 'Storage is temporarily unavailable. Please retry.');
  return data;
}
