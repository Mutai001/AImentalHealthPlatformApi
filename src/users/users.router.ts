import { Hono } from "hono";
import { listUsers, getUser, createUser, updateUser, deleteUser, } from "./users.controller"
import { zValidator } from "@hono/zod-validator";
import { usersSchema } from "./validator"; 
import { adminRoleAuth } from '../middleware/bearAuth'
import { users, bookings } from "../drizzle/schema";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";
import { db } from "../drizzle/db";


export const userRouter = new Hono();
//get all users
userRouter.get("/users",
    // adminRoleAuth ,
    listUsers) 

//get a single user   api/users/1
userRouter.get("/users/:id",
    // adminRoleAuth,
     getUser)

// create a user 
userRouter.post("/users", zValidator('json', usersSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400)
    }
}), createUser)

//update a user
userRouter.put("/users/:id", updateUser) 

//delete a user
userRouter.delete("/users/:id",
    // adminRoleAuth,
     deleteUser)

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true, // Ensure SSL/TLS
    tls: {
      rejectUnauthorized: false, // Consider for development, not recommended for production
    },
  });
  
  
  // ✅ Therapist sends Google Meet link
  userRouter.post("/send-meet-link", async (c) => {
    const { bookingId, meetLink } = await c.req.json();
  
    if (!bookingId || !meetLink) {
      return c.json({ error: "Booking ID and Meet link are required" }, 400);
    }
  
    // Fetch user details linked to the booking
    const booking = await db
      .select({
        userId: bookings.user_id,
        email: users.email,
      })
      .from(bookings)
      .innerJoin(users, eq(users.id, bookings.user_id))
      .where(eq(bookings.id, bookingId))
      .limit(1);
  
    if (!booking.length) {
      return c.json({ error: "Booking not found" }, 404);
    }
  
    const userEmail = booking[0].email;
  
    try {
      const info = await transporter.sendMail({
        from: `"Therapist" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Google Meet Link for Your Session",
        text: `Hello, your therapist has scheduled a Google Meet session. Join using this link: ${meetLink}`,
      });
  
      console.log("Email sent:", info.response);
      return c.json({ success: `Meet link sent to ${userEmail}` });
    } catch (error) {
      console.error("Email sending error:", error);
      return c.json({ error: "Failed to send email. Please try again later." }, 500);
    }
  });
  