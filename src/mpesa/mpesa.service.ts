// Code for the M-Pesa service
import axios from "axios";
import "dotenv/config";
import  db from "../drizzle/db";


const MPESA_BASE_URL = "https://sandbox.safaricom.co.ke";
const config = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortcode: process.env.MPESA_SHORTCODE!,
  passkey: process.env.MPESA_PASSKEY!,
  callbackUrl: process.env.MPESA_CALLBACK_URL!,
};

const generateMpesaToken = async (): Promise<string> => {
  try {
    const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");

    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!response.data.access_token) {
      throw new Error("Failed to fetch M-Pesa access token");
    }

    console.log("🔑 M-Pesa Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error: any) {
    console.error("🚨 Error generating M-Pesa token:", error.message);
    throw new Error("M-Pesa authentication failed");
  }
};

export const stkPush = async (phone: string, amount: number): Promise<any> => {
  try {
    const token = await generateMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
    const password = Buffer.from(`${config.shortcode}${config.passkey}${timestamp}`).toString("base64");

    const payload = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: config.shortcode,
      PhoneNumber: phone,
      CallBackURL: config.callbackUrl,
      AccountReference: "YourBusiness",
      TransactionDesc: "Payment",
    };

    console.log("📡 Sending STK Push request:", payload);

    const response = await axios.post(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ STK Push Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🚨 STK Push Error:", error.response?.data || error.message);
    throw new Error("M-Pesa STK Push failed");
  }
};

