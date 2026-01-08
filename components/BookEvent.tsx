"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState(""); // Novo estado para mensagem personalizada

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await createBooking({ eventId, slug, email });

    if (response.success) {
      setSubmitted(true);

      if (response.isNew) {
        // Se for novo, dispara evento de analytics
        posthog.capture("event_booked", { eventId, slug, email });
        setMessage("Thank you for signing up!");
      } else {
        // Se já existia no banco, apenas mostra mensagem diferente
        setMessage("You are already registered for this event!");
      }
    } else {
      console.error("Booking creation failed. Reason:", response.error);
      posthog.captureException(`Booking failed: ${JSON.stringify(response)}`);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <div className="text-center p-4 bg-green-50 rounded-md border border-green-200">
          {/* Mostra a mensagem dinâmica baseada no banco */}
          <p className="text-green-800 font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
