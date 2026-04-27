import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   🧠 VOICE + CHAT AI
================================ */
app.post("/voice-assistant", (req, res) => {

  let msg = req.body.message.toLowerCase();

  console.log("USER SAID:", msg);

  msg = msg.replace(/\b(\w+)( \1\b)+/g, "$1");

  let reply = "Tell me more so I can help you.";
  let emergency = false;

  if (msg.includes("heart attack") || msg.includes("cardiac")) {
    reply = "Possible heart attack. Sit down. Take aspirin if available.";
    emergency = true;
  }

  else if (msg.includes("asthma") || msg.includes("breathing")) {
    reply = "Use inhaler immediately. Stay calm.";
    emergency = true;
  }

  else if (msg.includes("snake") || msg.includes("bite")) {
    reply = "Snake bite. Stay still. Do not move.";
    emergency = true;
  }

  else if (msg.includes("fire") || msg.includes("burn")) {
    reply = "Move away from fire immediately.";
    emergency = true;
  }

  else if (msg.includes("gas") || msg.includes("leak")) {
    reply = "Gas leak detected. Move outside and avoid sparks.";
    emergency = true;
  }

  else if (msg.includes("dizzy")) {
    reply = "Sit down and drink water.";
  }

  res.json({ reply, emergency });
});

/* ===============================
   🏥 MOCK NEARBY HELP
================================ */
app.post("/nearby-help", (req, res) => {

  res.json({
    places: [
      { name: "City Hospital", address: "Main Road" },
      { name: "Police Station", address: "Central Area" }
    ]
  });

});

/* ===============================
   🚀 START SERVER
================================ */
app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Server running on http://localhost:3000");
});