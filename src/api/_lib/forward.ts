import type { VercelRequest, VercelResponse } from "@vercel/node";

/** Пересылает запрос апстриму, скопировав query и добавив ключ */
export async function forward(
  req: VercelRequest,
  res: VercelResponse,
  targetUrl: string,
  keyParam: string,
  keyValue: string | undefined,
): Promise<void> {
  if (!keyValue) {
    res.status(500).json({ message: `Missing ${keyParam} env variable` });
    return;
  }

  const target = new URL(targetUrl);
  const incoming = new URL(req.url ?? "/", "https://internal");
  for (const [k, v] of incoming.searchParams) target.searchParams.set(k, v);
  target.searchParams.set(keyParam, keyValue);

  try {
    const upstream = await fetch(target);
    res.status(upstream.status);
    res.setHeader(
      "content-type",
      upstream.headers.get("content-type") ?? "application/json",
    );
    res.send(await upstream.text());
  } catch {
    res.status(502).json({ message: "Upstream request failed" });
  }
}