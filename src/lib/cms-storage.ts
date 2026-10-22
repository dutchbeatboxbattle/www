import fs from "fs/promises";
import path from "path";
import { CMSData } from "@/types/cms";
import { defaultCMSData } from "@/data/projects";

const LOCAL_FILE_PATH = path.join(process.cwd(), "src", "data", "cms-store.json");
const NETLIFY_STORE_NAME = "dbb-cms-store";
const NETLIFY_STORE_KEY = "cms-content";

/**
 * Bepaalt of we in een actieve Netlify-omgeving draaien.
 */
function isNetlifyEnvironment(): boolean {
  return Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_BLOBS_CONTEXT ||
      (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN)
  );
}

/**
 * Haalt de actuele CMS-data op (uit Netlify Blobs of het lokale JSON-bestand).
 */
export async function getCMSData(): Promise<CMSData> {
  if (isNetlifyEnvironment()) {
    try {
      const { getStore } = await import("@netlify/blobs");
      const store =
        process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN
          ? getStore({
              name: NETLIFY_STORE_NAME,
              siteID: process.env.NETLIFY_SITE_ID,
              token: process.env.NETLIFY_AUTH_TOKEN,
            })
          : getStore(NETLIFY_STORE_NAME);

      const storedData = (await store.get(NETLIFY_STORE_KEY, {
        type: "json",
      })) as CMSData | null;

      if (storedData && storedData.projects && storedData.roadToDbb) {
        return {
          ... storedData,
          roadToDbb: [...storedData.roadToDbb].sort((a, b) => a.order - b.order),
        };
      }

      // Als de store nog leeg is op Netlify, seed deze direct met defaultCMSData
      await store.setJSON(NETLIFY_STORE_KEY, defaultCMSData);
      return defaultCMSData;
    } catch (error) {
      console.error("Netlify Blobs leesfout, val terug op default data:", error);
    }
  }

  // Lokale bestandsopslag voor development
  try {
    const raw = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as CMSData;
    return {
      ...parsed,
      roadToDbb: [...(parsed.roadToDbb || [])].sort((a, b) => a.order - b.order),
    };
  } catch {
    try {
      await fs.mkdir(path.dirname(LOCAL_FILE_PATH), { recursive: true });
      await fs.writeFile(
        LOCAL_FILE_PATH,
        JSON.stringify(defaultCMSData, null, 2),
        "utf-8"
      );
    } catch {
      // Negeer schrijffout indien read-only
    }
    return defaultCMSData;
  }
}

/**
 * Slaat de volledige CMS-data op (in Netlify Blobs én/of lokaal JSON-bestand).
 */
export async function saveCMSData(newData: CMSData): Promise<CMSData> {
  // Normaliseer de volgorde (1, 2, 3...) van Road to DBB punten
  const normalizedRoad = [...newData.roadToDbb]
    .sort((a, b) => a.order - b.order)
    .map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

  const payload: CMSData = {
    ...newData,
    roadToDbb: normalizedRoad,
    updatedAt: new Date().toISOString(),
  };

  if (isNetlifyEnvironment()) {
    const { getStore } = await import("@netlify/blobs");
    const store =
      process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN
        ? getStore({
            name: NETLIFY_STORE_NAME,
            siteID: process.env.NETLIFY_SITE_ID,
            token: process.env.NETLIFY_AUTH_TOKEN,
          })
        : getStore(NETLIFY_STORE_NAME);

    await store.setJSON(NETLIFY_STORE_KEY, payload);
    return payload;
  }

  // Lokaal opslaan tijdens development
  await fs.mkdir(path.dirname(LOCAL_FILE_PATH), { recursive: true });
  await fs.writeFile(LOCAL_FILE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  return payload;
}
