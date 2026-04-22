-- ═══════════════════════════════════════════════════════════════════
--  KAYCEE EXTENSION — PostgreSQL Schema
--  Jalankan ini sekali di database PostgreSQL kamu (Supabase/Neon/etc)
-- ═══════════════════════════════════════════════════════════════════

-- Extension untuk UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
    username    TEXT    UNIQUE NOT NULL,
    avatar      TEXT,
    device_id   TEXT,
    is_banned   BOOLEAN DEFAULT FALSE,
    ban_reason  TEXT,
    last_login  TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users (LOWER(username));
CREATE INDEX IF NOT EXISTS idx_users_banned   ON users (is_banned);

-- ── BANNED DEVICES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banned_devices (
    device_id  TEXT PRIMARY KEY,
    reason     TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── LOGS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS logs (
    id         UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
    username   TEXT    DEFAULT 'Anonim',
    user_id    TEXT,
    action     TEXT,
    details    TEXT,
    version    TEXT,
    ip         TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_created   ON logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_username  ON logs (username);

-- ── SYSTEM SETTINGS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_settings (
    id              SERIAL PRIMARY KEY,
    setting_key     TEXT UNIQUE NOT NULL,
    setting_value   TEXT,
    description     TEXT,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by      TEXT
);

-- Insert default system status
INSERT INTO system_settings (setting_key, setting_value, description, updated_by)
VALUES ('system_status', 'active', 'System lock status: active or locked', 'system')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, description, updated_by)
VALUES ('lock_message', 'System is under maintenance. Please try again later.', 'Message shown when system is locked', 'system')
ON CONFLICT (setting_key) DO NOTHING;
