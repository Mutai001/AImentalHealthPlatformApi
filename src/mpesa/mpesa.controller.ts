// M-Pesa Controller
import { Context } from "hono";
import { stkPush } from "./mpesa.service.js";
import { createPaymentService } from "../payments/payments.service.js";

export const initiateStkPush = async (c: Context) => {
  try {
    const { phone, amount } = await c.req.json();
    if (!phone || !amount) return c.json({ error: "Phone number and amount are required" }, 400);

    const response = await stkPush(phone, amount);
    return c.json(response, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

export const stkCallback = async (c: Context) => {
  try {
    const data = await c.req.json();
    console.log("=== CALLBACK DATA RECEIVED ===");
    console.log(JSON.stringify(data, null, 2));

    if (!data?.Body?.stkCallback) return c.json({ error: "Invalid callback data" }, 400);

    const callbackMetadata = data.Body.stkCallback.CallbackMetadata?.Item || [];
    const transactionId = callbackMetadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
    const phone = callbackMetadata.find((item: any) => item.Name === "PhoneNumber")?.Value;
    const amount = callbackMetadata.find((item: any) => item.Name === "Amount")?.Value;
    const merchantRequestId = data.Body.stkCallback.MerchantRequestID;
    const checkoutRequestId = data.Body.stkCallback.CheckoutRequestID;
    const status = data.Body.stkCallback.ResultCode === 0 ? "Success" : "Failed";

    if (!transactionId) {
      console.log("=== TRANSACTION ID MISSING FROM CALLBACK ===");
      return c.json({ error: "Transaction ID missing" }, 400);
    }

    console.log("=== TRANSACTION DETAILS ===");
    console.log({ phone, amount, transactionId, status });

    await createPaymentService({ phone, amount, transaction_id: transactionId, merchant_request_id: merchantRequestId, checkout_request_id: checkoutRequestId, status, createdAt: new Date() });

    return c.json({ message: "Callback processed successfully" }, 200);
  } catch (error: any) {
    console.error("=== CALLBACK PROCESSING ERROR ===", error.message);
    return c.json({ error: error.message }, 500);
  }
};
