import { User } from "../models/user.js";
import { RefreshToken } from "../models/refresh-token.js";
import type { AuthResponse } from "../types/index.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt.js";
import { ApiError } from "../utils/api-error.js";
import { sendResponse } from "../utils/response.js";

const saltRounds = 10;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: REFRESH_TOKEN_EXPIRY,
};

/* ================= SIGN UP ================= */
export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) throw new ApiError(400, "All fields required");

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) throw new ApiError(409, "User already exists");

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ email: normalizedEmail, password: hashedPassword, name });

    const response: AuthResponse = {
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        role: newUser.role,
      },
    };

    sendResponse({ res, statusCode: 201, data: response, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

/* ================= SIGN IN ================= */
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, device, ipAddress } = req.body;

    if (!email || !password) throw new ApiError(400, "Email and password required");

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email, role: user.role });
    const refreshTokenValue = generateRefreshToken({ id: user._id.toString(), email: user.email, role: user.role });

    // Save refresh token in DB
    const refreshTokenDoc = await RefreshToken.create({
      userId: user._id,
      token: refreshTokenValue,
      device,
      ipAddress,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    });

    if (!refreshTokenDoc) throw new ApiError(500, "Failed to create refresh token");

    // Push into user.refreshToken array
    user.refreshToken = user.refreshToken || [];
    user.refreshToken.push(refreshTokenDoc._id.toString());
    await user.save();

    // Set cookie
    res.cookie("refreshToken", refreshTokenValue, cookieOptions);

    sendResponse({
      res,
      statusCode: 200,
      data: {
        accessToken,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          role: user.role,
        },
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= REFRESH TOKEN ================= */
export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, "No refresh token provided");

    const payload = verifyRefreshToken(token);
    if (!payload) throw new ApiError(401, "Invalid refresh token");

    const refreshTokenDoc = await RefreshToken.findOne({ token });
    if (!refreshTokenDoc) throw new ApiError(401, "Refresh token not found");

    const user = await User.findById(refreshTokenDoc.userId);
    if (!user) throw new ApiError(404, "User not found");

    const newAccessToken = generateAccessToken({ id: user._id.toString(), email: user.email, role: user.role });
    const newRefreshTokenValue = generateRefreshToken({ id: user._id.toString(), email: user.email, role: user.role });

    refreshTokenDoc.token = newRefreshTokenValue;
    refreshTokenDoc.expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);
    refreshTokenDoc.lastUsedAt = new Date();
    await refreshTokenDoc.save();

    res.cookie("refreshToken", newRefreshTokenValue, cookieOptions);

    sendResponse({
      res,
      statusCode: 200,
      data: { accessToken: newAccessToken },
      message: "Token refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= LOGOUT (SINGLE DEVICE) ================= */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return sendResponse({ res, statusCode: 200, data: null, message: "Already logged out" });

    const refreshTokenDoc = await RefreshToken.findOneAndDelete({ token });
    if (refreshTokenDoc) {
      await User.findByIdAndUpdate(refreshTokenDoc.userId, { $pull: { refreshToken: refreshTokenDoc._id } });
    }

    res.clearCookie("refreshToken");

    sendResponse({ res, statusCode: 200, data: null, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

/* ================= LOGOUT ALL DEVICES ================= */
export const logoutAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, "Unauthorized");

    await RefreshToken.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { $set: { refreshToken: [] } });

    res.clearCookie("refreshToken");

    sendResponse({ res, statusCode: 200, data: null, message: "Logged out from all devices successfully" });
  } catch (error) {
    next(error);
  }
};

/* ================= PROFILE ================= */
export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new ApiError(401, "Unauthorized");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const userData: AuthResponse = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
      },
    };

    sendResponse({
      res,
      statusCode: 200,
      data: userData,
      message: "User profile fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
