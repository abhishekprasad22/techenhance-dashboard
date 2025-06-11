import express from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import rateLimit from "express-rate-limit";
import session from "express-session";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.js";
import { authenticateToken, optionalAuth } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.mimetype === "application/json") {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and JSON files are allowed"));
    }
  },
});

// Routes
app.use("/api/auth", authRoutes);

// Get all datasets (public + user's private datasets)
app.get("/api/datasets", optionalAuth, async (req, res) => {
  try {
    let query = `
      SELECT id, name, type, is_public, created_at, updated_at,
             jsonb_array_length(data) as data_points
      FROM datasets 
      WHERE is_public = true
    `;
    let params = [];

    if (req.user) {
      query += ` OR user_id = $1`;
      params.push(req.user.id);
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);

    const datasets = result.rows.map((row) => ({
      id: row.id.toString(),
      name: row.name,
      type: row.type,
      isPublic: row.is_public,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      dataPoints: row.data_points,
    }));

    res.json(datasets);
  } catch (error) {
    console.error("Error fetching datasets:", error);
    res.status(500).json({ error: "Failed to fetch datasets" });
  }
});

// Get specific dataset
app.get("/api/datasets/:id", optionalAuth, async (req, res) => {
  try {
    let query = `
      SELECT * FROM datasets 
      WHERE id = $1 AND (is_public = true
    `;
    let params = [req.params.id];

    if (req.user) {
      query += ` OR user_id = $2)`;
      params.push(req.user.id);
    } else {
      query += `)`;
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    const dataset = result.rows[0];
    res.json({
      id: dataset.id.toString(),
      name: dataset.name,
      data: dataset.data,
      type: dataset.type,
      isPublic: dataset.is_public,
      createdAt: dataset.created_at,
      updatedAt: dataset.updated_at,
      dataPoints: dataset.data.length,
    });
  } catch (error) {
    console.error("Error fetching dataset:", error);
    res.status(500).json({ error: "Failed to fetch dataset" });
  }
});

// Create new dataset (requires authentication)
app.post("/api/datasets", authenticateToken, async (req, res) => {
  try {
    const { name, data, type, isPublic = false } = req.body;

    if (!name || !data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid dataset format" });
    }

    const result = await pool.query(
      `INSERT INTO datasets (user_id, name, data, type, is_public, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`,
      [req.user.id, name, JSON.stringify(data), type || "generic", isPublic]
    );

    const dataset = result.rows[0];
    res.status(201).json({
      id: dataset.id.toString(),
      name: dataset.name,
      data: dataset.data,
      type: dataset.type,
      isPublic: dataset.is_public,
      createdAt: dataset.created_at,
      updatedAt: dataset.updated_at,
    });
  } catch (error) {
    console.error("Error creating dataset:", error);
    res.status(500).json({ error: "Failed to create dataset" });
  }
});

// Update dataset (requires authentication and ownership)
app.put("/api/datasets/:id", authenticateToken, async (req, res) => {
  try {
    const { name, data, type, isPublic } = req.body;

    const result = await pool.query(
      `UPDATE datasets 
       SET name = COALESCE($1, name),
           data = COALESCE($2, data),
           type = COALESCE($3, type),
           is_public = COALESCE($4, is_public),
           updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [
        name,
        data ? JSON.stringify(data) : null,
        type,
        isPublic,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Dataset not found or access denied" });
    }

    const dataset = result.rows[0];
    res.json({
      id: dataset.id.toString(),
      name: dataset.name,
      data: dataset.data,
      type: dataset.type,
      isPublic: dataset.is_public,
      createdAt: dataset.created_at,
      updatedAt: dataset.updated_at,
    });
  } catch (error) {
    console.error("Error updating dataset:", error);
    res.status(500).json({ error: "Failed to update dataset" });
  }
});

// Delete dataset (requires authentication and ownership)
app.delete("/api/datasets/:id", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM datasets WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Dataset not found or access denied" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting dataset:", error);
    res.status(500).json({ error: "Failed to delete dataset" });
  }
});

// Upload CSV file (requires authentication)
app.post(
  "/api/upload/csv",
  authenticateToken,
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          // Clean up uploaded file
          fs.unlinkSync(filePath);

          const result = await pool.query(
            `INSERT INTO datasets (user_id, name, data, type, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
            [
              req.user.id,
              req.file.originalname.replace(".csv", ""),
              JSON.stringify(results),
              "uploaded",
            ]
          );

          const dataset = result.rows[0];
          res.json({
            id: dataset.id.toString(),
            name: dataset.name,
            data: dataset.data,
            type: dataset.type,
            createdAt: dataset.created_at,
          });
        } catch (error) {
          console.error("Error saving uploaded dataset:", error);
          res.status(500).json({ error: "Failed to save dataset" });
        }
      })
      .on("error", (error) => {
        fs.unlinkSync(filePath);
        res.status(500).json({ error: "Error processing CSV file" });
      });
  }
);

// Generate sample data (requires authentication)
app.post("/api/generate/:type", authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const { count = 50, name = `Generated ${type} Data` } = req.body;

    let data = [];

    switch (type) {
      case "linear":
        data = Array.from({ length: count }, (_, i) => ({
          x: i,
          y: i * 2 + Math.random() * 10 - 5,
        }));
        break;

      case "normal":
        data = Array.from({ length: count }, () => {
          const u1 = Math.random();
          const u2 = Math.random();
          const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          return { value: z0 * 10 + 50 };
        });
        break;

      case "exponential":
        data = Array.from({ length: count }, (_, i) => ({
          x: i,
          y: Math.exp(i * 0.1) + Math.random() * 5,
        }));
        break;

      default:
        return res.status(400).json({ error: "Invalid data type" });
    }

    const result = await pool.query(
      `INSERT INTO datasets (user_id, name, data, type, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [req.user.id, name, JSON.stringify(data), "generated"]
    );

    const dataset = result.rows[0];
    res.json({
      id: dataset.id.toString(),
      name: dataset.name,
      data: dataset.data,
      type: dataset.type,
      createdAt: dataset.created_at,
    });
  } catch (error) {
    console.error("Error generating dataset:", error);
    res.status(500).json({ error: "Failed to generate dataset" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
  }
  console.error("Server error:", error);
  res.status(500).json({ error: error.message });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Data Visualizer API running on port ${PORT}`);
  console.log(
    `📊 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
});

// const express = require("express");
// const cors = require("cors");
// const csv = require("csv-parser");
// const fs = require("fs");
// const path = require("path");
// const rateLimit = require("express-rate-limit");
// const pool = require("./db");
// const multer = require("multer");
// const session = require("express-session");
// const passport = require("./config/passport");

// // Load environment variables
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });

// // const datasetroute = require("./routes/datasetroute");

// // Middleware
// app.use(limiter);
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// // Session configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/datasets", require("./routes/datasetroute"));
// app.use("/api/recommendations", require("./routes/recommendationroute"));

// // // Test the connection
// // pool.query("SELECT NOW()", (err, res) => {
// //   if (err) {
// //     console.error("PostgreSQL connection error:", err);
// //   } else {
// //     console.log("PostgreSQL connected at:", res.rows[0].now);
// //   }
// // });

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ status: "OK", timestamp: new Date().toISOString() });
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({ error: "File too large" });
//     }
//   }
//   res.status(500).json({ error: error.message });
// });

// // 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// app.listen(PORT, () => {
//   console.log(`Data Visualizer API running on port ${PORT}`);
// });
