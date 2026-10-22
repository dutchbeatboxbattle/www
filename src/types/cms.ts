export type ProjectStatus = "active" | "finished" | "cancelled";

export interface ProjectItem {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  image: string;
  link?: string;
  category?: string;
  categoryEn?: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface PreviousEditionItem {
  id: string;
  title: string;
  titleEn?: string;
  edition: string;
  editionEn?: string;
  description?: string;
  descriptionEn?: string;
  youtubeUrl: string;
  embedUrl: string;
  videoId: string;
  createdAt: string;
}

export type MilestoneStatus = "completed" | "current" | "upcoming";
export type MilestoneIcon =
  | "flag"
  | "trophy"
  | "rocket"
  | "users"
  | "star"
  | "zap"
  | "calendar";

export interface RoadMilestoneItem {
  id: string;
  order: number;
  title: string;
  titleEn?: string;
  dateOrPeriod: string;
  dateOrPeriodEn?: string;
  description: string;
  descriptionEn?: string;
  status: MilestoneStatus;
  icon: MilestoneIcon;
}

export interface CMSData {
  projects: ProjectItem[];
  previousEditions: PreviousEditionItem[];
  roadToDbb: RoadMilestoneItem[];
  updatedAt: string;
}
