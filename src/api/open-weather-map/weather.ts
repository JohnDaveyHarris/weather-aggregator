import type { VercelRequest, VercelResponse } from "@vercel/node";
import { forward } from "../_lib/forward";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await forward(
    req, res,
    "https://api.openweathermap.org/data/2.5/weather",
    "appid", process.env.OWM_API_KEY,
  );
}