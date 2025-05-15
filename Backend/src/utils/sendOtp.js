import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

/**
 * Send or verify OTP using Twilio Verify Service
 * 
 * @param {string} phone - Phone number with country code (e.g. +918888888888)
 * @param {string} [otp] - OTP to verify (optional)
 * @param {boolean} [isVerify] - true if verifying, false or undefined to send
 * @returns {Promise<boolean|void>}
 */
export const sendOtp = async (phoneNumber, otp = null, isVerify = false) => {
  try {
    if (isVerify) {
      const verificationCheck = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: phoneNumber, code: otp });

      return verificationCheck.status === "approved";
    } else {
      await client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phoneNumber, channel: "sms" });

      return;
    }
  } catch (error) {
    console.error("Twilio sendOtp error:", error);
    throw error;
  }
};
