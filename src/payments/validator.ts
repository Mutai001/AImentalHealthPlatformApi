    // import { integer } from 'drizzle-orm/pg-core'
    // import { z } from 'zod'
    
    
    // export const paymentsSchema = z.object({
    //     user_id: z.number(),
    //     session_id:z.number(),
    //     amount: z.number(),
    //     payment_status:z.string(),
    //     payment_date: z.coerce.date(),
    //     stripe_payment_id: z.string(),
    // })
    
    import { z } from "zod";

export const paymentsSchema = z.object({
  user_id: z.number(),
  session_id: z.number(),
  amount: z.number().positive(),
  payment_status: z.string(),
  payment_date: z.coerce.date(),

  // Payment method
  payment_method: z.enum(["Mpesa", "Stripe"]),

  // Stripe fields (only required when payment_method is Stripe)
  stripe_payment_id: z.string().optional(),

  // Mpesa fields (only required when payment_method is Mpesa)
  phone: z.string().optional(),
  transaction_id: z.string().optional(),
  merchant_request_id: z.string().optional(),
  checkout_request_id: z.string().optional(),
}).refine((data) => {
  if (data.payment_method === "Mpesa") {
    return (
      !!data.phone && 
      !!data.transaction_id &&
      !!data.merchant_request_id &&
      !!data.checkout_request_id
    );
  }
  if (data.payment_method === "Stripe") {
    return !!data.stripe_payment_id;
  }
  return false;
}, {
  message: "Missing required fields for the selected payment method",
  path: ["payment_method"],
}).refine((data) => {
  // Validate phone number only if Mpesa is selected
  if (data.payment_method === "Mpesa" && data.phone) {
    return /^[0-9]{10,12}$/.test(data.phone); // Validates Kenyan numbers like "0722227154" or "254722227154"
  }
  return true;
}, {
  message: "Invalid phone number format for Mpesa",
  path: ["phone"],
});
