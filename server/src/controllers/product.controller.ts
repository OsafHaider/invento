import type { Request, Response, NextFunction } from "express";
import { Product, type IProduct } from "../models/product.js";
import { generateProductDescription } from "../lib/ai.js";
import type { QueryFilter } from "mongoose";
import { ApiError } from "../utils/api-error.js";
import { sendResponse } from "../utils/response.js";

/* ================= CREATE ================= */
export const handleCreateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sku_code, ...rest } = req.body;

    if (!sku_code) {
      throw new ApiError(400, "SKU code is required");
    }

    const existing = await Product.findOne({ sku_code }).select("_id");
    if (existing) {
      throw new ApiError(409, "SKU code already exists");
    }

    const product = await Product.create({
      ...rest,
      sku_code,
      createdBy: req.user?.id,
    });

    sendResponse({
      res,
      statusCode: 201,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */
export const handleGetProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const filter: QueryFilter<IProduct> = {};

    if (req.user?.role !== "admin") {
      if (!req.user?.id) {
        throw new ApiError(401, "Unauthorized");
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

    sendResponse({
      res,
      statusCode: 200,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      message: "Products fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET BY ID ================= */
export const getProductByID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).select("-__v");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    sendResponse({
      res,
      statusCode: 200,
      data: product,
      message: "Product fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ================= */
export const updateProductByID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Product id is required");
    }

    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (
      req.user?.role !== "admin" &&
      product.createdBy.toString() !== req.user?.id
    ) {
      throw new ApiError(403, "Unauthorized");
    }

    Object.assign(product, req.body);
    await product.save();

    sendResponse({
      res,
      statusCode: 200,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */
export const deleteProductByID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (
      req.user?.role !== "admin" &&
      product.createdBy.toString() !== req.user?.id
    ) {
      throw new ApiError(403, "Unauthorized");
    }

    await product.deleteOne();

    sendResponse({
      res,
      statusCode: 200,
      data: null,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= AI DESCRIPTION ================= */
export const handleGenerateDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, category } = req.body;

    if (!name) {
      throw new ApiError(400, "Product name is required");
    }

    const description = await generateProductDescription(name, category);

    sendResponse({
      res,
      statusCode: 200,
      data: { description },
      message: "Description generated successfully",
    });
  } catch (error) {
    next(error);
  }
};
