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
  );
};

export default LandingPage;
