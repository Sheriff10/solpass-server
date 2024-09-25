import { Request, Response } from "express";
import { createAddressProfileValidation } from "../address/address-validation";
import JWTService from "../../service/jwt-service";
import response, { errorResponse } from "../../utils/response-util";
import AddressService from "../address/address-service";
import secret from "../../config/secret-config";

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

    response(res, 200, { accessToken });
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
