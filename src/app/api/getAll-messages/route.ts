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

  const { searchParams } = new URL(request.url);
  const page: number = parseInt(searchParams.get("page") || "1");
  const limit: number = parseInt(searchParams.get("limit") || "4");


  try {
    const skip = (page - 1) * limit;


    const allMessages = await UserModel.aggregate([
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          username: 1,
          message: "$messages.content",
          createdAt: "$messages.createdAt",
        },
      },
    ]).exec();

    if (!allMessages) {
      console.log("Error while getting all the messages");
      return Response.json(
        {
          success: false,
          message: "An unexpected occur has occured",
        },
        {
          status: 500,
        }
      );
    }

    const totalPages = await UserModel.aggregate([
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
    ]).exec().then((data) => Math.ceil(data.length / limit));

    return Response.json(
      {
        success: true,
        messages: allMessages,
        currentPage: page,
        totalPages: totalPages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("An unexpected occur has occured while getting All messages", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected occur has occured while getting all the messages",
      },
      {
        status: 500,
      }
    );
  }
}
