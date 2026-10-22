```tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import RoadToDBB from "@/components/RoadToDBB";
import PreviousEditions from "@/components/PreviousEditions";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getCMSData } from "@/lib/cms-storage";


export const dynamic = "force-dynamic";


export default async function Home() {
  const cmsData = await getCMSData();


  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <Hero />
      <AboutUs />
      <ProjectsCarousel initialData={cmsData.projects} />
      <RoadToDBB initialData={cmsData.roadToDbb} />
      <PreviousEditions initialData={cmsData.previousEditions} />
      <Contact />
      <Footer />
    </main>
  );
}
```
