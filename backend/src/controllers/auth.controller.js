import { registerService, loginService } from "../services/auth.service.js";
import { success, failure } from "../utils/response.js";

export async function registerController(req, res) {
  try {
    const result = await registerService(req.body);
    return success(res, result, "User registered successfully.", 201);
  } catch (err) {
    return failure(res, err.message, 400);
  }
}

export async function loginController(req, res) {
  try {
    const result = await loginService(req.body);
    return success(res, result, "User logged in successfully.", 200);
  } catch (err) {
    return failure(res, err.message, 400);
  }
}
