import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/ApiResponses";
import { productService } from "@/services/productService";
import dbConnect from "@/lib/dbConnect";
import path from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import mime from "mime";

export async function POST(req: NextRequest, res: NextResponse) {
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
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      } as ApiResponse,
      { status: 401 }
    );
  }
  const formData = await req.formData();
  const productName = formData.get("productName") as string;
  const productDescription = formData.get("productDescription") as string;
  const productPrice = formData.get("productPrice") as string;
  const productImage = formData.get("productImage") as File;
  const isAvailable = formData.get("isAvailable") === "true";
  const category = formData.get("category") as string;
  const stock = formData.get("stock") as string;
  const isScheduledRequired = formData.get("isScheduledRequired") === "true";
  const productAttributesRaw = formData.get("productAttributes");
  const buffer = Buffer.from(await productImage.arrayBuffer());
  const imagePath = path.join(process.cwd(), "public", "uploads", "products");

  try {
    await stat(imagePath);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await mkdir(imagePath, { recursive: true });
    } else {
      console.error("Error checking or creating image directory:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Error checking or creating image directory",
        } as ApiResponse,
        { status: 500 }
      );
    }
  }
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${productImage.name.replace(
      /\.[^/.]$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(productImage.type)}`;
    await writeFile(path.join(imagePath, fileName), buffer);
    await productService.createProduct(
      productName,
      productDescription,
      parseFloat(productPrice),
      fileName,
      isAvailable,
      category,
      JSON.parse(productAttributesRaw as string),
      parseInt(stock),
      isScheduledRequired
    );
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log("Error creating product: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating product",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
