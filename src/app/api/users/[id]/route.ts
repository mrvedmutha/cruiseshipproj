import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiResponse } from "@/types/ApiResponses";
import { userService } from "@/services/userServices";
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
      },
      { status: 401 }
    );
  }
  if (session && session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to view this page",
      },
      { status: 401 }
    );
  }
  const userId = params.id;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        } as ApiResponse,
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "User found",
        data: user,
      } as ApiResponse,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error getting user: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting user",
      } as ApiResponse,
      {
        status: 500,
      }
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
      },
      { status: 401 }
    );
  }
  if (session && session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to view this page",
      },
      { status: 401 }
    );
  }
  const userId = params.id;
  try {
    console.log(`getting user id: ${userId}`); //TODO Remove
    const updateData = await req.json();
    console.log("getting updaing data..."); // TODO Remove
    console.log({ updateData }); // TODO remove
    const updatedUser = await userService.updateUserById(userId, updateData);
    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      } as ApiResponse,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error updating user: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating user",
      } as ApiResponse,
      {
        status: 500,
      }
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
      },
      { status: 401 }
    );
  }
  if (session && session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to view this page",
      },
      { status: 401 }
    );
  }
  const userId = params.id;
  try {
    await userService.deleteUserById(userId);
    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
      } as ApiResponse,
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error deleting user: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting user",
      } as ApiResponse,
      {
        status: 500,
      }
    );
  }
}
