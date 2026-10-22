"use client";
import { useState } from "react";
import { prepareImage, imagePreview } from "@/lib/github-cms";
import { sitePath } from "@/lib/site-path";
type EnglishFields = {
  titleEn?: string;
  descriptionEn?: string;
  categoryEn?: string;
  editionEn?: string;
  dateOrPeriodEn?: string;
};
export function TranslationFields<
  K extends "categoryEn" | "editionEn" | "dateOrPeriodEn",
>({
  value,
  onChange,
  extra,
}: {
  value: EnglishFields;
  onChange: (key: "titleEn" | "descriptionEn" | K, value: string) => void;
  extra: K;
}) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
      <legend className="px-1 text-xs font-bold text-amber-400">
        Engelse versie
      </legend>
      <p className="text-xs text-zinc-400">
        Lege velden gebruiken de Nederlandse tekst. Vul ook de Engelse versie
        bij wijzigingen aan.
      </p>
      {(
        [
          ["titleEn", "Titel (EN)"],
          [
            extra,
            {
              categoryEn: "Categorie (EN)",
              editionEn: "Editie (EN)",
              dateOrPeriodEn: "Datum / periode (EN)",
            }[extra],
          ],
          ["descriptionEn", "Beschrijving (EN)"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block text-xs text-zinc-300">
          {label}
          <textarea
            rows={key === "descriptionEn" ? 3 : 1}
            value={value[key] || ""}
            onChange={(e) => onChange(key, e.target.value)}
            lang="en"
            className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </label>
      ))}
    </fieldset>
  );
}
export function ImageUpload({
  value,
  onChange,
  onBusyChange,
}: {
  value: string;
  onChange: (value: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="space-y-2 rounded-xl border border-zinc-700 p-3">
      <label className="block text-xs font-semibold text-zinc-300">
        Afbeelding uploaden
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={busy}
          className="mt-2 block w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-amber-500 file:px-3 file:py-2 file:font-bold file:text-black"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            onBusyChange(true);
            setError("");
            try {
              onChange(await prepareImage(file));
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload mislukt.");
            } finally {
              setBusy(false);
              onBusyChange(false);
              e.target.value = "";
            }
          }}
        />
      </label>
      <p className="text-xs text-zinc-400" role="status">
        {busy
          ? "Afbeelding verkleinen…"
          : "Max. 10 MB. Wordt verkleind naar WebP en gepubliceerd wanneer je opslaat."}
      </p>
      {error && (
        <p role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
      {value && (
        <img
          src={sitePath(imagePreview(value))}
          alt="Voorbeeld projectafbeelding"
          className="max-h-32 rounded-lg object-contain"
        />
      )}
    </div>
  );
}
