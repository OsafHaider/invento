import { User } from "../models/user.js";
import type { AuthResponse } from "../types/index.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt.js";
const saltRounds = 10;
// 30 minutes (matches JWT refresh token expiry)
const REFRESH_TOKEN_EXPIRY = 30 * 60 * 1000;

const cookieOptions = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "development",
  sameSite: "strict" as const,
  maxAge: REFRESH_TOKEN_EXPIRY,
};
export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role: role,
    });
    await newUser.save();

    const response: AuthResponse = {
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        role:newUser.role
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    // Verify password using bcryptjs comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, cookieOptions);
    const response: AuthResponse = {
      accessToken: accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role:user.role
      },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    // Verify refresh token
    const payload = verifyRefreshToken(token);
    if (!payload) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    // Find user and verify stored refresh token matches
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Token refresh failed" });
  }
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const response: AuthResponse = {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role:user.role
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
