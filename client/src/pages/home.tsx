import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/home/hero-section";
import ServicesOverview from "@/components/home/services-overview";
import PortfolioPreview from "@/components/home/portfolio-preview";
import TestimonialsSection from "@/components/home/testimonials-section";
import CtaSection from "@/components/home/cta-section";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Samuel Marndi | Web Development & Digital Marketing Services</title>
        <meta 
          name="description" 
          content="Professional web development and digital marketing services by Samuel Marndi. Custom websites, SEO, UI/UX design, and digital marketing strategies to help businesses thrive online."
        />
        <meta 
          name="keywords" 
          content="web development, digital marketing, SEO, UI/UX design, Samuel Marndi, portfolio, freelancer"
        />
        <meta property="og:title" content="Samuel Marndi | Web Development & Digital Marketing Services" />
        <meta 
          property="og:description" 
          content="Professional web development and digital marketing services to help businesses establish a powerful online presence."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://samuelmarndi.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Samuel Marndi | Web Development & Digital Marketing Services" />
        <meta 
          name="twitter:description" 
          content="Professional web development and digital marketing services to help businesses establish a powerful online presence."
        />
      </Helmet>

      <HeroSection />
      <ServicesOverview />
      <PortfolioPreview />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
};

export default Home;
