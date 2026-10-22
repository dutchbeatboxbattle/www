import data from "./cms-store.json";
import type { CMSData } from "@/types/cms";
export const defaultCMSData = data as CMSData;
export const initialProjects = defaultCMSData.projects;
export const initialPreviousEditions = defaultCMSData.previousEditions;
export const initialRoadToDbb = defaultCMSData.roadToDbb;
export const projects = initialProjects;
