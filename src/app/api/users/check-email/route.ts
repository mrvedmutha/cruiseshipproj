import dbConnect from "@/lib/dbConnect";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { emailValidationSchema } from "@/schema/userFormSchema";
import { ApiResponse } from "@/types/ApiResponses";
import { userService } from "@/services/userServices";

const emailQuerySchema = z.object({
  email: emailValidationSchema,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      email: searchParams.get("email"),
    };
    //validate with zod
    const result = emailQuerySchema.safeParse(queryParam);
    console.log({ result }); // TODO Remove
    if (!result.success) {
      const emailError = result.error.format().email?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email",
        } as ApiResponse,
        { status: 400 }
      );
    }
    const { email } = result.data;
    console.log({ email }); // TODO Remove
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        } as ApiResponse,
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Email is valid",
    } as ApiResponse);
  } catch (error) {
    console.error("Error fetching data", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching data",
    } as ApiResponse);
  }
}
