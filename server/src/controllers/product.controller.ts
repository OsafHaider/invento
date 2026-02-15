import type { FilterQuery } from 'mongoose';
import type { Request, Response } from "express";
import { Product, type IProduct } from "../models/product.js";
import { generateProductDescription } from "../lib/ai.js";

/* ================= CREATE ================= */
export const handleCreateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { sku_code, ...rest } = req.body;

    if (!sku_code) {
      res.status(400).json({ error: "SKU code is required" });
      return;
    }

    const existing = await Product.findOne({ sku_code}).select("_id");
    if (existing) {
      res.status(409).json({ error: "SKU code already exists" });
      return;
    }

    const product = await Product.create({
      ...rest,
      sku_code,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const handleGetProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IProduct> = {};

    if (req.user?.role !== "admin") {
      if (!req.user?.id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      filter.createdBy = req.user.id;
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .populate("createdBy", "name email"),
      Product.countDocuments(filter),
    ]);

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


/* ================= GET BY ID ================= */
export const getProductByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).select("-__v");

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

/* ================= UPDATE ================= */
export const updateProductByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {id}=req.params
    if (!id) {
  res.status(400).json({ error: "Product id is required" });
  return;
}
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Allow admin OR creator
    if (
      req.user?.role !== "admin" &&
      product.createdBy.toString() !== req.user?.id
    ) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

/* ================= DELETE ================= */
export const deleteProductByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    if (
      req.user?.role !== "admin" &&
      product.createdBy.toString() !== req.user?.id
    ) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};

/* ================= AI DESCRIPTION ================= */
export const handleGenerateDescription = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      res.status(400).json({ message: "Product name is required" });
      return;
    }

    const description = await generateProductDescription(name, category);

    res.json({ description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI generation failed" });
  }
};
