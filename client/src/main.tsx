import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <meta name="description" content="Professional web development and digital marketing services by Samuel Marndi. Custom websites, SEO, UI/UX design, and more." />
      <meta property="og:title" content="Samuel Marndi | Web Development & Digital Marketing" />
      <meta property="og:description" content="Professional web development and digital marketing services. Custom websites, SEO, UI/UX design, and more." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://samuelmarndi.com" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Samuel Marndi | Web Development & Digital Marketing" />
      <meta name="twitter:description" content="Professional web development and digital marketing services. Custom websites, SEO, UI/UX design, and more." />
    </Helmet>
    <App />
  </HelmetProvider>
);
