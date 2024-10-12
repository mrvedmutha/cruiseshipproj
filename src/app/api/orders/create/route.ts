import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponses";
import { orderService } from "@/services/orderService";
import dbConnect from "@/lib/dbConnect";
import Order from "@/model/orderModel";

export async function POST(request: NextRequest) {
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
  if (!session?.user?._id) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid session",
      } as ApiResponse,
      { status: 401 }
    );
  }
  try {
    await dbConnect();
    const body = await request.json();
    const { orderDate, status, products } = body;
    const order = await orderService.createOrder(
      orderDate,
      status,
      session.user._id,
      products
    );
    return NextResponse.json(
      {
        success: true,
        message: "Order created",
        data: order,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating order",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
