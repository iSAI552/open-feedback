import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
  
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
    // if (!session || !session.user) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "Not Authenticated",
    //     },
    //     {
    //       status: 401,
    //     }
    //   );
    // }

    const allMessages = await UserModel.aggregate([
        {
            $unwind: "$messages"
        },
        {
            $sort: {
                "messages.createdAt": -1
            }
        },
        {
            $project: {
                username: 1,
                message: "$messages"
            }
        }
    ]).exec()

    console.log(allMessages)

    return Response.json(
        {
            success: true,
            messages: allMessages
        },
        {
            status: 200
        }
    )

}