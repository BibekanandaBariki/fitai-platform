import { createAnthropic } from '@ai-sdk/anthropic';

// Explicitly require the key, but fail gracefully if not in dev
export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_for_builds',
});

// Shorthand for our primary intelligent model
export const claudeSonnet = anthropic('claude-3-5-sonnet-20240620');
