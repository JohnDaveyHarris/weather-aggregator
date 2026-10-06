import type { VercelRequest, VercelResponse } from "@vercel/node";
import { forward } from "../_lib/forward";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await forward(
    req, res,
    "https://api.weatherapi.com/v1/forecast.json",
    "key", process.env.WEATHER_API_KEY,
  );
}