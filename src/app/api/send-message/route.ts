import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { Message } from "@/model/user.models";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        {
          status: 401,
        }
      );
    }

    // check if user is accepting the messages

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting any messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage: Message = { content, createdAt: new Date() } as Message;
    user.messages.push(newMessage);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error sending messages", error);
    return Response.json(
      {
        success: false,
        message: "Error sending messages",
      },
      {
        status: 500,
      }
    );
  }
}
