import { NextResponse } from "next/server"
import redis from "@/lib/redis"
import crypto from "crypto"

export async function POST(req: Request) {
  const { content, ttl_seconds, max_views } = await req.json()

  // Validation
  if (!content || typeof content !== "string" || content.trim() === "") {
    return NextResponse.json({ error: "content is required" }, { status: 400 })
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return NextResponse.json({ error: "ttl_seconds must be >= 1" }, { status: 400 })
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return NextResponse.json({ error: "max_views must be >= 1" }, { status: 400 })
  }

  const id = crypto.randomBytes(4).toString("hex")
  const key = `paste:${id}`

  const now = Date.now()
  const expiresAt = ttl_seconds ? now + ttl_seconds * 1000 : null

  const pasteData = {
    content,
    remaining_views: max_views ?? null,
    expires_at: expiresAt,
    created_at: now,
  }

  await redis.set(key, JSON.stringify(pasteData))

  if (ttl_seconds) {
    await redis.expire(key, ttl_seconds)
  }

  return NextResponse.json(
    {
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    },
    { status: 201 }
  )
}
