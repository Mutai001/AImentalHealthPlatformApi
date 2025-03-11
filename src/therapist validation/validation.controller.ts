// // API Route to Check Availability
// import { db } from '../drizzle/db';
// import { bookings } from '../models/bookings';

// export async function checkTherapistAvailability(req, res) {
//   const { therapistId, bookingDate } = req.body;

//   const existingBooking = await db
//     .select()
//     .from(bookings)
//     .where((b) => b.therapistId.eq(therapistId) && b.bookingDate.eq(bookingDate))
//     .first();

//   if (existingBooking) {
//     return res.status(400).json({ message: 'Therapist is not available at this time.' });
//   }

//   res.json({ available: true });
// }
