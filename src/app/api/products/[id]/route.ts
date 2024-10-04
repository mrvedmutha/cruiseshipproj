import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiResponse } from "@/types/ApiResponses";
import { productService } from "@/services/productService";
import dbConnect from "@/lib/dbConnect";
import path from "path";
import { stat, mkdir, writeFile, unlink } from "fs/promises";
import mime from "mime";

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
  const productId = params.id;
  try {
    const product = await productService.getProductById(productId);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        } as ApiResponse,
        { status: 404 }
      );
    }
    const baseUrl = new URL(req.url).origin;
    const fullProductImageUrl = product.productImage
      ? `${baseUrl}/uploads/products/${product.productImage}`
      : "";
    return NextResponse.json(
      {
        success: true,
        message: "Product found",
        data: { ...product._doc, productImage: fullProductImageUrl },
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log("Error getting product: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting product",
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
      },
      { status: 401 }
    );
  }
  if (session && session.user.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message: "You are not authorized to update this product",
      },
      { status: 401 }
    );
  }

  const productId = params.id;

  const producFetch = await productService.getProductById(productId);
  if (!producFetch) {
    return NextResponse.json(
      {
        success: false,
        message: "Product not found",
      } as ApiResponse,
      { status: 404 }
    );
  }

  try {
    const formData = await req.formData();
    const productName = formData.get("productName") as string;
    const productDescription = formData.get("productDescription") as string;
    const productPrice = formData.get("productPrice") as string;
    const productImage = (formData.get("productImage") as File) || "";
    const isAvailable = formData.get("isAvailable") === "true";
    const category = formData.get("category") as string;
    const exProductImage = producFetch.productImage;
    const stock = formData.get("stock") as string;
    const isScheduledRequired = formData.get("isScheduledRequired") === "true";
    const productAttributesRaw = formData.get("productAttributes");
    if (exProductImage && exProductImage !== "") {
      await unlink(
        path.join(
          process.cwd(),
          "public",
          "uploads",
          "products",
          exProductImage
        )
      );
    }
    let fileName = "";
    if (productImage) {
      const buffer = Buffer.from(await productImage.arrayBuffer());
      const imagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "products"
      );

      try {
        await stat(imagePath);
      } catch (error: any) {
        if (error.code === "ENOENT") {
          await mkdir(imagePath, { recursive: true });
        } else {
          return NextResponse.json(
            {
              success: false,
              message: "Error checking or creating image directory",
            } as ApiResponse,
            { status: 500 }
          );
        }
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      fileName = `${productImage.name.replace(
        /\.[^/.]$/,
        ""
      )}-${uniqueSuffix}.${mime.getExtension(productImage.type)}`;
      await writeFile(path.join(imagePath, fileName), buffer);
    }
    const updateData = {
      productName,
      productDescription,
      productPrice: parseFloat(productPrice),
      ...(fileName && { productImage: fileName }),
      isAvailable,
      category,
      stock: parseInt(stock),
      productAttributes: JSON.parse(productAttributesRaw as string),
      isScheduledRequired,
    };
    const updateProduct = await productService.updateProductById(
      productId,
      updateData
    );
    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: updateProduct,
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log("Error updating product: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating product",
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

  const productId = params.id;
  const producFetch = await productService.getProductById(productId);
  if (!producFetch) {
    return NextResponse.json(
      {
        success: false,
        message: "Product not found",
      } as ApiResponse,
      { status: 404 }
    );
  }
  const productImage = producFetch.productImage;
  try {
    if (productImage) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "products"
      );
      await unlink(path.join(imagePath, productImage));
    }
    await productService.deleteProductById(productId);
    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting product: ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting product",
      } as ApiResponse,
      { status: 500 }
    );
  }
}
