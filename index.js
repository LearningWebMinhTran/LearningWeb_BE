import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

import dbConnect from "./lib/dbConnect.js";
import User from "./models/User.js";

const app = new Hono();

app.get("/api/users", async (c) => {
  await dbConnect();

  try {
    const users = await User.find({});
    return c.json({ success: true, data: users }, 200);
  } catch (error) {
    return c.json({ success: false, error: error?.message }, 400);
  }
});

app.post("/api/users", async (c) => {
  await dbConnect();

  try {
    const body = await c.req.json();
    const user = await User.create(body);
    return c.json({ success: true, data: user }, 201);
  } catch (error) {
    return c.json({ success: false, error: error?.message }, 400);
  }
});

const port = Number(process.env.PORT ?? 3000);
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
  }
);
