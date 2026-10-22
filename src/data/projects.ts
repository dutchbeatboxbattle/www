import { CMSData, ProjectItem, PreviousEditionItem, RoadMilestoneItem } from "@/types/cms";

export const initialProjects: ProjectItem[] = [
  {
    id: "proj-champions-league",
    title: "DBB Champions League",
    description:
      "Het grootste competitieve toernooi van de community waarin de beste teams strijden om de felbegeerde DBB-titel.",
    image: "/projects/champions-league-placeholder.jpg",
    link: "#contact",
    category: "Toernooi",
    status: "active",
    createdAt: "2025-01-10T12:00:00.000Z",
  },
  {
    id: "proj-beat-em-up",
    title: "DBB Beat 'Em Up",
    description:
      "Een actievolle arcade beat 'em up ervaring ontwikkeld met en voor de DBB-community.",
    image: "/projects/beat-em-up-placeholder.jpg",
    link: "#projects",
    category: "Game Development",
    status: "active",
    createdAt: "2025-01-12T12:00:00.000Z",
  },
  {
    id: "proj-loop-di-loop",
    title: "Loop-di-Loop Challenge",
    description:
      "Een chaotische en razendsnelle race- en stuntuitdaging waarin precisie en snelheid centraal staan.",
    image: "/projects/loop-di-loop-placeholder.jpg",
    link: "#projects",
    category: "Event",
    status: "finished",
    createdAt: "2025-01-15T12:00:00.000Z",
  },
  {
    id: "proj-community-jams",
    title: "DBB Community Game Jams",
    description:
      "Samen binnen 48 uur creatieve games en prototypes bouwen tijdens onze energieke community jams.",
    image: "/projects/jams.jpg",
    link: "#projects",
    category: "Community",
    status: "active",
    createdAt: "2025-01-18T12:00:00.000Z",
  },
];

export const initialPreviousEditions: PreviousEditionItem[] = [
  {
    id: "ed-1",
    title: "DBB Aftermovie & Hoogtepunten",
    edition: "Editie 1",
    description: "Bekijk de beste momenten, wedstrijden en sfeer van onze eerdere DBB-editie.",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    createdAt: "2025-01-01T12:00:00.000Z",
  },
];

export const initialRoadToDbb: RoadMilestoneItem[] = [
  {
    id: "road-1",
    order: 1,
    title: "Concept & Community Kick-off",
    dateOrPeriod: "Fase 1",
    description:
      "Het samenbrengen van de kerngroep, het vastleggen van de spelregels en het openen van de inschrijvingen.",
    status: "completed",
    icon: "flag",
  },
  {
    id: "road-2",
    order: 2,
    title: "Kwalificatierondes & Game Jams",
    dateOrPeriod: "Fase 2",
    description:
      "Teams en deelnemers nemen het tegen elkaar op in de voorrondes en bouwen mee aan nieuwe community-projecten.",
    status: "current",
    icon: "zap",
  },
  {
    id: "road-3",
    order: 3,
    title: "De Grote DBB Finale",
    dateOrPeriod: "Fase 3",
    description:
      "Het hoofdevenement met live uitzending, prijsuitreiking en de kroning van de nieuwe DBB-kampioenen.",
    status: "upcoming",
    icon: "trophy",
  },
];

export const defaultCMSData: CMSData = {
  projects: initialProjects,
  previousEditions: initialPreviousEditions,
  roadToDbb: initialRoadToDbb,
  updatedAt: new Date().toISOString(),
};

// Backwards-compatible export
export const projects = initialProjects;
