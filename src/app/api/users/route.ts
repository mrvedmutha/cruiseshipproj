import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/userServices";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized, please login",
      },
      { status: 401 }
    );
  }
  if (session && session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  try {
    const users = await userService.getUser();
    return NextResponse.json(
      {
        success: true,
        message: "Users found",
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error getting users: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting users",
      },
      { status: 401 }
    );
  }
}
