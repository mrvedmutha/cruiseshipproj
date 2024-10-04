import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponses";
import { userService } from "@/services/userServices";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendCredentials } from "@/helpers/sendCredentials";
export async function POST(req: Request, res: Response) {
  await dbConnect();
  try {
    const body = await req.json();
    const { username, fullName, password, email, role, accountExpires } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await userService.createUser(
      username,
      fullName,
      hashedPassword,
      email,
      role,
      accountExpires
    );

    const emailResponse = await sendCredentials(fullName, email, password);
    console.log(emailResponse); // TODO Remove
    return NextResponse.json({
      success: true,
      message: "User created successfully",
    } as ApiResponse);
  } catch (error) {
    console.log("Error creating user: ", error);
    return NextResponse.json({
      success: false,
      message: "Error creating user",
    } as ApiResponse);
  }
}
