import Category from "@/model/categoryModel";

export const categoryService = {
  async createCategory(
    categoryName: string,
    categoryDescription: string,
    isProduct: boolean
  ) {
    const newCategory = new Category({
      categoryName,
      categoryDescription,
      isProduct,
    });
    await newCategory.save();
  },
  async getCategory() {
    return await Category.find({});
  },
  async getCategoryById(id: string) {
    return await Category.findById(id);
  },
  async updateCategoryById(id: string, updateData: any) {
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
  },
  async deleteCategoryById(id: string) {
    return await Category.findByIdAndDelete(id);
  },
};
