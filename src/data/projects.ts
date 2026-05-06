export interface Project {
    id: string;
    title: string;
    description: string;
    image: string; // placeholder or actual image path
    buttonText?: string;
    buttonLink?: string;
    isFinished: boolean;
    overlayImage?: string; // optional overlay image for finished projects
}

// Projects array - easily add or remove projects here
export const projects: Project[] = [
    {
        id: "dutch-beatbox-champions-league",
        title: "Dutch Beatbox Champions League",
        description:
            "Een competitie voor de (oud) kampioenen human beatbox in Nederland. Tegelijk met DBB qualifier. Tijdens Urban Matterz 2026.",
        image: "/projects/champions-league-placeholder.jpg",
        buttonText: "DBB Qualifier Inschrijving",
        buttonLink: "https://forms.gle/phh9i81W7fSdwfGU7",
        isFinished: false,
    },
    {
        id: "dbb x whc",
        title: "Beats en Basketball in Zaandam!",
        description:
            "DBB stond op de World Hoops Classic op 2 mei 2026 in Sporthal Zaanstad Zuid met een exclusieve experience. Waar de basketbal en beatbox culture elkaar ontmoette in een dag vol actie!",
        image: "/projects/fotoclp.avif",
        buttonText: "Website and info",
        buttonLink: "https://www.thenorthsplash.nl/world-hoops-classic-zaanstad/dutch-beatbox-battle",
        isFinished: true,
    },
    {
        id: "loop-di-loop",
        title: "Loop-di-Loop",
        description:
            "Het loopstation format waarbij beatboxers live complete tracks opbouwen met stemlagen, ritmes, baslijnen en melodieën.",
        image: "/projects/loop-di-loop-placeholder.jpg",
        buttonText: "Editie Afgelopen",
        buttonLink: "mailto:dutchbeatboxbattle@gmail.com?subject=Aanmelden%20Mailinglist",
        isFinished: false,
    },
    {
        id: "beat-em-up",
        title: "Beat 'Em Up",
        description:
            "Een intense battle format waarin beatboxers head-to-head gaan. Snelle eliminatie rondes, pure skill en maximale energie.",
        image: "/projects/beat-em-up-placeholder.jpg",
        buttonText: "Editie Afgelopen",
        buttonLink: "mailto:dutchbeatboxbattle@gmail.com?subject=Aanmelden%20Mailinglist",
        isFinished: false,
    },
    {
        id: "community-day",
        title: "Dutch Beatbox Community Day",
        description:
            "Een dag gewijd aan de Nederlandse beatboxcommunity, met workshops, battles en netwerkmogelijkheden.",
        image: "/projects/community.jpg",
        buttonText: "TBA",
        buttonLink: "mailto:dutchbeatboxbattle@gmail.com?subject=Aanmelden%20Mailinglist",
        isFinished: false,
    },
    {
        id: "community-jams",
        title: "Official Community Jams",
        description:
            "De officiele jamsessies georganiseerd door Dutch Beatbox Battle, veelal in Almere.",
        image: "/projects/jams.jpg",
        buttonText: "",
        buttonLink: "",
        isFinished: false,
    },
];

// Helper function to add a new project
export const addProject = (project: Project): Project[] => {
    return [...projects, project];
};

// Helper function to remove a project by id
export const removeProject = (projectId: string): Project[] => {
    return projects.filter((p) => p.id !== projectId);
};

// Helper function to mark a project as finished
export const markProjectFinished = (projectId: string): Project[] => {
    return projects.map((p) =>
        p.id === projectId ? { ...p, isFinished: true } : p
    );
};
