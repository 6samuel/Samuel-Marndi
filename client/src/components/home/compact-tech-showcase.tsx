import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  SiReact, SiAngular, SiVuedotjs, SiNextdotjs, SiTailwindcss,
  SiNodedotjs, SiExpress, SiNestjs, SiDjango, SiFlask, SiLaravel,
  SiMongodb, SiPostgresql, SiMysql, SiFirebase, SiSupabase,
  SiGooglecloud, SiDigitalocean, SiDocker, SiKubernetes,
  SiTypescript, SiJavascript, SiPython, SiPhp, SiRuby, SiGo, SiSharp,
  SiAndroid, SiSwift, SiKotlin, SiFlutter, SiElectron,
  SiGraphql, SiPrisma, SiSequelize, SiRedux, SiSass, SiWebpack,
  SiGatsby, SiNuxtdotjs, SiSvelte, SiStorybook, SiCypress, SiJest,
  SiGit, SiGithub, SiAdobexd, SiFigma, SiSketch,
  SiStripe, SiPaypal, SiTwilio, SiSendgrid, SiMailchimp, SiOpenai,
  SiWordpress, SiShopify, SiWoocommerce, SiMagento, SiSalesforce,
  SiGoogleanalytics, SiGoogletagmanager, SiGooglesearchconsole, SiHubspot,
  SiJenkins, SiCircleci, SiTravisci, SiGitlab, SiAnsible, SiTerraform, 
  SiVagrant, SiPrometheus, SiGrafana, SiElastic, SiHeroku, SiNetlify,
  SiChatbot, SiCloudflare, SiAmazon,
  SiTensorflow, SiPytorch, SiScikitlearn, SiKeras, SiJupyter, SiDialogflow,
  SiSlack, SiMattermost, SiDiscord, SiZoom, SiTrello, SiAsana, SiJira, SiNotion,
  SiNpm, SiYarn, SiPnpm, SiVite, SiRollupdotjs, SiEsbuild, SiDeno, SiBun,
  SiVuetify, SiChakraui, SiBootstrap, SiMaterialdesign, SiThreedotjs, 
  SiVercel, SiPostman, SiSwagger, SiRedis, SiNginx, SiApache,
  SiFastapi, SiSpring, SiSpringboot, SiRubyonrails, 
  SiMarkdown, SiGooglechrome, SiFirefox, SiSafari, SiOpera,
  SiAndroidstudio, SiXcode, SiJetbrains, SiApple, SiLinux, SiRaspberrypi,
  SiUnity, SiUnrealengine, SiSolidity, SiBitcoin, SiEthereum,
  SiDatabricks, SiApachespark, SiSnowflake, SiTableau, SiMetabase,
  SiFreelancer, SiUpwork
} from "react-icons/si";
import { FaAws, FaMicrosoft, FaCode, FaDesktop, FaRobot, FaServer, FaDatabase, FaNetworkWired, FaCloud, FaHive, FaProjectDiagram, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

// Define tech categories with icons
const techCategories = [
  {
    id: "frontend",
    name: "Frontend",
    icons: [
      { icon: SiReact, name: "React", color: "#61DAFB" },
      { icon: SiAngular, name: "Angular", color: "#DD0031" },
      { icon: SiVuedotjs, name: "Vue.js", color: "#4FC08D" },
      { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
      { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
      { icon: SiSass, name: "Sass", color: "#CC6699" },
      { icon: SiRedux, name: "Redux", color: "#764ABC" },
      { icon: SiStorybook, name: "Storybook", color: "#FF4785" },
      { icon: SiGatsby, name: "Gatsby", color: "#663399" },
      { icon: SiNuxtdotjs, name: "Nuxt.js", color: "#00DC82" },
      { icon: SiSvelte, name: "Svelte", color: "#FF3E00" },
      { icon: SiVuetify, name: "Vuetify", color: "#1867C0" },
      { icon: SiChakraui, name: "Chakra UI", color: "#319795" },
      { icon: SiBootstrap, name: "Bootstrap", color: "#7952B3" },
      { icon: SiMaterialdesign, name: "Material Design", color: "#757575" },
      { icon: SiThreedotjs, name: "Three.js", color: "#000000" },
    ]
  },
  {
    id: "backend",
    name: "Backend",
    icons: [
      { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
      { icon: SiExpress, name: "Express.js", color: "#000000" },
      { icon: SiNestjs, name: "NestJS", color: "#E0234E" },
      { icon: SiDjango, name: "Django", color: "#092E20" },
      { icon: SiFlask, name: "Flask", color: "#000000" },
      { icon: SiFastapi, name: "FastAPI", color: "#009688" },
      { icon: SiLaravel, name: "Laravel", color: "#FF2D20" },
      { icon: FaCode, name: "Symfony", color: "#000000" },
      { icon: SiSpring, name: "Spring", color: "#6DB33F" },
      { icon: SiSpringboot, name: "Spring Boot", color: "#6DB33F" },
      { icon: SiRubyonrails, name: "Ruby on Rails", color: "#CC0000" },
      { icon: SiGraphql, name: "GraphQL", color: "#E10098" },
      { icon: SiPrisma, name: "Prisma", color: "#2D3748" },
      { icon: SiSequelize, name: "Sequelize", color: "#52B0E7" },
    ]
  },
  {
    id: "database",
    name: "Database",
    icons: [
      { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
      { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
      { icon: SiMysql, name: "MySQL", color: "#4479A1" },
      { icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
      { icon: SiSupabase, name: "Supabase", color: "#3ECF8E" },
      { icon: FaDatabase, name: "SQL Server", color: "#CC2927" },
      { icon: SiElastic, name: "Elasticsearch", color: "#005571" },
      { icon: SiRedis, name: "Redis", color: "#DC382D" },
      { icon: SiSnowflake, name: "Snowflake", color: "#29B5E8" },
      { icon: SiDatabricks, name: "Databricks", color: "#FF3621" },
    ]
  },
  {
    id: "devops",
    name: "DevOps",
    icons: [
      { icon: FaAws, name: "AWS", color: "#FF9900" },
      { icon: FaMicrosoft, name: "Azure", color: "#0078D4" },
      { icon: SiGooglecloud, name: "Google Cloud", color: "#4285F4" },
      { icon: SiAmazon, name: "AWS Services", color: "#FF9900" },
      { icon: FaMicrosoft, name: "Azure Services", color: "#0078D4" },
      { icon: FaCloud, name: "Alibaba Cloud", color: "#FF6A00" },
      { icon: SiDigitalocean, name: "DigitalOcean", color: "#0080FF" },
      { icon: SiDocker, name: "Docker", color: "#2496ED" },
      { icon: SiKubernetes, name: "Kubernetes", color: "#326CE5" },
      { icon: SiJenkins, name: "Jenkins", color: "#D24939" },
      { icon: SiCircleci, name: "CircleCI", color: "#343434" },
      { icon: SiTravisci, name: "Travis CI", color: "#3EAAAF" },
      { icon: SiGitlab, name: "GitLab CI", color: "#FC6D26" },
      { icon: SiAnsible, name: "Ansible", color: "#EE0000" },
      { icon: SiTerraform, name: "Terraform", color: "#7B42BC" },
      { icon: SiVagrant, name: "Vagrant", color: "#1868F2" },
      { icon: SiPrometheus, name: "Prometheus", color: "#E6522C" },
      { icon: SiGrafana, name: "Grafana", color: "#F46800" },
      { icon: SiHeroku, name: "Heroku", color: "#430098" },
      { icon: SiNetlify, name: "Netlify", color: "#00C7B7" },
      { icon: SiVercel, name: "Vercel", color: "#000000" },
      { icon: SiCloudflare, name: "Cloudflare", color: "#F38020" },
      { icon: SiNginx, name: "Nginx", color: "#009639" },
      { icon: SiApache, name: "Apache", color: "#D22128" },
      { icon: FaServer, name: "Azure DevOps", color: "#0078D7" },
      { icon: FaNetworkWired, name: "Gitpod", color: "#FFAE33" },
    ]
  },
  {
    id: "ai-ml",
    name: "AI & ML",
    icons: [
      { icon: SiTensorflow, name: "TensorFlow", color: "#FF6F00" },
      { icon: SiPytorch, name: "PyTorch", color: "#EE4C2C" },
      { icon: SiScikitlearn, name: "Scikit-learn", color: "#F7931E" },
      { icon: SiKeras, name: "Keras", color: "#D00000" },
      { icon: SiJupyter, name: "Jupyter", color: "#F37626" },
      { icon: SiOpenai, name: "OpenAI", color: "#412991" },
      { icon: SiDialogflow, name: "Dialogflow", color: "#FF9800" },
      { icon: FaRobot, name: "Hugging Face", color: "#FFBD13" },
      { icon: FaServer, name: "IBM Watson", color: "#054ADA" },
      { icon: SiChatbot, name: "Chatbot", color: "#00B265" },
      { icon: FaHive, name: "LangChain", color: "#32CD32" },
      { icon: SiApachespark, name: "Apache Spark", color: "#E25A1C" },
    ]
  },
  {
    id: "languages",
    name: "Languages",
    icons: [
      { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
      { icon: SiPython, name: "Python", color: "#3776AB" },
      { icon: SiPhp, name: "PHP", color: "#777BB4" },
      { icon: SiRuby, name: "Ruby", color: "#CC342D" },
      { icon: SiGo, name: "Go", color: "#00ADD8" },
      { icon: FaCode, name: "Java", color: "#007396" },
      { icon: SiSharp, name: "C#", color: "#239120" },
      { icon: FaCode, name: "C++", color: "#00599C" },
      { icon: FaCode, name: "Shell", color: "#4EAA25" },
      { icon: FaCode, name: "Bash", color: "#4EAA25" },
      { icon: FaCode, name: "PowerShell", color: "#5391FE" },
      { icon: SiMarkdown, name: "Markdown", color: "#000000" },
      { icon: SiSolidity, name: "Solidity", color: "#363636" },
    ]
  },
  {
    id: "mobile",
    name: "Mobile",
    icons: [
      { icon: SiAndroid, name: "Android", color: "#3DDC84" },
      { icon: SiSwift, name: "Swift", color: "#F05138" },
      { icon: SiKotlin, name: "Kotlin", color: "#7F52FF" },
      { icon: SiFlutter, name: "Flutter", color: "#02569B" },
      { icon: SiReact, name: "React Native", color: "#61DAFB" },
      { icon: SiElectron, name: "Electron", color: "#47848F" },
      { icon: SiAndroidstudio, name: "Android Studio", color: "#3DDC84" },
      { icon: SiXcode, name: "Xcode", color: "#147EFB" },
      { icon: SiApple, name: "iOS", color: "#000000" },
    ]
  },
  {
    id: "tools",
    name: "Tools",
    icons: [
      { icon: FaCode, name: "VS Code", color: "#007ACC" },
      { icon: FaCode, name: "Visual Studio", color: "#5C2D91" },
      { icon: FaCode, name: "IntelliJ IDEA", color: "#000000" },
      { icon: FaCode, name: "WebStorm", color: "#00CDD7" },
      { icon: FaCode, name: "Eclipse", color: "#2C2255" },
      { icon: SiJetbrains, name: "JetBrains", color: "#000000" },
      { icon: SiGit, name: "Git", color: "#F05032" },
      { icon: SiGithub, name: "GitHub", color: "#181717" },
      { icon: SiNpm, name: "npm", color: "#CB3837" },
      { icon: SiYarn, name: "Yarn", color: "#2C8EBB" },
      { icon: SiPnpm, name: "pnpm", color: "#F69220" },
      { icon: SiVite, name: "Vite", color: "#646CFF" },
      { icon: SiWebpack, name: "Webpack", color: "#8DD6F9" },
      { icon: SiRollupdotjs, name: "Rollup", color: "#EC4A3F" },
      { icon: SiEsbuild, name: "esbuild", color: "#FFCF00" },
      { icon: SiDeno, name: "Deno", color: "#000000" },
      { icon: SiBun, name: "Bun", color: "#FBF0DF" },
      { icon: SiPostman, name: "Postman", color: "#FF6C37" },
      { icon: SiSwagger, name: "Swagger", color: "#85EA2D" },
    ]
  },
  {
    id: "design",
    name: "Design",
    icons: [
      { icon: SiAdobexd, name: "Adobe XD", color: "#FF61F6" },
      { icon: SiFigma, name: "Figma", color: "#F24E1E" },
      { icon: SiSketch, name: "Sketch", color: "#F7B500" },
      { icon: FaDesktop, name: "Framer", color: "#0055FF" },
    ]
  },
  {
    id: "payment",
    name: "Payment & Comms",
    icons: [
      { icon: SiStripe, name: "Stripe", color: "#635BFF" },
      { icon: SiPaypal, name: "PayPal", color: "#00457C" },
      { icon: SiTwilio, name: "Twilio", color: "#F22F46" },
      { icon: SiSendgrid, name: "SendGrid", color: "#1A82E2" },
      { icon: SiMailchimp, name: "Mailchimp", color: "#FFE01B" },
      { icon: SiRabbitmq, name: "RabbitMQ", color: "#FF6600" },
      { icon: SiKafka, name: "Kafka", color: "#000000" },
    ]
  },
  {
    id: "cms",
    name: "CMS & E-commerce",
    icons: [
      { icon: SiWordpress, name: "WordPress", color: "#21759B" },
      { icon: SiShopify, name: "Shopify", color: "#7AB55C" },
      { icon: SiWoocommerce, name: "WooCommerce", color: "#96588A" },
      { icon: SiMagento, name: "Magento", color: "#EE672F" },
      { icon: SiSalesforce, name: "Salesforce", color: "#00A1E0" },
    ]
  },
  {
    id: "analytics",
    name: "Analytics",
    icons: [
      { icon: SiGoogleanalytics, name: "Google Analytics", color: "#E37400" },
      { icon: SiGoogletagmanager, name: "GTM", color: "#246FDB" },
      { icon: SiGooglesearchconsole, name: "Search Console", color: "#458CF5" },
      { icon: SiHubspot, name: "HubSpot", color: "#FF7A59" },
      { icon: SiPowerbi, name: "Power BI", color: "#F2C811" },
      { icon: SiTableau, name: "Tableau", color: "#E97627" },
      { icon: SiMetabase, name: "Metabase", color: "#509EE3" },
    ]
  },
  {
    id: "collaboration",
    name: "Collaboration",
    icons: [
      { icon: SiSlack, name: "Slack", color: "#4A154B" },
      { icon: SiMattermost, name: "Mattermost", color: "#0058CC" },
      { icon: SiDiscord, name: "Discord", color: "#5865F2" },
      { icon: SiZoom, name: "Zoom", color: "#2D8CFF" },
      { icon: SiTrello, name: "Trello", color: "#0052CC" },
      { icon: SiAsana, name: "Asana", color: "#F06A6A" },
      { icon: SiJira, name: "Jira", color: "#0052CC" },
      { icon: SiNotion, name: "Notion", color: "#000000" },
      { icon: FaProjectDiagram, name: "ClickUp", color: "#7B68EE" },
      { icon: SiFreelancer, name: "Freelancer", color: "#29B2FE" },
      { icon: SiUpwork, name: "Upwork", color: "#6FDA44" },
    ]
  },
];

export default function CompactTechShowcase() {
  const [activeCategory, setActiveCategory] = useState(techCategories[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const activeIcons = techCategories.find(cat => cat.id === activeCategory)?.icons || [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Cutting-Edge Technologies
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            I work with the latest tools, frameworks, and technologies to deliver high-quality solutions.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="relative mb-8">
          {showLeftScroll && (
            <button 
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Scroll left"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto py-2 px-2 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={handleScroll}
          >
            {techCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium mr-3 transition-colors duration-200 flex-shrink-0",
                  activeCategory === category.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {showRightScroll && (
            <button 
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Scroll right"
            >
              <FaArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tech Icons Display */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <TooltipProvider delayDuration={50}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={activeCategory} // Re-render animation when category changes
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3 md:gap-5"
            >
              {activeIcons.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100 dark:border-gray-600">
                        <item.icon 
                          className="w-7 h-7" 
                          style={{ color: item.color }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 text-white dark:bg-gray-700">
                      <p className="text-sm font-medium">{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </motion.div>
          </TooltipProvider>
        </div>

        {/* View All Technologies Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
            View all {techCategories.reduce((acc, cat) => acc + cat.icons.length, 0)}+ technologies
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
}