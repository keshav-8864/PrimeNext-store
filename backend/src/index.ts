import express from 'express'
import cors from 'cors'
import "dotenv/config"
import {clerkMiddleware} from "@clerk/express"
import { clerkWebhookHandler } from './webhooks/clerk';
import { getEnv } from './lib/env';
import keepAliveCron from "./lib/cron";

import fs from "node:fs";
import path from "node:path";

import meRouter from "./routes/meRouter";
import productRouter from "./routes/productRouter";
import streamRouter from "./routes/streamRouter";

import checkoutRouter from "./routes/checkoutRouter";

import { polarWebhookHandler } from "./webhooks/polar";

const env = getEnv()
const app = express();


const rowJson =  express.raw({type:"application/json",limit : "1mb"});

// it's important that you don't parse the webhook event data, it should be in the raw format

app.post("/webhooks/clerk",rowJson,(req,res)=>{
 void  clerkWebhookHandler(req,res)
})

app.post("/webhooks/polar",rowJson,(req,res)=>{
 void  polarWebhookHandler(req,res)
})

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


app.get("/health",(_req,res)=>{
    res.status(200).json({ok:true})
})


app.use("/api/me",meRouter)
app.use("/api/products",productRouter)
app.use("/api/stream",streamRouter)

app.use("/api/checkout", checkoutRouter)



const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

// todo: add  arror handler meddleware

app.listen(env.PORT, () => {
  console.log("Listening on port:", env.PORT);
  if (env.NODE_ENV === "production") {
    keepAliveCron.start();
  }
});