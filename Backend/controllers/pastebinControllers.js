import crypto from "crypto";



export const healthCheck = async (req, res) => {
  try {
    // simple Redis ping
    await req.redis.ping();

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(200).json({ ok: false });
  }
};




export const createPaste = async (req, res) => {
  const { content, ttl_seconds, max_views } = req.body;

  // Validation
  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "content is required" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "ttl_seconds must be >= 1" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "max_views must be >= 1" });
  }

  const id = crypto.randomBytes(4).toString("hex");
  const key = `paste:${id}`;

  const now = Date.now();
  const expiresAt = ttl_seconds ? now + ttl_seconds * 1000 : null;

  const pasteData = {
    content,
    remaining_views: max_views ?? null,
    expires_at: expiresAt,
    created_at: now
  };

  // Save to Redis
  await req.redis.set(key, JSON.stringify(pasteData));

  // Set TTL if provided
  if (ttl_seconds) {
    await req.redis.expire(key, ttl_seconds);
  }

  return res.status(201).json({
    id,
    url: `${process.env.BASE_URL}/p/${id}`
  });
};



export const getPaste = async (req, res) => {
  const { id } = req.params;
  const key = `paste:${id}`;

  const raw = await req.redis.get(key);
  if (!raw) {
    return res.status(404).json({ error: "Paste not found" });
  }

  const paste = JSON.parse(raw);

  // Determine current time
  let now = Date.now();
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    now = Number(req.headers["x-test-now-ms"]);
  }

  // TTL check
  if (paste.expires_at && now >= paste.expires_at) {
    await req.redis.del(key);
    return res.status(404).json({ error: "Paste expired" });
  }

  // View limit check
  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await req.redis.del(key);
      return res.status(404).json({ error: "View limit exceeded" });
    }

    paste.remaining_views -= 1;
  }

  // Save updated state
  await req.redis.set(key, JSON.stringify(paste));

  return res.status(200).json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null
  });
};
