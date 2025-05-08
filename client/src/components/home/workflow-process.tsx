import { motion } from "framer-motion";
import { 
  Phone, MessageSquare, FileText, FileCheck, 
  CreditCard, Code, ClipboardCheck, CheckCircle,
  HeartHandshake, Calendar, Clock, Headphones
} from "lucide-react";
import QuickQuoteModal from "@/components/forms/quick-quote-modal";

const workflowSteps = [
  {
    title: "Initial Contact",
    description: "Reach out through a service request form, direct call, or email to discuss your project needs.",
    icon: Phone,
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Project Consultation",
    description: "We'll discuss your goals, requirements, timeline, and budget to understand your vision fully.",
    icon: MessageSquare,
    color: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Detailed Proposal",
    description: "I'll provide a comprehensive proposal outlining technologies, timeline, deliverables, and pricing.",
    icon: FileText,
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Agreement & Approval",
    description: "Once you approve the proposal, we'll finalize the contract with clear terms and conditions.",
    icon: FileCheck,
    color: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
  },
  {
    title: "Initial Payment",
    description: "A 50% advance payment is required to begin work and secure your spot in the project queue.",
    icon: CreditCard,
    color: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  },
  {
    title: "Development Phase",
    description: "I'll start building your project using agreed technologies and industry best practices.",
    icon: Code,
    color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  },
  {
    title: "Regular Updates",
    description: "Receive consistent progress updates, demos, and feedback opportunities throughout development.",
    icon: ClipboardCheck,
    color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Testing & QA",
    description: "Comprehensive testing ensures everything functions perfectly before delivery.",
    icon: CheckCircle,
    color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  },
  {
    title: "Final Payment & Delivery",
    description: "Upon your approval, make the final payment and receive all deliverables and access.",
    icon: HeartHandshake,
    color: "bg-lime-100 dark:bg-lime-900/20 text-lime-600 dark:text-lime-400",
  },
  {
    title: "Free Support Period",
    description: "Enjoy 2 months of complimentary support to address any issues or questions that arise.",
    icon: Headphones,
    color: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  },
  {
    title: "Maintenance Options",
    description: "After the free support period, choose from various maintenance packages for ongoing service.",
    icon: Calendar,
    color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Long-term Partnership",
    description: "Continue our relationship for future updates, new features, or completely new projects.",
    icon: Clock,
    color: "bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
  },
];

export default function WorkflowProcess() {
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

  // Animation variants for each step
  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              My Project Workflow
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A transparent, organized approach to every project ensures clear communication, 
            on-time delivery, and exceptional results.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {workflowSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={stepVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
            >
              <div className="flex items-start mb-4">
                <div className={`p-3 rounded-lg ${step.color} mr-4`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs mr-2">
                      {index + 1}
                    </span>
                    {step.title}
                  </h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {step.description}
              </p>
              {index < workflowSteps.length - 1 && (
                <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto text-center mt-16">
          <div className="p-6 bg-primary/10 dark:bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Contact me today to discuss your needs and get a detailed quote. I'm ready to help turn your vision into reality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+918280320550"
                className="inline-flex items-center px-5 py-3 rounded-lg bg-primary text-white font-medium transition-colors hover:bg-primary/90"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call +91 8280320550
              </a>
              <a
                href="#quick-quote"
                className="inline-flex items-center px-5 py-3 rounded-lg bg-white dark:bg-gray-700 text-primary dark:text-white border border-primary/20 dark:border-gray-600 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Request a Quote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}