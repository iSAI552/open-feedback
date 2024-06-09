import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  // const { toast } = useToast();

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
    const { newUsername } = await request.json();
    if (!newUsername) {
      return Response.json(
        {
          success: true,
          message: "No changes made to username!",
        },
        {
          status: 201,
        }
      );
    }

    await UserModel.findByIdAndUpdate(session.user._id, {
      $set: {
        username: newUsername,
      },
      
    }, { new: true});
    return Response.json(
      {
        success: true,
        message: "Username updated successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: true,
        message: "Error updating username",
      },
      {
        status: 500,
      }
    );
  }
}
