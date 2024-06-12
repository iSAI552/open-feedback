import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const allUsernames = await UserModel.find({}, { username: 1 }).exec() || [];
    if(allUsernames) {
      return Response.json(
        {
          success: true,
          usernames: allUsernames,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("Error while getting all the usernames", error);
    return Response.json(
      {
        success: false,
        message: "Error while getting all the usernames",
      },
      {
        status: 500,
      }
    );
  }

}