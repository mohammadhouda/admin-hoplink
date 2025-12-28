import { registerService, loginService } from "../services/auth.service.js";
import { success, failure } from "../utils/response.js";

export async function registerController(req, res) {
  try {
    const { user, token } = await registerService(req.body);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 20 * 60 * 1000
    });

    return success(res, user, "User registered successfully.", 201);
  } catch (err) {
    return failure(res, err.message, 400);
  }
}

export async function loginController(req, res) {
  try {
    const { user, token } = await loginService(req.body);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 20 * 60 * 1000
    });

    return success(res, user, "User logged in successfully.", 200);
  } catch (err) {
    return failure(res, err.message, 400);
  }
}
