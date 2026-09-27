import HeroSection from "../../Components/Landing/HeroSection";
import ProblemsSection from "../../Components/Landing/ProblemsSection";
import WorkflowSection from "../../Components/Landing/WorkflowSection";
import ClaritySection from "../../Components/Landing/ClaritySection";
import RolesSection from "../../Components/Landing/RolesSection";
import SecuritySection from "../../Components/Landing/SecuritySection";
import FAQSection from "../../Components/Landing/FAQSection";
import CTASection from "../../Components/Landing/CTASection";

const LandingPage = () => {
  return (
    <>
      <title>Internship management portal | JGEC</title>
      <meta
        name="description"
        content="JGEC Internship Management Portal streamlines internship registration, applications, student records, and coordination between students, TPOs, and departments."
      />
      <meta
        name="keywords"
        content="JGEC, Jalpaiguri Government Engineering College, internship management, internship portal, student internship, TPO, training placement officer, internship registration"
      />
      <meta name="author" content="Jalpaiguri Government Engineering College" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#ffffff" />
      <meta property="og:title" content="JGEC Internship Management Portal" />
      <meta
        property="og:description"
        content="A centralized platform for managing student internships, registrations, applications, and coordination across JGEC."
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:site_name"
        content="JGEC Internship Management Portal"
      />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="JGEC Internship Management Portal" />
      <meta
        name="twitter:description"
        content="Manage student internships, registrations, applications, and internship coordination through the JGEC Internship Management Portal."
      />

      <div id="top" className="min-h-screen overflow-x-clip bg-cream text-ink">
        <HeroSection />
        <ProblemsSection />
        <WorkflowSection />
        <ClaritySection />
        <RolesSection />
        <SecuritySection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
};

export default LandingPage;
