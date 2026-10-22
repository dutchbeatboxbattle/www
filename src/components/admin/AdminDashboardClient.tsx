"use client";

import { TranslationFields, ImageUpload } from "./ContentFields";
import {
  connectGitHub,
  publishContent,
  clearUploads,
  imagePreview,
  type GitHubConnection,
} from "@/lib/github-cms";
import { sitePath } from "@/lib/site-path";
import React, { useState } from "react";
import {
  CMSData,
  ProjectItem,
  ProjectStatus,
  PreviousEditionItem,
  RoadMilestoneItem,
  MilestoneStatus,
  MilestoneIcon,
} from "@/types/cms";
import { parseYouTubeUrl } from "@/lib/youtube";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  Film,
  FolderKanban,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Pencil,
} from "lucide-react";

interface AdminDashboardClientProps {
  initialAuthenticated: boolean;
  initialData: CMSData;
}

const AVAILABLE_PROJECT_IMAGES = [
  {
    label: "Champions League",
    value: "/projects/champions-league-placeholder.jpg",
  },
  { label: "Beat 'Em Up", value: "/projects/beat-em-up-placeholder.jpg" },
  { label: "Loop-di-Loop", value: "/projects/loop-di-loop-placeholder.jpg" },
  { label: "Community Jams", value: "/projects/jams.jpg" },
  { label: "Community Foto", value: "/projects/community.jpg" },
  { label: "CLP Foto", value: "/projects/fotoclp.avif" },
  { label: "Project 01", value: "/projects/01.webp" },
];

