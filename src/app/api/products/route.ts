import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/productService";
import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponses";
import { categoryService } from "@/services/categoryService";

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
  if (session && session.user.role === "GUEST") {
    const getCategory = await categoryService.getCategory();
    const productByAvailability = await productService.getProductByAvailability(
      true
    );
    const baseUrl = new URL(req.url).origin;
    productByAvailability.forEach((product) => {
      if (product.productImage === "") {
        return (product.productImage = "");
      }
      product.productImage = `${baseUrl}/uploads/products/${product.productImage}`;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Products found",
        data: productByAvailability,
      },
      { status: 200 }
    );
  }
  try {
    const products = await productService.getProduct();
    if (!products) {
      return NextResponse.json(
        {
          success: false,
          message: "Products not found",
        } as ApiResponse,
        { status: 404 }
      );
    }

    const baseUrl = new URL(req.url).origin;
    products.forEach((product) => {
      if (product.productImage === "") {
        return (product.productImage = "");
      }
      product.productImage = `${baseUrl}/uploads/products/${product.productImage}`;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Products found",
        data: products,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error getting products",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
