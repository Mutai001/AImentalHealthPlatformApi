// Purpose: Service for payments.
import {eq} from "drizzle-orm";
import db from "../drizzle/db";
 import { TIPayment, TSPayment, payments } from "../drizzle/schema";
import { paymentsSchema } from "./validator";
  export const paymentService = async (limit?: number): Promise<TSPayment[] | null> => {
    if (limit) {
      return await db.query.payments.findMany({
        limit: limit
      });
    }
    return await db.query.payments.findMany();
  };

  
export const getPaymentService = async (id: number): Promise<TIPayment | undefined> => {
    return await db.query.payments.findFirst({
        where: eq(payments.id, id)
    });

}
// export const createPaymentService = async (user: TIPayment) => {
//     await db.insert(payments).values(user)
//     return "payment created successfully";

// }
// Create payment
export const createPaymentService = async (paymentData: any) => {
  try {
    // Validate input data with Zod
    const validatedData = paymentsSchema.parse(paymentData);

    // Insert into payments table
    await db.insert(payments).values({ ...validatedData, amount: validatedData.amount.toString(), payment_date: validatedData.payment_date.toISOString() });
    console.log("✅ Payment successfully recorded:", validatedData);

    return { success: true, message: "Payment recorded successfully" };
  } catch (error: any) {
    console.error("🚨 Payment Insertion Error:", error.message);
    throw new Error("Failed to insert payment data");
  }
};

export const updatePaymentService = async (id: number, user: TIPayment) => {
    await db.update(payments).set(user).where(eq(payments.id, id))
    return "payment updated successfully";
}

export const deletePaymentService = async (id: number) => {
    await db.delete(payments).where(eq(payments.id, id))
    return "payment deleted successfully";
}