export default function AdminDashboardClient({
  initialAuthenticated,
  initialData,
}: AdminDashboardClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [connection, setConnection] = useState<GitHubConnection | null>(null);
  const [repository, setRepository] = useState(
    process.env.NEXT_PUBLIC_GITHUB_REPOSITORY || "",
  );
  const [branch, setBranch] = useState(
    process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main",
  );
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [data, setData] = useState<CMSData>(initialData);
  const [activeTab, setActiveTab] = useState<"projects" | "editions" | "road" | "settings">(
    "projects",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // --- STATE VOOR BEWERKEN ---
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingEditionId, setEditingEditionId] = useState<string | null>(null);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null,
  );

  // --- STATE VOOR NIEUW PROJECT ---
  const [newProject, setNewProject] = useState({
    titleEn: "",
    descriptionEn: "",
    categoryEn: "",
    title: "",
    description: "",
    image: "/projects/champions-league-placeholder.jpg",
    link: "",
    category: "Event",
    status: "active" as ProjectStatus,
  });

  // --- STATE VOOR NIEUWE YOUTUBE VIDEO ---
  const [newVideo, setNewVideo] = useState({
    titleEn: "",
    descriptionEn: "",
    editionEn: "",
    title: "",
    edition: "Editie 2025",
    description: "",
    youtubeUrl: "",
  });

  // --- STATE VOOR NIEUWE ROAD TO DBB MIJLPAAL ---
  const [newMilestone, setNewMilestone] = useState({
    titleEn: "",
    descriptionEn: "",
    dateOrPeriodEn: "",
    title: "",
    dateOrPeriod: "",
    link: "",
    description: "",
    status: "upcoming" as MilestoneStatus,
    icon: "flag" as MilestoneIcon,
    insertAtPosition: initialData.roadToDbb.length + 1,
  });

  // ============================================================================
  // AUTHENTICATIE HANDLERS
  // ============================================================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const result = await connectGitHub(repository, branch, password);
      setConnection(result.connection);
      setData(result.data);
      setIsAuthenticated(true);
      setPassword("");
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Verbinding met GitHub mislukt.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setConnection(null);
    clearUploads();
    setIsAuthenticated(false);
  };

  // ============================================================================
  // OPSLAAN HELPER (PERSISTENTIE VIA GITHUB)
  // ============================================================================
  const persistChanges = async (
    updatedData: CMSData,
    successMessage: string,
  ) => {
    setIsSaving(true);
    setFeedback(null);

    try {
      if (!connection) throw new Error("Log eerst in met GitHub.");
      const result = await publishContent(connection, updatedData);
      setConnection(result.connection);
      const savedData = result.data;
      setData(savedData);
      setFeedback({
        type: "success",
        message:
          successMessage +
          " GitHub bouwt de website opnieuw; de live versie volgt na een geslaagde publicatie.",
      });
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Fout bij opslaan van wijzigingen.";
      setFeedback({ type: "error", message: msg });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveItem = async (
    collection: "projects" | "previousEditions",
    id: string,
    direction: -1 | 1,
  ) => {
    if (isSaving || isUploading || editingProjectId || editingEditionId || editingMilestoneId) return;
    const items = data[collection];
    const index = items.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;

    function reordered<T>(list: T[]): T[] {
      const copy = [...list];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    }

    const updated: CMSData = collection === "projects"
      ? { ...data, projects: reordered(data.projects) }
      : { ...data, previousEditions: reordered(data.previousEditions) };

    await persistChanges(updated, "Volgorde opgeslagen!");
  };

  const renderOrderButtons = (
    collection: "projects" | "previousEditions",
    id: string,
  ) => {
    const items = data[collection];
    const index = items.findIndex((item) => item.id === id);
    if (index < 0) return null;
    const disabled = isSaving || isUploading || Boolean(
      editingProjectId || editingEditionId || editingMilestoneId
    );
    return (
      <div className="flex items-center gap-1">
        <span className="mr-1 text-xs text-zinc-400">{index + 1}/{items.length}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || index === 0}
          onClick={() => handleMoveItem(collection, id, -1)}
          aria-label={`Naar voren: ${items[index].title}`}
          title="Eén plek naar voren (wordt direct opgeslagen)"
          className="h-8 border-zinc-700 bg-zinc-800 px-2 text-white hover:bg-zinc-700"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || index === items.length - 1}
          onClick={() => handleMoveItem(collection, id, 1)}
          aria-label={`Naar achteren: ${items[index].title}`}
          title="Eén plek naar achteren (wordt direct opgeslagen)"
          className="h-8 border-zinc-700 bg-zinc-800 px-2 text-white hover:bg-zinc-700"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // ============================================================================
  // MODULE 1: PROJECTEN LOGICA
  // ============================================================================
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      titleEn: newProject.titleEn.trim(),
      descriptionEn: newProject.descriptionEn.trim(),
      categoryEn: newProject.categoryEn.trim(),
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      image: newProject.image.trim() || "/projects/01.webp",
      link: newProject.link.trim() || undefined,
      category: newProject.category.trim() || undefined,
      status: newProject.status,
      createdAt: new Date().toISOString(),
    };

    const updated: CMSData = {
      ...data,
      projects: [created, ...data.projects],
    };

    try {
      if (!(await persistChanges(updated, "Project succesvol toegevoegd!")))
        return;
      setNewProject({
        titleEn: "",
        descriptionEn: "",
        categoryEn: "",
        title: "",
        description: "",
        image: "/projects/champions-league-placeholder.jpg",
        link: "",
        category: "Event",
        status: "active",
      });
    } catch (err) {
      console.error("Fout bij opslaan project:", err);
    }
  };

  const handleUpdateProjectStatus = async (
    projectId: string,
    newStatus: ProjectStatus,
  ) => {
    const updatedProjects = data.projects.map((p) =>
      p.id === projectId ? { ...p, status: newStatus } : p,
    );
    await persistChanges(
      { ...data, projects: updatedProjects },
      "Projectstatus is bijgewerkt!",
    );
  };

  const handleUpdateProjectField = (
    id: string,
    field: keyof ProjectItem,
    value: string,
  ) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    }));
  };

  const handleSaveProjectEdits = async () => {
    if (await persistChanges(data, "Project wijzigingen opgeslagen!"))
      setEditingProjectId(null);
  };

  const handleDeleteProject = async (projectId: string, title: string) => {
    if (
      !window.confirm(
        `Weet je zeker dat je het project "${title}" definitief wilt verwijderen?`,
      )
    ) {
      return;
    }
    const updatedProjects = data.projects.filter((p) => p.id !== projectId);
    await persistChanges(
      { ...data, projects: updatedProjects },
      `Project "${title}" is verwijderd.`,
    );
  };

  // ============================================================================
  // MODULE 2: PREVIOUS EDITIONS (YOUTUBE) LOGICA
  // ============================================================================
  const parsedPreview = parseYouTubeUrl(newVideo.youtubeUrl);

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseYouTubeUrl(newVideo.youtubeUrl);

    if (!parsed.isValid || !parsed.embedUrl || !parsed.videoId) {
      setFeedback({
        type: "error",
        message:
          "Ongeldige YouTube-link. Plak een geldige youtube.com/watch?v=... of youtu.be/... link.",
      });
      return;
    }

    const created: PreviousEditionItem = {
      id: `ed-${Date.now()}`,
      titleEn: newVideo.titleEn.trim(),
      descriptionEn: newVideo.descriptionEn.trim(),
      editionEn: newVideo.editionEn.trim(),
      title: newVideo.title.trim() || "DBB Editie Video",
      edition: newVideo.edition.trim() || "Previous Edition",
      description: newVideo.description.trim() || undefined,
      youtubeUrl: newVideo.youtubeUrl.trim(),
      embedUrl: parsed.embedUrl,
      videoId: parsed.videoId,
      createdAt: new Date().toISOString(),
    };

    const updated: CMSData = {
      ...data,
      previousEditions: [created, ...data.previousEditions],
    };

    if (
      !(await persistChanges(
        updated,
        `Video "${created.title}" is toegevoegd aan Previous Editions!`,
      ))
    )
      return;
    setNewVideo({
      titleEn: "",
      descriptionEn: "",
      editionEn: "",
      title: "",
      edition: "Editie 2025",
      description: "",
      youtubeUrl: "",
    });
  };

  const handleUpdateEditionField = (
    id: string,
    field: keyof PreviousEditionItem,
    value: string,
  ) => {
    setData((prev) => {
      const updatedEditions = prev.previousEditions.map((ed) => {
        if (ed.id === id) {
          const updatedEd = { ...ed, [field]: value };
          // Als de YouTube URL wordt aangepast, probeer deze direct te parsen voor de embed URL
          if (field === "youtubeUrl") {
            const parsed = parseYouTubeUrl(value);
            if (parsed.isValid && parsed.embedUrl && parsed.videoId) {
              updatedEd.embedUrl = parsed.embedUrl;
              updatedEd.videoId = parsed.videoId;
            }
          }
          return updatedEd;
        }
        return ed;
      });
      return { ...prev, previousEditions: updatedEditions };
    });
  };

  const handleSaveEditionEdits = async () => {
    if (await persistChanges(data, "Video wijzigingen opgeslagen!"))
      setEditingEditionId(null);
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Weet je zeker dat je de video "${title}" wilt verwijderen?`,
      )
    ) {
      return;
    }
    const updatedEditions = data.previousEditions.filter((v) => v.id !== id);
    await persistChanges(
      { ...data, previousEditions: updatedEditions },
      `Video "${title}" is verwijderd.`,
    );
  };

  // ============================================================================
  // MODULE 3: ROAD TO DBB LOGICA (INCL. POSITIE-INVOEGING & REORDERING)
  // ============================================================================
  const sortedMilestones = [...data.roadToDbb].sort(
    (a, b) => a.order - b.order,
  );

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title.trim()) return;

    const targetIndex = Math.max(
      0,
      Math.min(
        sortedMilestones.length,
        Number(newMilestone.insertAtPosition) - 1,
      ),
    );

    const created: RoadMilestoneItem = {
      id: `road-${Date.now()}`,
      order: targetIndex + 1,
      titleEn: newMilestone.titleEn.trim(),
      descriptionEn: newMilestone.descriptionEn.trim(),
      dateOrPeriodEn: newMilestone.dateOrPeriodEn.trim(),
      title: newMilestone.title.trim(),
      link: newMilestone.link.trim() || undefined,
      dateOrPeriod: newMilestone.dateOrPeriod.trim() || "Nieuwe Fase",
      description: newMilestone.description.trim(),
      status: newMilestone.status,
      icon: newMilestone.icon,
    };

    const updatedList = [...sortedMilestones];
    updatedList.splice(targetIndex, 0, created);

    const reindexed = updatedList.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    if (
      !(await persistChanges(
        { ...data, roadToDbb: reindexed },
        `Mijlpaal "${created.title}" is ingevoegd op positie #${targetIndex + 1}!`,
      ))
    )
      return;

    setNewMilestone({
      titleEn: "",
      descriptionEn: "",
      dateOrPeriodEn: "",
      title: "",
      dateOrPeriod: "",
    link: "",
      description: "",
      status: "upcoming",
      icon: "flag",
      insertAtPosition: reindexed.length + 1,
    });
  };

  const handleMoveMilestone = async (
    index: number,
    direction: "up" | "down",
  ) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedMilestones.length) return;

    const list = [...sortedMilestones];
    const [moved] = list.splice(index, 1);
    list.splice(targetIndex, 0, moved);

    const reindexed = list.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    await persistChanges(
      { ...data, roadToDbb: reindexed },
      `Volgorde aangepast: "${moved.title}" staat nu op positie #${targetIndex + 1}.`,
    );
  };

  const handleUpdateMilestoneField = (
    id: string,
    field: keyof RoadMilestoneItem,
    value: string | number,
  ) => {
    setData((prev) => ({
      ...prev,
      roadToDbb: prev.roadToDbb.map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  };

  const handleSaveMilestoneEdits = async () => {
    if (
      await persistChanges(
        data,
        "Wijzigingen aan de Road to DBB zijn opgeslagen!",
      )
    )
      setEditingMilestoneId(null);
  };

  const handleDeleteMilestone = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Weet je zeker dat je mijlpaal "${title}" wilt verwijderen?`,
      )
    ) {
      return;
    }
    const filtered = sortedMilestones
      .filter((m) => m.id !== id)
      .map((item, idx) => ({ ...item, order: idx + 1 }));

    await persistChanges(
      { ...data, roadToDbb: filtered },
      `Mijlpaal "${title}" is verwijderd.`,
    );
  };

  // ============================================================================
  // RENDER: INLOGSCHERM INDIEN NIET INGELOGD
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-white shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
                <Lock className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                DBB Beheersysteem
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Log in met een GitHub-token voor deze repository. Het token
                blijft alleen in het geheugen van dit tabblad en verdwijnt bij
                uitloggen of herladen.
              </p>
            </div>

            {authError && (
              <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block text-xs text-zinc-300">
                GitHub repository
                <input
                  required
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  placeholder="eigenaar/repository"
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm"
                />
              </label>
              <label className="block text-xs text-zinc-300">
                Branch
                <input
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm"
                />
              </label>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  GitHub-token (Contents: read and write)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
              >
                {authLoading ? "Controleren..." : "Inloggen op Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // RENDER: ADMIN DASHBOARD
  // ============================================================================
  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      {/* Topbalk */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={sitePath("/img/logo-dbb.png")}
              alt="DBB"
              className="h-9 w-auto object-contain"
            />
            <div>
              <h1 className="text-base font-bold leading-none">
                DBB Admin Dashboard
              </h1>
              <span className="text-xs text-zinc-400">
                Laatst bijgewerkt:{" "}
                {new Date(data.updatedAt).toLocaleString("nl-NL")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={sitePath("/")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-amber-400 transition-colors"
            >
              Bekijk Live Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              variant="outline"
              size="sm"
              disabled={isSaving || isUploading}
              onClick={handleLogout}
              className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Uitloggen
            </Button>
          </div>
        </div>
      </header>

      <fieldset
        disabled={isSaving || isUploading}
        className="container mx-auto px-4 max-w-6xl mt-8"
      >
        {/* Feedback Melding */}
        {feedback && (
          <div
            role="status"
            className={`mb-6 rounded-xl border p-4 flex items-center justify-between ${
              feedback.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/15 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs underline opacity-80 hover:opacity-100"
            >
              Sluiten
            </button>
          </div>
        )}

        {/* Navigatie Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800 pb-4">
          <Button
            onClick={() => setActiveTab("projects")}
            variant={activeTab === "projects" ? "default" : "outline"}
            className={
              activeTab === "projects"
                ? "bg-amber-500 text-black font-bold hover:bg-amber-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }
          >
            <FolderKanban className="h-4 w-4 mr-2" />
            1. Projecten ({data.projects.length})
          </Button>
          <Button
            onClick={() => setActiveTab("editions")}
            variant={activeTab === "editions" ? "default" : "outline"}
            className={
              activeTab === "editions"
                ? "bg-amber-500 text-black font-bold hover:bg-amber-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }
          >
            <Film className="h-4 w-4 mr-2" />
            2. Previous Editions ({data.previousEditions.length})
          </Button>
          <Button
            onClick={() => setActiveTab("road")}
            variant={activeTab === "road" ? "default" : "outline"}
            className={
              activeTab === "road"
                ? "bg-amber-500 text-black font-bold hover:bg-amber-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }
          >
            <MapPin className="h-4 w-4 mr-2" />
            3. Road to DBB ({data.roadToDbb.length})
          </Button>
          <Button onClick={() => setActiveTab("settings")}
            variant={activeTab === "settings" ? "default" : "outline"}
            className={activeTab === "settings" ? "bg-amber-500 text-black font-bold hover:bg-amber-400" : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"}>
            4. Website-instellingen
          </Button>
        </div>

        {activeTab === "settings" && (
          <Card className="border-zinc-800 bg-zinc-900 text-white max-w-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Doe mee-knop</h2>
              <p className="text-sm text-zinc-400">Laat de link leeg om de knop grijs en niet klikbaar te maken. Vul een link in om deelname weer mogelijk te maken. De link opent in een nieuw tabblad.</p>
              <label className="block text-sm font-medium">
                Deelname-link (optioneel)
                <input value={data.joinUrl || ""} placeholder="https://..."
                  onChange={event => setData(previous => ({ ...previous, joinUrl: event.target.value }))}
                  className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-white" />
              </label>
              <p className="text-sm text-zinc-400">Status na opslaan: {data.joinUrl?.trim() ? "actief" : "uitgeschakeld"}.</p>
              <Button onClick={() => persistChanges({ ...data, joinUrl: data.joinUrl?.trim() || "" }, "Website-instellingen opgeslagen!")}>
                <Save className="h-4 w-4 mr-2" />Instellingen opslaan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ================================================================= */}
        {/* TAB 1: PROJECTEN BEHEREN                                          */}
        {/* ================================================================= */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Nieuw Project Formulier */}
            <Card className="border-zinc-800 bg-zinc-900 text-white h-fit">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-amber-400" />
                  Nieuw Project Toevoegen
                </h2>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <ImageUpload
                    onBusyChange={setIsUploading}
                    value={newProject.image}
                    onChange={(value) =>
                      setNewProject((prev) => ({ ...prev, image: value }))
                    }
                  />
                  <TranslationFields
                    value={newProject}
                    extra="categoryEn"
                    onChange={(key, value) =>
                      setNewProject((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Project Titel *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) =>
                        setNewProject({ ...newProject, title: e.target.value })
                      }
                      placeholder="Bijv. DBB Winter Cup"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Categorie
                    </label>
                    <input
                      type="text"
                      value={newProject.category}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          category: e.target.value,
                        })
                      }
                      placeholder="Bijv. Toernooi, Game, Community"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Kies Bestaande Afbeelding of voer pad/URL in
                    </label>
                    <select
                      value={
                        AVAILABLE_PROJECT_IMAGES.some(
                          (img) => img.value === newProject.image,
                        )
                          ? newProject.image
                          : "custom"
                      }
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          setNewProject({
                            ...newProject,
                            image: e.target.value,
                          });
                        }
                      }}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white mb-2"
                    >
                      {AVAILABLE_PROJECT_IMAGES.map((img) => (
                        <option key={img.value} value={img.value}>
                          {img.label} ({img.value})
                        </option>
                      ))}
                      <option value="custom">Anders / Eigen URL...</option>
                    </select>
                    <input
                      type="text"
                      value={
                        newProject.image.startsWith("data:")
                          ? ""
                          : newProject.image
                      }
                      onChange={(e) =>
                        setNewProject({ ...newProject, image: e.target.value })
                      }
                      placeholder="/projects/mijn-afbeelding.jpg of https://..."
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Initiële Status
                    </label>
                    <select
                      value={newProject.status}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          status: e.target.value as ProjectStatus,
                        })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    >
                      <option value="active">Actief / Lopend</option>
                      <option value="finished">
                        Finished (geel stempel)
                      </option>
                      <option value="cancelled">Geannuleerd</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Doorklik-link (optioneel)
                    </label>
                    <input
                      type="text"
                      aria-label="Nieuwe project link / URL"
                      value={newProject.link}
                      onChange={(e) =>
                        setNewProject({ ...newProject, link: e.target.value })
                      }
                      placeholder="https://... of #contact"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Beschrijving *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      placeholder="Korte beschrijving van het project..."
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Project Toevoegen
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Overzicht Bestaande Projecten */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold">
                Huidige Projecten Beheren ({data.projects.length})
              </h2>
              {data.projects.map((proj) => {
                const isEditing = editingProjectId === proj.id;

                return (
                  <Card
                    key={proj.id}
                    className="border-zinc-800 bg-zinc-900 text-white overflow-hidden"
                  >
                    <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative h-24 w-36 shrink-0 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
                        <img
                          src={sitePath(imagePreview(proj.image))}
                          alt={proj.title}
                          className="h-full w-full object-cover"
                        />
                        {proj.status === "finished" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-yellow-950/40 backdrop-blur-[1px]">
                            <span className="rounded-lg border-2 border-yellow-400 bg-black/80 px-2 py-1 text-xs font-black uppercase tracking-widest text-yellow-400 -rotate-6 shadow-xl">
                              Finished
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        {isEditing ? (
                          <div className="space-y-3 w-full">
                            <TranslationFields
                              value={proj}
                              extra="categoryEn"
                              onChange={(key, value) =>
                                handleUpdateProjectField(proj.id, key, value)
                              }
                            />
                            <ImageUpload
                              onBusyChange={setIsUploading}
                              value={proj.image}
                              onChange={(value) =>
                                handleUpdateProjectField(
                                  proj.id,
                                  "image",
                                  value,
                                )
                              }
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={proj.title}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                                placeholder="Titel"
                              />
                              <input
                                type="text"
                                value={proj.category || ""}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    "category",
                                    e.target.value,
                                  )
                                }
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                                placeholder="Categorie (bijv. Event)"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={
                                  proj.image.startsWith("data:")
                                    ? ""
                                    : proj.image
                                }
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    "image",
                                    e.target.value,
                                  )
                                }
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                                placeholder="Afbeelding URL of pad"
                              />
                              <input
                                type="text"
                                aria-label="Project link / URL"
                                value={proj.link || ""}
                                onChange={(e) =>
                                  handleUpdateProjectField(
                                    proj.id,
                                    "link",
                                    e.target.value,
                                  )
                                }
                                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                                placeholder="Link (bijv. https://...)"
                              />
                            </div>

                            <textarea
                              rows={2}
                              value={proj.description}
                              onChange={(e) =>
                                handleUpdateProjectField(
                                  proj.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                              placeholder="Beschrijving..."
                            />

                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={handleSaveProjectEdits}
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-8"
                              >
                                <Save className="h-3.5 w-3.5 mr-1" />
                                Opslaan
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-base truncate">
                                {proj.title}
                              </h3>
                              {proj.category && (
                                <span className="text-xs rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                                  {proj.category}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                              {proj.description}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-2">
                                <label className="text-xs text-zinc-400 font-medium">
                                  Status:
                                </label>
                                <select
                                  disabled={isSaving}
                                  value={proj.status}
                                  onChange={(e) =>
                                    handleUpdateProjectStatus(
                                      proj.id,
                                      e.target.value as ProjectStatus,
                                    )
                                  }
                                  className="rounded-md border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-white"
                                >
                                  <option value="active">
                                    🟢 Actief / Lopend
                                  </option>
                                  <option value="finished">🏆 Finished</option>
                                  <option value="cancelled">
                                    🔴 Geannuleerd
                                  </option>
                                </select>
                              </div>

                              <div className="ml-auto flex flex-wrap gap-2">
                                {renderOrderButtons("projects", proj.id)}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isSaving}
                                  onClick={() => setEditingProjectId(proj.id)}
                                  className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 h-8 px-2.5 text-xs"
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-1" />
                                  Bewerken
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isSaving}
                                  onClick={() =>
                                    handleDeleteProject(proj.id, proj.title)
                                  }
                                  className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 h-8 px-2.5 text-xs"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                                  Verwijderen
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PREVIOUS EDITIONS (YOUTUBE) BEHEREN                        */}
        {/* ================================================================= */}
        {activeTab === "editions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-zinc-800 bg-zinc-900 text-white h-fit">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-amber-400" />
                  YouTube Video Toevoegen
                </h2>

                <form onSubmit={handleAddVideo} className="space-y-4">
                  <TranslationFields
                    value={newVideo}
                    extra="editionEn"
                    onChange={(key, value) =>
                      setNewVideo((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      YouTube Link of Embed URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVideo.youtubeUrl}
                      onChange={(e) =>
                        setNewVideo({
                          ...newVideo,
                          youtubeUrl: e.target.value,
                        })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                    {newVideo.youtubeUrl && (
                      <p
                        className={`text-xs mt-1.5 ${
                          parsedPreview.isValid
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {parsedPreview.isValid
                          ? `✓ Geldige video herkend (Embed: ${parsedPreview.embedUrl})`
                          : "✕ Nog geen geldige YouTube video-ID herkend"}
                      </p>
                    )}
                  </div>

                  {parsedPreview.isValid && parsedPreview.thumbnailUrl && (
                    <div className="rounded-lg overflow-hidden border border-zinc-800 bg-black">
                      <img
                        src={parsedPreview.thumbnailUrl}
                        alt="YouTube preview"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Video Titel *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVideo.title}
                      onChange={(e) =>
                        setNewVideo({ ...newVideo, title: e.target.value })
                      }
                      placeholder="Bijv. DBB 2024 Aftermovie"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Editie / Jaartal Label
                    </label>
                    <input
                      type="text"
                      value={newVideo.edition}
                      onChange={(e) =>
                        setNewVideo({ ...newVideo, edition: e.target.value })
                      }
                      placeholder="Bijv. Editie 2024"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Korte Toelichting (optioneel)
                    </label>
                    <textarea
                      rows={2}
                      value={newVideo.description}
                      onChange={(e) =>
                        setNewVideo({
                          ...newVideo,
                          description: e.target.value,
                        })
                      }
                      placeholder="Optionele beschrijving onder de video..."
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving || !parsedPreview.isValid}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Video Toevoegen
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lijst van ingeladen YouTube Video's */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold">
                Ingeladen YouTube Video&apos;s ({data.previousEditions.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.previousEditions.map((video) => {
                  const isEditing = editingEditionId === video.id;

                  return (
                    <Card
                      key={video.id}
                      className="border-zinc-800 bg-zinc-900 text-white overflow-hidden flex flex-col"
                    >
                      <div className="aspect-video w-full bg-black shrink-0">
                        <iframe
                          src={video.embedUrl}
                          title={video.title}
                          className="h-full w-full border-0"
                          allowFullScreen
                        />
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        {isEditing ? (
                          <div className="space-y-3 flex-1 flex flex-col">
                            <TranslationFields
                              value={video}
                              extra="editionEn"
                              onChange={(key, value) =>
                                handleUpdateEditionField(video.id, key, value)
                              }
                            />
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) =>
                                handleUpdateEditionField(
                                  video.id,
                                  "title",
                                  e.target.value,
                                )
                              }
                              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                              placeholder="Titel"
                            />
                            <input
                              type="text"
                              value={video.edition}
                              onChange={(e) =>
                                handleUpdateEditionField(
                                  video.id,
                                  "edition",
                                  e.target.value,
                                )
                              }
                              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                              placeholder="Editie / Label"
                            />
                            <input
                              type="text"
                              value={video.youtubeUrl}
                              onChange={(e) =>
                                handleUpdateEditionField(
                                  video.id,
                                  "youtubeUrl",
                                  e.target.value,
                                )
                              }
                              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                              placeholder="YouTube Link"
                            />
                            <textarea
                              rows={2}
                              value={video.description || ""}
                              onChange={(e) =>
                                handleUpdateEditionField(
                                  video.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white resize-none"
                              placeholder="Beschrijving..."
                            />
                            <div className="flex justify-end gap-2 mt-auto pt-2">
                              <Button
                                size="sm"
                                onClick={handleSaveEditionEdits}
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-8 w-full"
                              >
                                <Save className="h-3.5 w-3.5 mr-1" />
                                Opslaan
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-xs font-semibold text-amber-400">
                              {video.edition}
                            </span>
                            <h3 className="font-bold text-sm mt-0.5">
                              {video.title}
                            </h3>
                            <p className="text-[11px] text-zinc-500 truncate mt-1">
                              {video.embedUrl}
                            </p>
                            {video.description && (
                              <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                                {video.description}
                              </p>
                            )}
                            <div className="mt-auto pt-4 flex flex-wrap justify-end gap-2">
                              {renderOrderButtons("previousEditions", video.id)}
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isSaving}
                                onClick={() => setEditingEditionId(video.id)}
                                className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 h-8 px-2.5 text-xs"
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Bewerken
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isSaving}
                                onClick={() =>
                                  handleDeleteVideo(video.id, video.title)
                                }
                                className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 h-8 px-2.5 text-xs"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: ROAD TO DBB BEHEREN (INCL. TUSSENVOEGEN & VOLGORDE)        */}
        {/* ================================================================= */}
        {activeTab === "road" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Nieuw Punt Formulier met Positie-keuze */}
            <Card className="border-zinc-800 bg-zinc-900 text-white h-fit">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-amber-400" />
                  Mijlpaal Toevoegen
                </h2>

                <form onSubmit={handleAddMilestone} className="space-y-4">
<label className="block text-xs font-semibold text-zinc-400">Link (optioneel)
  <input type="text" value={newMilestone.link} onChange={e => setNewMilestone(prev => ({...prev, link: e.target.value}))} placeholder="https://..." className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
  <span className="mt-1 block font-normal">Met een link opent het hele blok in een nieuw tabblad. Leeg laten mag.</span>
</label>
                  <TranslationFields
                    value={newMilestone}
                    extra="dateOrPeriodEn"
                    onChange={(key, value) =>
                      setNewMilestone((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Plaats / Positie op de Tijdlijn
                    </label>
                    <select
                      value={newMilestone.insertAtPosition}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          insertAtPosition: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    >
                      {sortedMilestones.map((m, idx) => (
                        <option key={m.id} value={idx + 1}>
                          Invoegen op positie #{idx + 1} (vóór &quot;{m.title}
                          &quot;)
                        </option>
                      ))}
                      <option value={sortedMilestones.length + 1}>
                        Onderaan toevoegen (positie #
                        {sortedMilestones.length + 1})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Titel van Mijlpaal *
                    </label>
                    <input
                      type="text"
                      required
                      value={newMilestone.title}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          title: e.target.value,
                        })
                      }
                      placeholder="Bijv. Kwalificatierondes"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Datum of Periode Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={newMilestone.dateOrPeriod}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          dateOrPeriod: e.target.value,
                        })
                      }
                      placeholder="Bijv. Fase 2 - Oktober"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">
                        Status
                      </label>
                      <select
                        value={newMilestone.status}
                        onChange={(e) =>
                          setNewMilestone({
                            ...newMilestone,
                            status: e.target.value as MilestoneStatus,
                          })
                        }
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-sm text-white"
                      >
                        <option value="completed">Voltooid</option>
                        <option value="current">Huidige Fase</option>
                        <option value="upcoming">Binnenkort</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">
                        Icoon
                      </label>
                      <select
                        value={newMilestone.icon}
                        onChange={(e) =>
                          setNewMilestone({
                            ...newMilestone,
                            icon: e.target.value as MilestoneIcon,
                          })
                        }
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-sm text-white"
                      >
                        <option value="flag">🏁 Vlag</option>
                        <option value="zap">⚡ Bliksem</option>
                        <option value="trophy">🏆 Trofee</option>
                        <option value="rocket">🚀 Raket</option>
                        <option value="users">👥 Community</option>
                        <option value="star">⭐ Ster</option>
                        <option value="calendar">📅 Kalender</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Beschrijving *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newMilestone.description}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          description: e.target.value,
                        })
                      }
                      placeholder="Wat gebeurt er tijdens deze mijlpaal?"
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Mijlpaal Invoegen
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Tijdlijn Overzicht, Bewerken & Volgorde Aanpassen */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold">
                Road to DBB Punten & Volgorde ({sortedMilestones.length})
              </h2>

              {sortedMilestones.map((milestone, idx) => {
                const isEditing = editingMilestoneId === milestone.id;

                return (
                  <Card
                    key={milestone.id}
                    className="border-zinc-800 bg-zinc-900 text-white"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        {/* Volgorde Knoppen (Omhoog / Omlaag) */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <span className="text-xs font-black text-amber-400 mb-1">
                            #{idx + 1}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={idx === 0 || isSaving}
                            onClick={() => handleMoveMilestone(idx, "up")}
                            className="h-7 w-7 border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-800"
                            title="Verplaats omhoog"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={
                              idx === sortedMilestones.length - 1 || isSaving
                            }
                            onClick={() => handleMoveMilestone(idx, "down")}
                            className="h-7 w-7 border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-800"
                            title="Verplaats omlaag"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Inhoud of Bewerk-formulier */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-3">
                              <TranslationFields
                                value={milestone}
                                extra="dateOrPeriodEn"
                                onChange={(key, value) =>
                                  handleUpdateMilestoneField(
                                    milestone.id,
                                    key,
                                    value,
                                  )
                                }
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={milestone.title}
                                  onChange={(e) =>
                                    handleUpdateMilestoneField(
                                      milestone.id,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                                  placeholder="Titel"
                                />
                                <input
                                  type="text"
                                  value={milestone.dateOrPeriod}
                                  onChange={(e) =>
                                    handleUpdateMilestoneField(
                                      milestone.id,
                                      "dateOrPeriod",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                                  placeholder="Datum / Fase"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <select
                                  value={milestone.status}
                                  onChange={(e) =>
                                    handleUpdateMilestoneField(
                                      milestone.id,
                                      "status",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                                >
                                  <option value="completed">Voltooid</option>
                                  <option value="current">Huidige Fase</option>
                                  <option value="upcoming">Binnenkort</option>
                                </select>

                                <select
                                  value={milestone.icon}
                                  onChange={(e) =>
                                    handleUpdateMilestoneField(
                                      milestone.id,
                                      "icon",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white"
                                >
                                  <option value="flag">🏁 Vlag</option>
                                  <option value="zap">⚡ Bliksem</option>
                                  <option value="trophy">🏆 Trofee</option>
                                  <option value="rocket">🚀 Raket</option>
                                  <option value="users">👥 Community</option>
                                  <option value="star">⭐ Ster</option>
                                  <option value="calendar">📅 Kalender</option>
                                </select>
                              </div>

                              <textarea
                                rows={2}
                                value={milestone.description}
                                onChange={(e) =>
                                  handleUpdateMilestoneField(
                                    milestone.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-sm text-white"
                              />

<label className="block text-xs font-semibold text-zinc-400">Link (optioneel)
  <input type="text" value={milestone.link || ""} onChange={e => handleUpdateMilestoneField(milestone.id, "link", e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white" />
  <span className="mt-1 block font-normal">Opent in een nieuw tabblad. Maak leeg om de link te verwijderen.</span>
</label>
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleSaveMilestoneEdits}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-8"
                                >
                                  <Save className="h-3.5 w-3.5 mr-1" />
                                  Opslaan
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold uppercase text-amber-400">
                                  {milestone.dateOrPeriod}
                                </span>
                                <span className="text-xs rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                                  Status: {milestone.status}
                                </span>
                                <span className="text-xs rounded bg-zinc-800 px-2 py-0.5 text-zinc-300">
                                  Icoon: {milestone.icon}
                                </span>
                              </div>
                              <h3 className="font-bold text-base mt-1">
                                {milestone.title}
                              </h3>
                              <p className="text-xs text-zinc-400 mt-1">
                                {milestone.description}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Actieknoppen */}
                        {!isEditing && (
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setEditingMilestoneId(milestone.id)
                              }
                              className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 h-8 px-2.5 text-xs"
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Bewerken
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteMilestone(
                                  milestone.id,
                                  milestone.title,
                                )
                              }
                              className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 h-8 px-2.5 text-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </fieldset>
    </div>
  );
}
