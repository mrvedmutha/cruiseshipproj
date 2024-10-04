import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponses";
import { categoryService } from "@/services/categoryService";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest, res: NextResponse) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized, please login",
      } as ApiResponse,
      { status: 401 }
    );
  }

  try {
    const categories = await categoryService.getCategory();
    return NextResponse.json(
      {
        success: true,
        message: "Categories found",
        data: categories,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
