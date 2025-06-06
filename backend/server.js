const express = require('express');
const cors = require('cors');
//const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

// import express from 'express';
// import cors from 'cors';
// import multer from 'multer';
// import csv from 'csv-parser';
// import fs from 'fs';
// import path from 'path';
// import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const datasetroute = require('./routes/datasetroute');

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// // File upload configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only CSV and JSON files are allowed'));
//     }
//   }
// });

app.use('/api/datasets', datasetroute);

// In-memory data store (in production, use a proper database)
// let datasets = [
//   {
//     id: '1',
//     name: 'Sales Data',
//     data: [
//       { month: 'Jan', sales: 1200, revenue: 15000 },
//       { month: 'Feb', sales: 1900, revenue: 23000 },
//       { month: 'Mar', sales: 3000, revenue: 35000 },
//       { month: 'Apr', sales: 5000, revenue: 58000 },
//       { month: 'May', sales: 4200, revenue: 48000 },
//       { month: 'Jun', sales: 3800, revenue: 42000 }
//     ],
//     type: 'time_series',
//     createdAt: new Date().toISOString()
//   },
//   {
//     id: '2',
//     name: 'Product Categories',
//     data: [
//       { category: 'Electronics', value: 35 },
//       { category: 'Clothing', value: 25 },
//       { category: 'Books', value: 15 },
//       { category: 'Home & Garden', value: 15 },
//       { category: 'Sports', value: 10 }
//     ],
//     type: 'categorical',
//     createdAt: new Date().toISOString()
//   },
//   {
//     id: '3',
//     name: 'Age Distribution',
//     data: Array.from({ length: 50 }, (_, i) => ({
//       age: 18 + i,
//       count: Math.floor(Math.random() * 100) + 10
//     })),
//     type: 'distribution',
//     createdAt: new Date().toISOString()
//   }
// ];

// // Routes

// // Get all datasets
// app.get('/api/datasets', (req, res) => {
//   const datasetsInfo = datasets.map(({ id, name, type, createdAt }) => ({
//     id,
//     name,
//     type,
//     createdAt,
//     dataPoints: datasets.find(d => d.id === id)?.data.length || 0
//   }));
//   res.json(datasetsInfo);
// });

// // Get specific dataset
// app.get('/api/datasets/:id', (req, res) => {
//   const dataset = datasets.find(d => d.id === req.params.id);
//   if (!dataset) {
//     return res.status(404).json({ error: 'Dataset not found' });
//   }
//   res.json(dataset);
// });

// // Create new dataset
// app.post('/api/datasets', (req, res) => {
//   const { name, data, type } = req.body;
  
//   if (!name || !data || !Array.isArray(data)) {
//     return res.status(400).json({ error: 'Invalid dataset format' });
//   }

//   const newDataset = {
//     id: Date.now().toString(),
//     name,
//     data,
//     type: type || 'generic',
//     createdAt: new Date().toISOString()
//   };

//   datasets.push(newDataset);
//   res.status(201).json(newDataset);
// });

// // Update dataset
// app.put('/api/datasets/:id', (req, res) => {
//   const datasetIndex = datasets.findIndex(d => d.id === req.params.id);
//   if (datasetIndex === -1) {
//     return res.status(404).json({ error: 'Dataset not found' });
//   }

//   const { name, data, type } = req.body;
//   datasets[datasetIndex] = {
//     ...datasets[datasetIndex],
//     name: name || datasets[datasetIndex].name,
//     data: data || datasets[datasetIndex].data,
//     type: type || datasets[datasetIndex].type,
//     updatedAt: new Date().toISOString()
//   };

//   res.json(datasets[datasetIndex]);
// });

// // Delete dataset
// app.delete('/api/datasets/:id', (req, res) => {
//   const datasetIndex = datasets.findIndex(d => d.id === req.params.id);
//   if (datasetIndex === -1) {
//     return res.status(404).json({ error: 'Dataset not found' });
//   }

//   datasets.splice(datasetIndex, 1);
//   res.status(204).send();
// });

// Upload CSV file
// app.post('/api/upload/csv', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const results = [];
//   const filePath = req.file.path;

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (data) => results.push(data))
//     .on('end', () => {
//       // Clean up uploaded file
//       fs.unlinkSync(filePath);

//       const newDataset = {
//         id: Date.now().toString(),
//         name: req.file.originalname.replace('.csv', ''),
//         data: results,
//         type: 'uploaded',
//         createdAt: new Date().toISOString()
//       };

//       datasets.push(newDataset);
//       res.json(newDataset);
//     })
//     .on('error', (error) => {
//       fs.unlinkSync(filePath);
//       res.status(500).json({ error: 'Error processing CSV file' });
//     });
// });

// Generate sample data
// app.post('/api/generate/:type', (req, res) => {
//   const { type } = req.params;
//   const { count = 50, name = `Generated ${type} Data` } = req.body;

//   let data = [];

//   switch (type) {
//     case 'linear':
//       data = Array.from({ length: count }, (_, i) => ({
//         x: i,
//         y: i * 2 + Math.random() * 10 - 5
//       }));
//       break;
    
//     case 'normal':
//       data = Array.from({ length: count }, () => {
//         const u1 = Math.random();
//         const u2 = Math.random();
//         const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
//         return { value: z0 * 10 + 50 };
//       });
//       break;
    
//     case 'exponential':
//       data = Array.from({ length: count }, (_, i) => ({
//         x: i,
//         y: Math.exp(i * 0.1) + Math.random() * 5
//       }));
//       break;
    
//     default:
//       return res.status(400).json({ error: 'Invalid data type' });
//   }

//   const newDataset = {
//     id: Date.now().toString(),
//     name,
//     data,
//     type: 'generated',
//     createdAt: new Date().toISOString()
//   };

//   datasets.push(newDataset);
//   res.json(newDataset);
// });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: error.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Data Visualizer API running on port ${PORT}`);
});