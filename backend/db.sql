CREATE TABLE IF NOT EXISTS datasets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO datasets (name, data, type) VALUES 
(
  'Sales Data',
  '[
    {"month": "Jan", "sales": 1200, "revenue": 15000},
    {"month": "Feb", "sales": 1900, "revenue": 23000},
    {"month": "Mar", "sales": 3000, "revenue": 35000},
    {"month": "Apr", "sales": 5000, "revenue": 58000},
    {"month": "May", "sales": 4200, "revenue": 48000},
    {"month": "Jun", "sales": 3800, "revenue": 42000}
  ]'::jsonb,
  'time_series'
);

INSERT INTO datasets (name, data, type, created_at, updated_at) VALUES
(
  'Product Categories',
  '[
    { "category": "Electronics", "value": 35 },
    { "category": "Clothing", "value": 25 },
    { "category": "Books", "value": 15 },
    { "category": "Home & Garden", "value": 15 },
    { "category": "Sports", "value": 10 }
  ]'::jsonb,
  'categorical',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Age Distribution',
  '[
    {"age": 18, "count": 67},
    {"age": 19, "count": 84},
    {"age": 20, "count": 56},
    {"age": 21, "count": 71},
    {"age": 22, "count": 93},
    {"age": 23, "count": 42},
    {"age": 24, "count": 58},
    {"age": 25, "count": 76},
    {"age": 26, "count": 61},
    {"age": 27, "count": 45},
    {"age": 28, "count": 97},
    {"age": 29, "count": 62},
    {"age": 30, "count": 88},
    {"age": 31, "count": 41},
    {"age": 32, "count": 54},
    {"age": 33, "count": 73},
    {"age": 34, "count": 80},
    {"age": 35, "count": 50},
    {"age": 36, "count": 78},
    {"age": 37, "count": 61},
    {"age": 38, "count": 64},
    {"age": 39, "count": 43},
    {"age": 40, "count": 91},
    {"age": 41, "count": 59},
    {"age": 42, "count": 39},
    {"age": 43, "count": 55},
    {"age": 44, "count": 68},
    {"age": 45, "count": 47},
    {"age": 46, "count": 74},
    {"age": 47, "count": 82},
    {"age": 48, "count": 65},
    {"age": 49, "count": 60},
    {"age": 50, "count": 40},
    {"age": 51, "count": 86},
    {"age": 52, "count": 33},
    {"age": 53, "count": 52},
    {"age": 54, "count": 46},
    {"age": 55, "count": 89},
    {"age": 56, "count": 38},
    {"age": 57, "count": 70},
    {"age": 58, "count": 48},
    {"age": 59, "count": 66},
    {"age": 60, "count": 49},
    {"age": 61, "count": 75},
    {"age": 62, "count": 63},
    {"age": 63, "count": 51},
    {"age": 64, "count": 69},
    {"age": 65, "count": 44},
    {"age": 66, "count": 53 },
    {"age": 67, "count": 87}
  ]'::jsonb,
  'distribution',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);