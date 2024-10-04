import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiResponse } from "@/types/ApiResponses";
import { categoryService } from "@/services/categoryService";
import dbConnect from "@/lib/dbConnect";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
  res: NextResponse
) {
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
  const categoryId = params.id;
  try {
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        } as ApiResponse,
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Category found",
        data: category,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
  res: NextResponse
) {
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
  if (session && session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      } as ApiResponse,
      { status: 401 }
    );
  }

  const categoryId = params.id;

  try {
    const updateData = await req.json();
    const category = await categoryService.updateCategoryById(
      categoryId,
      updateData
    );
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        } as ApiResponse,
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
  res: NextResponse
) {
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
  if (session && session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      } as ApiResponse,
      { status: 401 }
    );
  }

  const categoryId = params.id;

  try {
    const category = await categoryService.deleteCategoryById(categoryId);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        } as ApiResponse,
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
        data: category,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
