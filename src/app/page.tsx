import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import RoadToDBB from "@/components/RoadToDBB";
import PreviousEditions from "@/components/PreviousEditions";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-background">
            <Header />
            <Hero />
            <AboutUs />
            <ProjectsCarousel />
            <RoadToDBB />
            <PreviousEditions />
            <Contact />
            <Footer />
        </main>
    );
}
