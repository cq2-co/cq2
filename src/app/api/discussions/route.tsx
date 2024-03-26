import dbConnect from "@/lib/db-connect";
import Discussion from "@/models/discussion";

export async function POST(req: Request) {
  await dbConnect();

  const reqData = await req.json();
  const res = await Discussion.create(reqData);

  return Response.json(res);
}

export async function PUT(req: Request) {
  await dbConnect();

  const reqData = await req.json();
  const res = await Discussion.findByIdAndUpdate(reqData._id, reqData, {
    new: true,
    runValidators: true,
  });

  return Response.json(res);
}
