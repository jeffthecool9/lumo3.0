import { z } from 'zod';
export const LIMITS = {
  trial: { plans: 3, replies: 50, costMicros: 500_000 },
  paid: { plans: 30, replies: 500, costMicros: 5_000_000 },
} as const;
export const knowledgeSchema = z.object({
  name: z.string().trim().max(100), business: z.string().trim().max(5000), faq: z.string().trim().max(5000),
  language: z.enum(['English', 'Bahasa Melayu', 'English + Bahasa Melayu']), handoff: z.string().trim().max(500),
});
const lines = z.array(z.string().trim().min(1).max(500)).min(1).max(8);
export const planSchema = z.object({
  title: z.string().trim().min(1).max(120), greeting: z.string().trim().min(1).max(1000), questions: lines, rules: lines,
  fallback: z.string().trim().min(1).max(1000), handoff: lines, leadFields: lines,
});
export type Knowledge = z.infer<typeof knowledgeSchema>;
export type PlanContent = z.infer<typeof planSchema>;
export interface Plan { id: string; version: number; content: PlanContent; approved_at: string | null; created_at: string }
export interface ChatMessage { role: 'user' | 'model'; text: string }
export interface WorkspaceState {
  workspace: { id: string; name: string }; knowledge: Knowledge; plans: Plan[];
  billing: { status: string; tier: 'trial' | 'paid' | null; periodEnd: string | null; cancelAtEnd: boolean; review: boolean; trialUsed: boolean; access: boolean };
  usage: { plans: number; replies: number; costMicros: number };
}
export const emptyKnowledge: Knowledge = { name: '', business: '', faq: '', language: 'English', handoff: '' };
