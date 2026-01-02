import { ReactNode } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface PricingTier {
  name: string;
  price: string;
  subPrice?: string;
  description?: string;
  features: string[];
  recommended?: boolean;
  ctaText?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}