import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.TEMP_VERIFICATION_SECRET;

export function createPhoneToken(phoneNumber) {
  return jwt.sign({ phoneNumber }, SECRET, { expiresIn: "10m" });
}

export function verifyPhoneToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded.phoneNumber;
  } catch (err) {
    return null;
  }
}
