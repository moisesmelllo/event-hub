export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "Workshop de React Native",
    slug: "workshop-react-native",
    location: "São Paulo, SP",
    date: "15 Mar, 2026",
    time: "09:00 - 16:00",
  },
  {
    image: "/images/event2.png",
    title: "Tech Summit 2026",
    slug: "tech-summit-2026",
    location: "United States",
    date: "22 Abr, 2026",
    time: "14:00 - 18:00",
  },
  {
    image: "/images/event3.png",
    title: "Meetup de UI/UX Design",
    slug: "meetup-ui-ux-design",
    location: "Rio de Janeiro, RJ",
    date: "05 Mai, 2026",
    time: "19:00 - 21:30",
  },
  {
    image: "/images/event4.png",
    title: "DevOps Days",
    slug: "devops-days",
    location: "Florianópolis, SC",
    date: "12 Jun, 2026",
    time: "08:30 - 17:00",
  },
  {
    image: "/images/event5.png",
    title: "Hackathon Open Source",
    slug: "hackathon-open-source",
    location: "Belo Horizonte, MG",
    date: "10 Jul, 2026",
    time: "24h - Início às 18:00",
  },
  {
    image: "/images/event6.png",
    title: "Conferência de Inteligência Artificial",
    slug: "conferencia-ia",
    location: "Curitiba, PR",
    date: "20 Ago, 2026",
    time: "10:00 - 15:00",
  },
];
