import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/user.models";
import { usernameValidation } from "@/schemas/signUp.schema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
//   if (request.method !== "GET") {
//     return Response.json(
//       {
//         success: false,
//         message: "Only GET method is allowed",
//       },
//       { status: 405 }
//     );
//   }
// The above practise was commonly used in page routers versions of nextjs but now its not needed.

  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    //Now validating using zod
    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while checking the username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking the username",
      },
      { status: 500 }
    );
  }
}
