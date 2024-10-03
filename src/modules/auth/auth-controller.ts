import { Request, Response } from "express";
import { createAddressProfileValidation } from "../address/address-validation";
import JWTService from "../../service/jwt-service";
import response, { errorResponse } from "../../utils/response-util";
import AddressService from "../address/address-service";
import secret from "../../config/secret-config";
import Developer from "../developers/developer-model";
import bcrypt from "bcrypt";
const { NODE_ENV } = secret;

/**
 * ##################################################################
 * LOGIN ADDRESS
 * GENERATE TOKENS FOR AUTHENTICATION AND AUTHORIZATION
 * ##################################################################
 */
export const loginAddress = async (req: Request, res: Response) => {
  // Validate request body
  const { error } = createAddressProfileValidation.validate(req.body);
  if (error) return response(res, 400, `Validation Error: ${error.message}`);

  const { address } = req.body;
  const addressService = new AddressService();

  try {
    const validAddress = await addressService.createAddressProfile(address);
    if (!validAddress)
      return response(res, 500, "Failed to create address profile");

    const jwt = new JWTService();
    const accessToken = jwt.createAccessToken({ address });
    const refreshToken = jwt.createRefreshToken({ address });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return response(res, 200, { accessToken });
  } catch (err) {
    console.error("Error in loginAddress:", err);
    errorResponse(res);
  }
};

/**
 * ##################################################################
 * GENERATE ACCESS TOKEN FOR ADDRESS WITH REFRESH TOKEN
 * ##################################################################
 */

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return response(res, 401, "No refresh token provided");
    }

    const jwtService = new JWTService();
    const { verifyRefreshToken, createAccessToken } = jwtService;

    // Verify the refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return response(res, 401, "Invalid or expired refresh token");
    }

    // Create a new access token
    const accessToken = createAccessToken({ address: payload.address });
    // Return the new access token
    response(res, 200, { accessToken });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    response(res, 401, "Access Denied");
  }
};

/**
 * ##################################################################
 * SIGNUP DEVELOPER
 * ##################################################################
 */

export const signupDeveloper = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingDeveloper = await Developer.findOne({ email });
    if (existingDeveloper) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const newDeveloper = new Developer({
      email,
      password,
      apikeys: [],
    });

    await newDeveloper.save();

    return res.status(201).json({
      message: "Developer account created successfully",
      developer: {
        id: newDeveloper._id,
        email: newDeveloper.email,
      },
    });
  } catch (error) {
    console.error("Error in signing up developer:", error);
    return errorResponse(res);
  }
};

/**
 * ##################################################################
 * LOGIN DEVELOPER
 * ##################################################################
 */

export const loginDeveloper = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log({ email, password });

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const developer = await Developer.findOne({ email });
    if (!developer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, developer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const jwt = new JWTService();
    const accessToken = jwt.createAccessToken({ email });

    return response(res, 200, { accessToken });
  } catch (error) {
    console.error("Error in logging in developer:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
