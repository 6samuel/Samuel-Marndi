import { motion } from "framer-motion";
import { 
  SiReact, SiAngular, SiVuedotjs, SiNextdotjs, SiVercel, SiTailwindcss,
  SiNodedotjs, SiExpress, SiNestjs, SiDjango, SiFlask, SiLaravel,
  SiMongodb, SiPostgresql, SiMysql, SiFirebase, SiSupabase, SiAmazon,
  SiGooglecloud, SiDigitalocean, SiDocker, SiKubernetes,
  SiTypescript, SiJavascript, SiPython, SiPhp, SiRuby, SiGo, SiJavascript as SiJava, SiSharp,
  SiAndroid, SiSwift, SiKotlin, SiFlutter, SiReact as SiReactnative, SiElectron,
  SiGraphql, SiPrisma, SiSequelize, SiRedux, SiSass, SiWebpack,
  SiGatsby, SiNuxtdotjs, SiSvelte, SiStorybook, SiCypress, SiJest,
  SiGit, SiGithub, SiAdobexd, SiFigma, SiSketch,
  SiStripe, SiPaypal, SiTwilio, SiSendgrid, SiMailchimp, SiOpenai,
  SiWordpress, SiShopify, SiWoocommerce, SiMagento, SiSalesforce,
  SiGoogleanalytics, SiGoogletagmanager, SiGooglesearchconsole, SiHubspot
} from "react-icons/si";
import { FaAws, FaMicrosoft, FaCode, FaDesktop } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iconsConfig = [
  // Frontend Frameworks & Libraries
  { icon: SiReact, name: "React" },
  { icon: SiAngular, name: "Angular" },
  { icon: SiVuedotjs, name: "Vue.js" },
  { icon: SiNextdotjs, name: "Next.js" },
  { icon: SiVercel, name: "Vercel" },
  { icon: SiTailwindcss, name: "Tailwind CSS" },
  { icon: SiSass, name: "Sass" },
  { icon: SiRedux, name: "Redux" },
  { icon: SiStorybook, name: "Storybook" },

  // Backend Frameworks & Libraries
  { icon: SiNodedotjs, name: "Node.js" },
  { icon: SiExpress, name: "Express.js" },
  { icon: SiNestjs, name: "NestJS" },
  { icon: SiDjango, name: "Django" },
  { icon: SiFlask, name: "Flask" },
  { icon: SiLaravel, name: "Laravel" },

  // Databases & Storage
  { icon: SiMongodb, name: "MongoDB" },
  { icon: SiPostgresql, name: "PostgreSQL" },
  { icon: SiMysql, name: "MySQL" },
  { icon: SiFirebase, name: "Firebase" },
  { icon: SiSupabase, name: "Supabase" },

  // Cloud & Deployment
  { icon: FaAws, name: "AWS" },
  { icon: FaMicrosoft, name: "Azure" },
  { icon: SiGooglecloud, name: "Google Cloud" },
  { icon: SiDigitalocean, name: "DigitalOcean" },
  { icon: SiDocker, name: "Docker" },
  { icon: SiKubernetes, name: "Kubernetes" },

  // Programming Languages
  { icon: SiJavascript, name: "JavaScript" },
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiPython, name: "Python" },
  { icon: SiPhp, name: "PHP" },
  { icon: SiRuby, name: "Ruby" },
  { icon: SiGo, name: "Go" },
  { icon: SiJava, name: "Java" },
  { icon: SiSharp, name: "C#" },

  // Mobile Development
  { icon: SiAndroid, name: "Android" },
  { icon: SiSwift, name: "Swift" },
  { icon: SiKotlin, name: "Kotlin" },
  { icon: SiFlutter, name: "Flutter" },
  { icon: SiReactnative, name: "React Native" },

  // Desktop Development
  { icon: SiElectron, name: "Electron" },

  // API & Data
  { icon: SiGraphql, name: "GraphQL" },
  { icon: SiPrisma, name: "Prisma" },
  { icon: SiSequelize, name: "Sequelize" },

  // Static Site Generators
  { icon: SiGatsby, name: "Gatsby" },
  { icon: SiNuxtdotjs, name: "Nuxt.js" },
  { icon: SiSvelte, name: "Svelte" },

  // Testing
  { icon: SiCypress, name: "Cypress" },
  { icon: SiJest, name: "Jest" },

  // Development Tools
  { icon: FaCode, name: "VS Code" },
  { icon: SiGit, name: "Git" },
  { icon: SiGithub, name: "GitHub" },
  { icon: SiWebpack, name: "Webpack" },

  // Design Tools
  { icon: SiAdobexd, name: "Adobe XD" },
  { icon: SiFigma, name: "Figma" },
  { icon: SiSketch, name: "Sketch" },

  // Payment & Communication
  { icon: SiStripe, name: "Stripe" },
  { icon: SiPaypal, name: "PayPal" },
  { icon: SiTwilio, name: "Twilio" },
  { icon: SiSendgrid, name: "SendGrid" },
  { icon: SiMailchimp, name: "Mailchimp" },
  { icon: SiOpenai, name: "OpenAI" },

  // CMS & E-commerce
  { icon: SiWordpress, name: "WordPress" },
  { icon: SiShopify, name: "Shopify" },
  { icon: SiWoocommerce, name: "WooCommerce" },
  { icon: SiMagento, name: "Magento" },
  { icon: SiSalesforce, name: "Salesforce" },

  // Analytics & Marketing
  { icon: SiGoogleanalytics, name: "Google Analytics" },
  { icon: SiGoogletagmanager, name: "Google Tag Manager" },
  { icon: SiGooglesearchconsole, name: "Google Search Console" },
  { icon: SiHubspot, name: "HubSpot" },
];

export default function TechIcons() {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  // Animation variants for each icon
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="my-12 py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Technologies, Frameworks & Tools
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            I work with a wide range of modern technologies to deliver cutting-edge solutions for your business.
          </p>
        </div>

        <TooltipProvider delayDuration={100}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-6 justify-items-center"
          >
            {iconsConfig.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            ))}
          </motion.div>
        </TooltipProvider>
      </div>
    </div>
  );
}