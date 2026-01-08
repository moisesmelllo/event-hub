import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
// Ajuste o import do IEvent conforme seu projeto (se for database/event.model.ts ou similar)
import { IEvent } from "@/database/event.model";

// Adicionei o fallback "|| ..." para evitar erro se o .env falhar localmente
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const Page = async () => {
  const response = await fetch(`${BASE_URL}/api/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Erro no fetch:", response.status, response.statusText);
    return <div>Erro ao carregar dados</div>;
  }

  // MUDANÇA PRINCIPAL AQUI:
  // Sua API retorna { events: [...] }, então usamos desestruturação { events }
  // Se não fizer isso, você tenta fazer .map em um objeto, o que quebra.
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, ALl in One place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {/* Verifica se 'events' existe E se é um array antes de mapear */}
          {Array.isArray(events) && events.length > 0 ? (
            events.map((event: IEvent) => (
              // Preferência para _id como key, title como fallback
              <li key={event._id?.toString() || event.title}>
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <p className="text-center">Nenhum evento encontrado.</p>
          )}
        </ul>
      </div>
    </section>
  );
};

export default Page;
