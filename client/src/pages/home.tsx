import React, { useEffect } from "react";
import HeroSection from "@/components/home/hero-section";
import BudgetReassuranceSection from "@/components/home/budget-reassurance-section-new";
import ServicesOverview from "@/components/home/services-overview";
import PortfolioPreview from "@/components/home/portfolio-preview";
import TestimonialsSection from "@/components/home/testimonials-section";
import CtaSection from "@/components/home/cta-section";
import CompactTechShowcase from "@/components/home/compact-tech-showcase";
import ProjectRoadmap from "@/components/home/project-roadmap";
import PartnershipSection from "@/components/home/partnership-section";
import { SEO } from "@/lib/seo-utils";
import { trackConversion } from "@/components/tracking/tracking-scripts";

const Home = () => {
  // Track page view for analytics purposes
  useEffect(() => {
    // Track homepage view event for analytics
    trackConversion.googleAnalytics('page_view', 'navigation', 'homepage');
  }, []);

  return (
    <>
      <SEO 
        title="Web Development & Digital Marketing Services"
        description="Professional web development and digital marketing services by Samuel Marndi. Custom websites, SEO, UI/UX design, and digital marketing strategies to help businesses thrive online."
        keywords={[
          "web development services", 
          "digital marketing expert", 
          "SEO services", 
          "UI/UX design", 
          "freelance developer", 
          "website design",
          "mobile app development",
          "digital transformation",
          "e-commerce solutions"
        ]}
        ogType="website"
        canonical="/"
      />

      <HeroSection />
      <BudgetReassuranceSection />
      <ServicesOverview />
      <CompactTechShowcase />
      <PartnershipSection />
      <ProjectRoadmap />
      <PortfolioPreview />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
};

export default Home;
