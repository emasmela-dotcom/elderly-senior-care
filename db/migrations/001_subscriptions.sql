-- Run once in Neon if subscriptions table is missing (existing installs).

CREATE TABLE IF NOT EXISTS subscriptions (
  user_email TEXT PRIMARY KEY,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_interval TEXT,
  trial_end TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
