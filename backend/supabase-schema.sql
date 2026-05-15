-- Supabase/Postgres schema for the food redistribution backend

create extension if not exists "pgcrypto";

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password text not null,
  role text not null default 'Donor',
  org_type text,
  phone text,
  address text,
  location jsonb,
  is_verified boolean not null default false,
  profile_image text,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_users_role on users(role);
create index idx_users_email on users(email);

create table donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references users(id) on delete cascade,
  function_name text not null,
  food_type text not null default 'Veg',
  servings integer not null,
  expiry_hours integer not null default 6,
  pickup_area text not null,
  notes text,
  location jsonb,
  status text not null default 'pending',
  priority text not null default 'normal',
  receiver_id uuid references users(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_donations_status on donations(status);
create index idx_donations_created_at on donations(created_at desc);
create index idx_donations_priority on donations(priority);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  message text not null,
  description text,
  priority text not null default 'normal',
  recipient_id uuid references users(id),
  target_role text not null default 'all',
  related_donation_id uuid references donations(id),
  related_match_id uuid,
  related_event_id uuid,
  read boolean not null default false,
  read_at timestamptz,
  acknowledged boolean not null default false,
  delivery_methods jsonb not null default '{"inApp": true, "email": false, "sms": false, "push": false}',
  delivery_status jsonb not null default '{"inApp": true, "email": false, "sms": false, "push": false}',
  action_url text,
  view_count integer not null default 0,
  click_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_notifications_recipient_read_created on notifications(recipient_id, read, created_at desc);
create index idx_notifications_priority_created on notifications(priority, created_at desc);
create index idx_notifications_expires_at on notifications(expires_at);
