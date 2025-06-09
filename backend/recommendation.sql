-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS recommendations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    salary INTEGER,
    creditScore INTEGER,
    employmentYears INTEGER,
    loanType TEXT,
    requestedAmount INTEGER,
    riskLevel TEXT,
    employmentType TEXT,
    monthlyExpenses INTEGER,
    assets INTEGER,
    previousLoans INTEGER,
    avatar TEXT
);

-- Step 2: Insert data
INSERT INTO recommendations (id, name, email, phone, age, salary, creditScore, employmentYears, loanType, requestedAmount, riskLevel, employmentType, monthlyExpenses, assets, previousLoans, avatar) VALUES
('1', 'Sarah Johnson', 'sarah.johnson@email.com', '+1 (555) 123-4567', 32, 85000, 780, 8, 'house', 450000, 'low', 'Full-time', 3200, 120000, 1, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('2', 'Michael Chen', 'michael.chen@email.com', '+1 (555) 234-5678', 28, 62000, 720, 5, 'car', 35000, 'low', 'Full-time', 2800, 45000, 0, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('3', 'Emily Rodriguez', 'emily.rodriguez@email.com', '+1 (555) 345-6789', 35, 92000, 820, 12, 'business', 150000, 'low', 'Self-employed', 4100, 280000, 2, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('4', 'David Thompson', 'david.thompson@email.com', '+1 (555) 456-7890', 41, 68000, 680, 15, 'personal', 25000, 'medium', 'Full-time', 3600, 85000, 3, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('5', 'Lisa Anderson', 'lisa.anderson@email.com', '+1 (555) 567-8901', 29, 78000, 750, 6, 'house', 380000, 'low', 'Full-time', 2900, 95000, 1, 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('6', 'James Wilson', 'james.wilson@email.com', '+1 (555) 678-9012', 33, 55000, 640, 9, 'car', 28000, 'medium', 'Full-time', 3100, 32000, 2, 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('7', 'Maria Garcia', 'maria.garcia@email.com', '+1 (555) 789-0123', 38, 110000, 800, 14, 'business', 200000, 'low', 'Self-employed', 4800, 350000, 1, 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'),
('8', 'Robert Taylor', 'robert.taylor@email.com', '+1 (555) 890-1234', 26, 48000, 600, 3, 'personal', 15000, 'high', 'Full-time', 2400, 18000, 1, 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop');
