import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponses";
import { categoryService } from "@/services/categoryService";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest, res: NextResponse) {
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
    const body = await req.json();
    const { categoryName, categoryDescription, isProduct } = body;
    await categoryService.createCategory(
      categoryName,
      categoryDescription,
      isProduct
    );
    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
      } as ApiResponse,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error creating category: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating category",
      } as ApiResponse,
      {
        status: 500,
      }
    );
  }
}
