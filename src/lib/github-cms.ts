import type { CMSData } from "@/types/cms";
import { isSafeLink } from "./site-path";
export type GitHubConnection = {
  repository: string;
  branch: string;
  token: string;
  head: string;
};
const pendingImages = new Map<string, { path: string; content: string }>();
export function imagePreview(value: string) {
  for (const [preview, upload] of pendingImages)
    if (upload.path === value) return preview;
  return value;
}
export function clearUploads() {
  pendingImages.clear();
}
async function api(
  connection: GitHubConnection,
  route: string,
  method = "GET",
  body?: unknown,
) {
  const response = await fetch(
    `https://api.github.com/repos/${connection.repository}/${route}`,
    {
      method,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${connection.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );
  if (!response.ok) {
    if (response.status === 401)
      throw new Error("GitHub-token ongeldig of verlopen. Log opnieuw in.");
    if ([403, 404].includes(response.status))
      throw new Error(
        "Geen toegang. Controleer repository, branch en tokenrechten (Contents: read and write).",
      );
    if ([409, 422].includes(response.status))
      throw new Error(
        "Publiceren geweigerd. Controleer branchbescherming of log opnieuw in om recente wijzigingen te laden. Je invoer blijft staan.",
      );
    throw new Error(
      `GitHub kon de wijziging niet verwerken (${response.status}). Probeer opnieuw.`,
    );
  }
  return response.json();
}
export async function connectGitHub(
  repository: string,
  branch: string,
  token: string,
) {
  repository = repository.trim();
  branch = branch.trim();
  token = token.trim();
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository) || !branch || !token)
    throw new Error("Vul eigenaar/repository, branch en een GitHub-token in.");
  const connection = { repository, branch, token, head: "" };
  const ref = await api(
    connection,
    `git/ref/heads/${encodeURIComponent(branch)}`,
  );
  connection.head = ref.object.sha;
  const file = await api(
    connection,
    `contents/src/data/cms-store.json?ref=${connection.head}`,
  );
  const bytes = Uint8Array.from(atob(file.content.replace(/\s/g, "")), (c) =>
    c.charCodeAt(0),
  );
  const data = JSON.parse(new TextDecoder().decode(bytes)) as CMSData;
  if (
    !Array.isArray(data.projects) ||
    !Array.isArray(data.previousEditions) ||
    !Array.isArray(data.roadToDbb)
  )
    throw new Error("Deze repository bevat geen geldige DBB CMS-data.");
  return { connection, data };
}
export function validateContent(data: CMSData) {
  if (!isSafeLink(data.joinUrl?.trim() || "")) throw new Error("Ongeldige Doe mee-link. Gebruik https://, /pad of #anker.");
  for (const milestone of data.roadToDbb) {
    if (!isSafeLink(milestone.link?.trim() || "")) throw new Error(`Ongeldige link bij ${milestone.title}. Gebruik https://, /pad of #anker.`);
  }
  for (const project of data.projects) {
    if (!isSafeLink(project.link || ""))
      throw new Error(
        `Ongeldige projectlink bij ${project.title}. Gebruik https://, /pad of #anker.`,
      );
    if (!project.title.trim() || !project.description.trim())
      throw new Error("Elk project moet een titel en beschrijving hebben.");
    if (
      !pendingImages.has(project.image) &&
      (!isSafeLink(project.image) ||
        project.image.startsWith("#") ||
        !project.image)
    )
      throw new Error(`Ongeldige afbeelding bij ${project.title}.`);
  }
}
export async function publishContent(
  connection: GitHubConnection,
  data: CMSData,
) {
  validateContent(data);
  const ref = await api(
    connection,
    `git/ref/heads/${encodeURIComponent(connection.branch)}`,
  );
  if (ref.object.sha !== connection.head)
    throw new Error(
      "De repository is intussen gewijzigd. Kopieer je invoer en log opnieuw in voordat je opslaat; zo worden andere wijzigingen niet overschreven.",
    );
  const parent = await api(connection, `git/commits/${connection.head}`);
  const payload: CMSData = {
    ...data,
    updatedAt: new Date().toISOString(),
    roadToDbb: [...data.roadToDbb]
      .sort((a, b) => a.order - b.order)
      .map((item, i) => ({ ...item, order: i + 1 })),
    projects: data.projects.map((item) => ({ ...item })),
  };
  const tree: {
    path: string;
    mode: string;
    type: string;
    sha?: string;
    content?: string;
  }[] = [];
  const images = new Map<string, string>();
  for (const project of payload.projects) {
    const upload = pendingImages.get(project.image);
    if (!upload) continue;
    if (!images.has(upload.path)) {
      const blob = await api(connection, "git/blobs", "POST", {
        content: upload.content,
        encoding: "base64",
      });
      tree.push({
        path: `public${upload.path}`,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });
      images.set(upload.path, blob.sha);
    }
    project.image = upload.path;
  }
  tree.push({
    path: "src/data/cms-store.json",
    mode: "100644",
    type: "blob",
    content: JSON.stringify(payload, null, 2) + "\n",
  });
  const createdTree = await api(connection, "git/trees", "POST", {
    base_tree: parent.tree.sha,
    tree,
  });
  const commit = await api(connection, "git/commits", "POST", {
    message: "Update DBB content and images",
    tree: createdTree.sha,
    parents: [connection.head],
  });
  await api(
    connection,
    `git/refs/heads/${encodeURIComponent(connection.branch)}`,
    "PATCH",
    { sha: commit.sha, force: false },
  );
  return { data: payload, connection: { ...connection, head: commit.sha } };
}
export async function prepareImage(file: File): Promise<string> {
  if (
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
  )
    throw new Error("Kies een JPG, PNG, WebP of AVIF afbeelding.");
  if (file.size > 10 * 1024 * 1024)
    throw new Error("De afbeelding mag maximaal 10 MB zijn.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Afbeelding kon niet worden verwerkt.");
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const preview = canvas.toDataURL("image/webp", 0.85);
  if (!preview.startsWith("data:image/webp;"))
    throw new Error(
      "Je browser ondersteunt geen WebP-upload. Gebruik een recente browser.",
    );
  if (preview.length > 2 * 1024 * 1024)
    throw new Error(
      "De gecomprimeerde afbeelding is te groot. Kies een kleinere afbeelding.",
    );
  pendingImages.set(preview, {
    path: `/uploads/${crypto.randomUUID()}.webp`,
    content: preview.split(",")[1],
  });
  return preview;
}
