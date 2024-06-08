import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { z } from "zod";
import { verifyCodeSchema } from "@/schemas/verifyCode.schema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const {username, code} = await request.json()

    const result = verifyCodeSchema.safeParse({code})

    if(!result.success){
        const verifyCodeErrors = result.error.format().code?._errors || []
      return Response.json(
        {
          success: false,
          message:
          verifyCodeErrors?.length > 0
              ? verifyCodeErrors.join(", ")
              : "Invalid code",
        },
        { status: 400 }
      );
    }
    const verifyCode = result.data.code
    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({username: decodedUsername}) 

    if(!user){
        return Response.json(
            {
              success: false,
              message: "User not found",
            },
            { status: 400 }
          );
    }

    const isCodeValid = user.verifyCode === verifyCode
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if(isCodeNotExpired && isCodeValid){
        // user.verifyCode = ''
        user.isVerified = true
        await user.save()
        return Response.json(
            {
              success: true,
              message: "User verified Successfully",
            },
            { status: 201 }
          );
    } else if(!isCodeNotExpired){
        return Response.json(
            {
              success: false,
              message: "VerifyCode expired. Please signUp again to get a new verification code",
            },
            { status: 400 }
          );
    } else {
        return Response.json(
            {
              success: false,
              message: "Incorrect VerifyCode",
            },
            { status: 400 }
          );
    }


  } catch (error) {
    console.error("Error while checking the Verifycode", error);
    return Response.json(
      {
        success: false,
        message: "Error checking the verifyCode",
      },
      { status: 500 }
    );
  }
}
