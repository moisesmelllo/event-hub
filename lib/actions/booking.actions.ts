"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectDB();

    await Booking.create({ eventId, slug, email });

    return { success: true, isNew: true }; // Sucesso: Criou novo
  } catch (error: any) {
    // Se o erro for código 11000, significa que JÁ EXISTE no banco
    if (error.code === 11000) {
      return {
        success: true, // Consideramos sucesso pois o objetivo (estar inscrito) foi atingido
        isNew: false, // Flag para avisar que não é novo
        message: "Você já está inscrito neste evento.",
      };
    }

    console.error("create booking failed", error);
    return { success: false, error: error.message };
  }
};
