import dbConnect from "@/lib/db-connect";
import Discussion from "@/models/discussion";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();

  const res = await Discussion.findById(params.id).lean();

  const serializedDiscussion = JSON.parse(JSON.stringify(res));

  return Response.json(serializedDiscussion);
}
