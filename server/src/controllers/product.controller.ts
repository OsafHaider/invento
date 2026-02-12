import type { Request, Response } from "express";
import { Product } from "../models/product.js";

export const handleCreateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const data = req.body;
    const sku_code = data.sku_code;
    // Check if SKU code already exists
    const existingProduct = await Product.findOne({
      sku_code: sku_code,
    }).select("_id");

    if (existingProduct) {
      res.status(409).json({ error: "SKU code already exists" });
      return;
    }

    const newProduct = new Product({
      ...data,
      createdBy: (req as any).user.id,
    });
    await newProduct.save();
    res.status(201).json({
      message: "Product created successfully",
      //   product: newProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const handleGetProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 🔥 Role-based filter
    let filter: any = {};

    if (req.user?.role !== "admin") {
      filter.createdBy = req.user?.id;
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .select("-__v")
      .populate("createdBy", "name email");

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductByID = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select("-__v");

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const updateProductByID = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Only creator can update
    if (product.createdBy.toString() !== (req as any).user.id) {
      res.status(403).json({ error: "Unauthorized to update this product" });
      return;
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProductByID = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Only creator can delete
    if (product.createdBy.toString() !== (req as any).user.id) {
      res.status(403).json({ error: "Unauthorized to delete this product" });
      return;
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
