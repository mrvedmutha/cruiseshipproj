import Product from "@/model/productModel";
export const productService = {
  async createProduct(
    productName: string,
    productDescription: string,
    productPrice: number,
    productImage: string,
    isAvailable: boolean,
    category: string,
    productAttributes?: Array<{ name: string; values: string[] }>,
    stock?: number,
    isStockRequired?: boolean,
    scheduledDate?: Date,
    isScheduledRequired?: boolean
  ) {
    const newProduct = new Product({
      productName,
      productDescription,
      productPrice,
      productImage,
      isAvailable,
      category,
      productAttributes,
      stock,
      isStockRequired,
      scheduledDate,
      isScheduledRequired,
    });
    await newProduct.save();
  },
  async getProduct() {
    return await Product.find({});
  },
  async getProductById(id: string) {
    return await Product.findById(id);
  },

  async getProductByCategory(category: string) {
    return await Product.find({ category });
  },
  async getProductByAvailability(isAvailable: boolean) {
    return await Product.find({ isAvailable }).populate("category");
  },
  async updateProductById(id: string, updateData: any) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  },
  async deleteProductById(id: string) {
    return await Product.findByIdAndDelete(id);
  },
};
