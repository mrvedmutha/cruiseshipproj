import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponses";
import { orderService } from "@/services/orderService";
import dbConnect from "@/lib/dbConnect";
import Order from "@/model/orderModel";

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({})
      .populate("user")
      .populate({
        path: "products",
        populate: { path: "product" },
      });
    return NextResponse.json(
      { success: true, message: "Orders found", data: orders } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" } as ApiResponse,
      { status: 500 }
    );
  }
}
