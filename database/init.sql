\c coinswap;

CREATE TYPE application_status AS ENUM ('new', 'in_process', 'completed', 'rejected');
CREATE TYPE application_blockchain_type AS ENUM ('trc20', 'bep20', 'ton');
CREATE TYPE application_type AS ENUM ('buy', 'sell');
CREATE TYPE application_sell_currency AS ENUM ('RUB');
CREATE TYPE application_buy_currency AS ENUM ('RUB');

-- Users table with custom User ID format (8 characters: digits + uppercase letters)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(8) PRIMARY KEY CHECK (
        LENGTH(id) = 8 AND 
        id ~ '^[0-9A-Z]{8}$'
    ),
    tg_first_name VARCHAR(50),
    tg_last_name VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    username VARCHAR(50),
    telegram_id BIGINT NOT NULL UNIQUE,
    has_kyc BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buy USDT applications with ULID format (26 characters)
CREATE TABLE IF NOT EXISTS buy_usdt_applications (
    id VARCHAR(26) PRIMARY KEY CHECK (
        LENGTH(id) = 26 AND 
        id ~ '^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$'
    ),
    status application_status NOT NULL DEFAULT 'new',
    type application_type NOT NULL DEFAULT 'buy',
    sell_currency application_sell_currency NOT NULL,
    sell_amount NUMERIC(15, 2) NOT NULL CHECK (
        sell_currency = 'RUB' AND sell_amount >= 70000
    ),
    buy_amount NUMERIC(15, 2) NOT NULL CHECK (
        buy_amount > 0
    ),
    blockchain application_blockchain_type NOT NULL,
    crypto_address VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    patronymic VARCHAR(50),
    creation_usdt_rub_rate NUMERIC(10, 4) NOT NULL CHECK (creation_usdt_rub_rate > 0),
    user_id VARCHAR(8) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Sell USDT applications with ULID format (26 characters)
CREATE TABLE IF NOT EXISTS sell_usdt_applications (
    id VARCHAR(26) PRIMARY KEY CHECK (
        LENGTH(id) = 26 AND 
        id ~ '^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$'
    ),
    status application_status NOT NULL DEFAULT 'new',
    type application_type NOT NULL DEFAULT 'sell',
    buy_currency application_buy_currency NOT NULL,
    buy_amount NUMERIC(15, 2) NOT NULL CHECK (
        buy_currency = 'RUB' AND buy_amount > 0
    ),
    sell_amount NUMERIC(15, 2) NOT NULL CHECK (
        sell_amount >= 1000
    ),
    blockchain application_blockchain_type NOT NULL,
    crypto_address VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    patronymic VARCHAR(50),
    creation_usdt_rub_rate NUMERIC(10, 4) NOT NULL CHECK (creation_usdt_rub_rate > 0),
    user_id VARCHAR(8) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- USD to RUB exchange rates
CREATE TABLE IF NOT EXISTS usdt_rub_rates (
    timestamp TIMESTAMP WITHOUT TIME ZONE PRIMARY KEY,
    rate NUMERIC(10, 4) NOT NULL CHECK (rate > 0)
);

-- INSERT BOILERPLATE TEST DATA

-- Insert sample USDT/RUB exchange rates
INSERT INTO usdt_rub_rates (timestamp, rate) VALUES 
    ('2024-01-15 10:00:00', 92.5000),
    ('2024-01-15 12:00:00', 92.7500),
    ('2024-01-15 14:00:00', 93.0000),
    ('2024-01-15 16:00:00', 92.8500);

-- Insert test user with custom 8-character ID (digits + uppercase letters)
INSERT INTO users (
    id, 
    tg_first_name, 
    tg_last_name, 
    first_name, 
    last_name, 
    username, 
    telegram_id, 
    has_kyc
) VALUES (
    'A1B2C3D4',
    'Ivan',
    'Petrov', 
    'Иван',
    'Петров',
    'ivan_petrov_228',
    123456789012,
    TRUE
);

INSERT INTO buy_usdt_applications (
    id,
    status,
    sell_currency,
    sell_amount,
    buy_amount,
    blockchain,
    crypto_address,
    first_name,
    last_name,
    patronymic,
    creation_usdt_rub_rate,
    user_id,
    created_at,
    updated_at
) VALUES 
(
    '01HN6Y8QK5F2M3N4P5Q6R7S8T9',  -- 26-character ULID-like ID
    'new',
    'RUB',
    100000.00,
    1080.00,
    'trc20',
    'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    'Иван',
    'Петров',
    'Сергеевич',
    92.5000,
    'A1B2C3D4',
    '2024-01-15 10:30:00+00',
    '2024-01-15 10:30:00+00'
),
(
    '01HN6Y9QK5F2M3N4P5Q6R7S8T0',  -- 26-character ULID-like ID
    'in_process',
    'RUB',
    150000.00,
    1620.00,
    'bep20',
    '0x742d35Cc6634C0532925a3b8D6Cc6A04e2f2c7A2',
    'Иван',
    'Петров',
    'Сергеевич',
    92.7500,
    'A1B2C3D4',
    '2024-01-15 12:15:00+00',
    '2024-01-15 12:15:00+00'
);

-- Insert test sell USDT applications with ULID format (26 characters)
INSERT INTO sell_usdt_applications (
    id,
    status,
    buy_currency,
    buy_amount,
    sell_amount,
    blockchain,
    crypto_address,
    first_name,
    last_name,
    patronymic,
    creation_usdt_rub_rate,
    user_id,
    created_at,
    updated_at
) VALUES 
(
    '01HN6YAQK5F2M3N4P5Q6R7S8T1',  -- 26-character ULID-like ID
    'completed',
    'RUB',
    92500.00,
    1000.00,
    'trc20',
    'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    'Иван',
    'Петров',
    'Сергеевич',
    92.5000,
    'A1B2C3D4',
    '2024-01-15 09:00:00+00',
    '2024-01-15 09:00:00+00'
),
(
    '01HN6YBQK5F2M3N4P5Q6R7S8T2',  -- 26-character ULID-like ID
    'new',
    'RUB',
    139200.00,
    1500.00,
    'ton',
    'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
    'Иван',
    'Петров',
    'Сергеевич',
    92.8000,
    'A1B2C3D4',
    '2024-01-15 14:45:00+00',
    '2024-01-15 14:45:00+00'
);
