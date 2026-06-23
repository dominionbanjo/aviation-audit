import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { AuditScope } from "../components/AuditScope";
import { LibraryHighlights } from "../components/LibraryHighlights";
import { SmsPillars } from "../components/SmsPillars";
import { Workflow } from "../components/Workflow";
import { Audit } from "../components/Audit";
import { OTP } from "../components/OTP";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";
import { ChatBotPlaceholder } from "../components/ChatBotPlaceholder";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <AuditScope />
        <LibraryHighlights />
        <SmsPillars />
        <Workflow />
        <Audit />
        <OTP />
        <FAQ />
      </main>
      <Footer />
      <ChatBotPlaceholder />
    </div>
  );
};
