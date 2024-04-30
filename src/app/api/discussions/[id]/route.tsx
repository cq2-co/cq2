import dbConnect from "@/lib/db-connect";
import Discussion from "@/models/discussion";
import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      // rate limit to 5 requests per 10 seconds
      limiter: Ratelimit.slidingWindow(5, "10s"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  } else {
    console.log(
      "KV_REST_API_URL and KV_REST_API_TOKEN env vars not found, not rate limiting...",
    );
  }

  await dbConnect();

  const res = await Discussion.findById(params.id).lean();

  const serializedDiscussion = JSON.parse(JSON.stringify(res));

  return Response.json(serializedDiscussion);
}
