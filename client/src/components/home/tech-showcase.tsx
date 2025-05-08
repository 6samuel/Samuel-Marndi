import { motion } from "framer-motion";
import { 
  SiReact, SiAngular, SiVuedotjs, SiNextdotjs, SiVercel, SiTailwindcss,
  SiNodedotjs, SiExpress, SiNestjs, SiDjango, SiFlask, SiLaravel,
  SiMongodb, SiPostgresql, SiMysql, SiFirebase, SiSupabase,
  SiGooglecloud, SiDigitalocean, SiDocker, SiKubernetes,
  SiTypescript, SiJavascript, SiPython, SiPhp, SiRuby, SiGo, SiJavascript as SiJava, SiSharp,
  SiAndroid, SiSwift, SiKotlin, SiFlutter, SiReact as SiReactnative, SiElectron,
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
  SiSlack, SiMattermost, SiDiscord, SiZoom, SiTrello, SiAsana, SiJira, SiNotion
} from "react-icons/si";
import { FaAws, FaMicrosoft, FaCode, FaDesktop, FaRobot, FaServer, FaDatabase, FaNetworkWired, FaCloud } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Group icons by category
const techCategories = [
  {
    name: "Frontend Development",
    description: "Creating modern, responsive user interfaces with the latest frameworks",
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
      { icon: SiSvelte, name: "Svelte", color: "#FF3E00" }
    ]
  },
  {
    name: "Backend Development",
    description: "Building robust server-side applications and APIs",
    icons: [
      { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
      { icon: SiExpress, name: "Express.js", color: "#000000" },
      { icon: SiNestjs, name: "NestJS", color: "#E0234E" },
      { icon: SiDjango, name: "Django", color: "#092E20" },
      { icon: SiFlask, name: "Flask", color: "#000000" },
      { icon: SiLaravel, name: "Laravel", color: "#FF2D20" },
      { icon: SiGraphql, name: "GraphQL", color: "#E10098" },
      { icon: SiPrisma, name: "Prisma", color: "#2D3748" },
      { icon: SiSequelize, name: "Sequelize", color: "#52B0E7" }
    ]
  },
  {
    name: "Database & Storage",
    description: "Data management solutions for all types of applications",
    icons: [
      { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
      { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
      { icon: SiMysql, name: "MySQL", color: "#4479A1" },
      { icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
      { icon: SiSupabase, name: "Supabase", color: "#3ECF8E" },
      { icon: FaDatabase, name: "SQL Server", color: "#CC2927" },
      { icon: SiElastic, name: "Elasticsearch", color: "#005571" }
    ]
  },
  {
    name: "Cloud & DevOps",
    description: "Cloud infrastructure, CI/CD, and deployment solutions",
    icons: [
      { icon: FaAws, name: "AWS", color: "#FF9900" },
      { icon: FaMicrosoft, name: "Azure", color: "#0078D4" },
      { icon: SiGooglecloud, name: "Google Cloud", color: "#4285F4" },
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
      { icon: SiCloudflare, name: "Cloudflare", color: "#F38020" }
    ]
  },
  {
    name: "AI & Machine Learning",
    description: "Implementing intelligent systems and machine learning models",
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
      { icon: SiChatbot, name: "Chatbot", color: "#00B265" }
    ]
  },
  {
    name: "Programming Languages",
    description: "Experience with a wide range of programming languages",
    icons: [
      { icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
      { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
      { icon: SiPython, name: "Python", color: "#3776AB" },
      { icon: SiPhp, name: "PHP", color: "#777BB4" },
      { icon: SiRuby, name: "Ruby", color: "#CC342D" },
      { icon: SiGo, name: "Go", color: "#00ADD8" },
      { icon: SiJava, name: "Java", color: "#007396" },
      { icon: SiSharp, name: "C#", color: "#239120" }
    ]
  },
  {
    name: "Mobile & Cross-platform",
    description: "Building applications for mobile and multiple platforms",
    icons: [
      { icon: SiAndroid, name: "Android", color: "#3DDC84" },
      { icon: SiSwift, name: "Swift", color: "#F05138" },
      { icon: SiKotlin, name: "Kotlin", color: "#7F52FF" },
      { icon: SiFlutter, name: "Flutter", color: "#02569B" },
      { icon: SiReactnative, name: "React Native", color: "#61DAFB" },
      { icon: SiElectron, name: "Electron", color: "#47848F" }
    ]
  },
  {
    name: "Testing & Quality",
    description: "Ensuring high-quality code through comprehensive testing",
    icons: [
      { icon: SiCypress, name: "Cypress", color: "#17202C" },
      { icon: SiJest, name: "Jest", color: "#C21325" }
    ]
  },
  {
    name: "Development Tools",
    description: "Professional tools for efficient development workflows",
    icons: [
      { icon: FaCode, name: "VS Code", color: "#007ACC" },
      { icon: SiGit, name: "Git", color: "#F05032" },
      { icon: SiGithub, name: "GitHub", color: "#181717" },
      { icon: SiWebpack, name: "Webpack", color: "#8DD6F9" }
    ]
  },
  {
    name: "Design & UI/UX",
    description: "Creative tools for beautiful and functional designs",
    icons: [
      { icon: SiAdobexd, name: "Adobe XD", color: "#FF61F6" },
      { icon: SiFigma, name: "Figma", color: "#F24E1E" },
      { icon: SiSketch, name: "Sketch", color: "#F7B500" }
    ]
  },
  {
    name: "Payment & Communication",
    description: "Integrating payment gateways and communication services",
    icons: [
      { icon: SiStripe, name: "Stripe", color: "#635BFF" },
      { icon: SiPaypal, name: "PayPal", color: "#00457C" },
      { icon: SiTwilio, name: "Twilio", color: "#F22F46" },
      { icon: SiSendgrid, name: "SendGrid", color: "#1A82E2" },
      { icon: SiMailchimp, name: "Mailchimp", color: "#FFE01B" }
    ]
  },
  {
    name: "CMS & E-commerce",
    description: "Content management and e-commerce solutions",
    icons: [
      { icon: SiWordpress, name: "WordPress", color: "#21759B" },
      { icon: SiShopify, name: "Shopify", color: "#7AB55C" },
      { icon: SiWoocommerce, name: "WooCommerce", color: "#96588A" },
      { icon: SiMagento, name: "Magento", color: "#EE672F" },
      { icon: SiSalesforce, name: "Salesforce", color: "#00A1E0" }
    ]
  },
  {
    name: "Analytics & Marketing",
    description: "Tools for data analysis and marketing optimization",
    icons: [
      { icon: SiGoogleanalytics, name: "Google Analytics", color: "#E37400" },
      { icon: SiGoogletagmanager, name: "Google Tag Manager", color: "#246FDB" },
      { icon: SiGooglesearchconsole, name: "Google Search Console", color: "#458CF5" },
      { icon: SiHubspot, name: "HubSpot", color: "#FF7A59" }
    ]
  },
  {
    name: "Collaboration Tools",
    description: "Professional tools for team collaboration and project management",
    icons: [
      { icon: SiSlack, name: "Slack", color: "#4A154B" },
      { icon: SiMattermost, name: "Mattermost", color: "#0058CC" },
      { icon: SiDiscord, name: "Discord", color: "#5865F2" },
      { icon: SiZoom, name: "Zoom", color: "#2D8CFF" },
      { icon: SiTrello, name: "Trello", color: "#0052CC" },
      { icon: SiAsana, name: "Asana", color: "#F06A6A" },
      { icon: SiJira, name: "Jira", color: "#0052CC" },
      { icon: SiNotion, name: "Notion", color: "#000000" }
    ]
  }
];

export default function TechShowcase() {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for each category
  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  // Animation variants for each icon
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Cutting-Edge Technologies
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            I leverage the latest tools, frameworks, and technologies to deliver high-quality, scalable solutions that meet the demands of modern businesses.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm px-4 py-2 rounded-full">
              Industry-Standard Tools
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm px-4 py-2 rounded-full">
              Modern Frameworks
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm px-4 py-2 rounded-full">
              Cloud Technologies
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm px-4 py-2 rounded-full">
              AI & ML Solutions
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm px-4 py-2 rounded-full">
              DevOps Practices
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16"
        >
          {techCategories.map((category, categoryIndex) => (
            <motion.div 
              key={categoryIndex} 
              variants={categoryVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
              </div>

              <TooltipProvider delayDuration={100}>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center">
                  {category.icons.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex flex-col items-center"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-14 h-14 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100 dark:border-gray-600">
                            <item.icon 
                              className="w-8 h-8" 
                              style={{ color: item.color }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-900 text-white dark:bg-gray-700">
                          <p className="text-sm">{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                      <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </TooltipProvider>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}