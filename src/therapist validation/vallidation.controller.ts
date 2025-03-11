// // Booking API Endpoint
// export async function bookTherapist(req, res) {
//     const { therapistId, userId, bookingDate } = req.body;
  
//     // Check if the therapist is available
//     const existingBooking = await db
//       .select()
//       .from(bookings)
//       .where((b) => b.therapistId.eq(therapistId) && b.bookingDate.eq(bookingDate))
//       .first();
  
//     if (existingBooking) {
//       return res.status(400).json({ message: 'Therapist is already booked for this slot.' });
//     }
  
//     // Proceed with booking
//     await db.insert(bookings).values({ therapistId, userId, bookingDate });
  
//     res.status(201).json({ message: 'Booking successful' });
//   }