import { Schema, model, models, Document, Types } from "mongoose";
// Remova a importação estática do Event para evitar dependência circular no runtime
// import Event from "./event.model";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook
BookingSchema.pre("save", async function () {
  const booking = this as IBooking;

  if (booking.isModified("eventId") || booking.isNew) {
    try {
      // CORREÇÃO: Pega o modelo dinamicamente para garantir que ele existe
      // e evitar problemas de importação circular
      const EventModel = models.Event || model("Event");

      const eventExists = await EventModel.findById(booking.eventId).select(
        "_id"
      );

      if (!eventExists) {
        const error = new Error(
          `Event with ID ${booking.eventId} does not exist`
        );
        error.name = "ValidationError";
        throw error;
      }
    } catch (error: unknown) {
      // Se o erro já for o nosso ValidationError, repassa ele
      if (error instanceof Error && error.name === "ValidationError") {
        throw error;
      }

      // Se for outro erro (ex: banco fora do ar), lança um genérico
      const validationError = new Error(
        "Invalid events ID format or database error"
      );
      validationError.name = "ValidationError";
      throw validationError;
    }
  }
});

BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index(
  { eventId: 1, email: 1 },
  { unique: true, name: "uniq_event_email" }
);

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
