import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticatedAdmin } from "@/lib/auth";
import { getCMSData, saveCMSData } from "@/lib/cms-storage";
import { CMSData } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCMSData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fout bij ophalen CMS data:", error);
    return NextResponse.json(
      { error: "Kon CMS data niet ophalen." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const isAdmin = await isAuthenticatedAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Niet geautoriseerd. Log eerst in als beheerder." },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as CMSData;

    if (
      !Array.isArray(body.projects) ||
      !Array.isArray(body.previousEditions) ||
      !Array.isArray(body.roadToDbb)
    ) {
      return NextResponse.json(
        { error: "Ongeldig dataformaat." },
        { status: 400 }
      );
    }

    const saved = await saveCMSData(body);

    // Zorg dat de publieke homepage direct de nieuwe content toont
    revalidatePath("/");

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Fout bij opslaan CMS data:", error);
    return NextResponse.json(
      { error: "Kon wijzigingen niet opslaan." },
      { status: 500 }
    );
  }
}
