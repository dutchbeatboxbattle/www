export interface ParsedYouTubeResult {
  isValid: boolean;
  videoId: string | null;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}

/**
 * Zet elke gangbare YouTube-URL of losse Video-ID om naar een geldig embed-formaat.
 */
export function parseYouTubeUrl(input: string): ParsedYouTubeResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, videoId: null, embedUrl: null, thumbnailUrl: null };
  }

  // Controleer of de invoer direct een 11-teken YouTube ID is
  const rawIdRegex = /^[a-zA-Z0-9_-]{11}$/;
  if (rawIdRegex.test(trimmed)) {
    return {
      isValid: true,
      videoId: trimmed,
      embedUrl: `https://www.youtube.com/embed/${trimmed}`,
      thumbnailUrl: `https://img.youtube.com/vi/${trimmed}/hqdefault.jpg`,
    };
  }

  try {
    const url = new URL(trimmed);
    let videoId: string | null = null;

    if (
      url.hostname === "youtu.be" ||
      url.hostname === "www.youtu.be"
    ) {
      videoId = url.pathname.split("/").filter(Boolean)[0] || null;
    } else if (
      url.hostname.includes("youtube.com") ||
      url.hostname.includes("youtube-nocookie.com")
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/embed/")[1]?.split("/")[0] || null;
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      } else if (url.pathname.startsWith("/v/")) {
        videoId = url.pathname.split("/v/")[1]?.split("/")[0] || null;
      }
    }

    if (videoId) {
      // Strip eventuele extra query-fragmenten van de ID
      const cleanId = videoId.substring(0, 11);
      if (rawIdRegex.test(cleanId)) {
        return {
          isValid: true,
          videoId: cleanId,
          embedUrl: `https://www.youtube.com/embed/${cleanId}`,
          thumbnailUrl: `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
        };
      }
    }
  } catch {
    // Fallback regex voor wanneer de tekst om een URL heen staat (bijv. iframe code)
    const fallbackMatch = trimmed.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (fallbackMatch && fallbackMatch[1]) {
      const cleanId = fallbackMatch[1];
      return {
        isValid: true,
        videoId: cleanId,
        embedUrl: `https://www.youtube.com/embed/${cleanId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
      };
    }
  }

  return { isValid: false, videoId: null, embedUrl: null, thumbnailUrl: null };
}
