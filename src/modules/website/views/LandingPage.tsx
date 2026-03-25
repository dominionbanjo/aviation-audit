import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Audit } from "../components/Audit";
import { OTP } from "../components/OTP";
import { Footer } from "../components/Footer";
import { ChatBotPlaceholder } from "../components/ChatBotPlaceholder";

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Audit />
        <OTP />
      </main>
      <Footer />
      <ChatBotPlaceholder />
    </div>
  );
};
