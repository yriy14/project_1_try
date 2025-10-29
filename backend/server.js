// backend/server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Тимчасова пам’ять для сенсорів
let sensors = [];

// Прийом даних від датчиків
app.post("/api/sensors", (req, res) => {
  const { id, temperature, humidity } = req.body;
  if (!id || temperature === undefined || humidity === undefined) {
    return res.status(400).json({ message: "Invalid sensor data" });
  }

  const timestamp = new Date();
  const existing = sensors.find(s => s.id === id);
  if (existing) {
    existing.temperature = temperature;
    existing.humidity = humidity;
    existing.timestamp = timestamp;
  } else {
    sensors.push({ id, temperature, humidity, timestamp });
  }

  console.log(`Sensor ${id}: T=${temperature}°C, H=${humidity}%`);
  res.json({ message: "Data received" });
});

// Отримання всіх сенсорів
app.get("/api/sensors", (req, res) => {
  res.json(sensors);
});

// Оновлення списку (наприклад, для фронтенду кожні 5 хв)
app.get("/api/refresh", (req, res) => {
  res.json(sensors);
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
