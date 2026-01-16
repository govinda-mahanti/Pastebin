import { NextResponse } from "next/server"
import redis from "@/lib/redis"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params   // 👈 FIX

  const key = `paste:${id}`

  const raw = await redis.get(key)
  if (!raw) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 })
  }

  const paste = JSON.parse(raw)

  let now = Date.now()
  const testNow = req.headers.get("x-test-now-ms")
  if (process.env.TEST_MODE === "1" && testNow) {
    now = Number(testNow)
  }

  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key)
    return NextResponse.json({ error: "Paste expired" }, { status: 404 })
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await redis.del(key)
      return NextResponse.json({ error: "View limit exceeded" }, { status: 404 })
    }
    paste.remaining_views -= 1
  }

  await redis.set(key, JSON.stringify(paste))

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  })
}
