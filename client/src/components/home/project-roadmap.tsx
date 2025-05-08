import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  Phone, MessageSquare, FileText, FileCheck, 
  CreditCard, Code, ClipboardCheck, CheckCircle,
  HeartHandshake, Headphones, Wrench, RotateCcw,
  ArrowRight, ChevronRight
} from "lucide-react";

const projectSteps = [
  {
    step: 1,
    title: "Initial Contact",
    description: "Reach out via the contact form, direct phone call, or email.",
    icon: Phone,
    color: "bg-blue-500/90 text-white",
  },
  {
    step: 2,
    title: "Project Discussion",
    description: "We'll discuss your goals, requirements, and timeline.",
    icon: MessageSquare,
    color: "bg-indigo-500/90 text-white",
  },
  {
    step: 3,
    title: "Proposal & Quote",
    description: "Receive a detailed proposal outlining technologies and pricing.",
    icon: FileText,
    color: "bg-purple-500/90 text-white",
  },
  {
    step: 4,
    title: "Agreement",
    description: "Approve the proposal and finalize the contract.",
    icon: FileCheck,
    color: "bg-pink-500/90 text-white",
  },
  {
    step: 5,
    title: "Initial Payment",
    description: "50% advance payment to secure your project spot.",
    icon: CreditCard,
    color: "bg-red-500/90 text-white",
  },
  {
    step: 6,
    title: "Development",
    description: "Project development begins with regular updates.",
    icon: Code,
    color: "bg-orange-500/90 text-white",
  },
  {
    step: 7,
    title: "Testing",
    description: "Comprehensive testing of all features and functions.",
    icon: CheckCircle,
    color: "bg-yellow-500/90 text-white",
  },
  {
    step: 8,
    title: "Delivery",
    description: "Final payment and project handover with documentation.",
    icon: HeartHandshake,
    color: "bg-green-500/90 text-white",
  },
  {
    step: 9,
    title: "Support",
    description: "2 months of free support for any issues.",
    icon: Headphones,
    color: "bg-teal-500/90 text-white",
  },
  {
    step: 10,
    title: "Maintenance",
    description: "Optional maintenance packages for ongoing service.",
    icon: Wrench,
    color: "bg-cyan-500/90 text-white",
  },
];

export default function ProjectRoadmap() {
  const roadmapRef = useRef(null);
  const isInView = useInView(roadmapRef, { once: false, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Project Roadmap
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            A clear, step-by-step process ensures your project is delivered on time and to specification.
          </p>
        </div>

        <div 
          ref={roadmapRef}
          className="relative mt-20 pb-10 overflow-hidden"
        >
          {/* Mobile Vertical Timeline */}
          <div className="flex flex-col md:hidden space-y-6 px-4 max-w-md mx-auto">
            {projectSteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="flex items-start gap-3 relative"
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.5,
                    },
                  },
                }}
              >
                {/* Connection Line */}
                {index < projectSteps.length - 1 && (
                  <div className="absolute left-5 top-10 w-1 h-14 bg-gradient-to-b from-current to-blue-400" style={{ color: step.color.split(' ')[0] }}></div>
                )}
                
                {/* Step Circle with Number */}
                <div className="relative">
                  <div className={`${step.color} w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative z-10`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-primary text-primary z-20">
                    {step.step}
                  </div>
                </div>
                
                {/* Step Content */}
                <div className="pt-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Desktop Grid Timeline - No Scrolling Required */}
          <div className="hidden md:block">
            <div className="max-w-6xl mx-auto">
              {/* Timeline line */}
              <div className="absolute h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 top-7 left-10 right-10 z-0 rounded-full opacity-70 mx-auto"/>
              
              <div className="grid grid-cols-5 gap-1">
                {projectSteps.slice(0, 5).map((step, index) => (
                  <motion.div
                    key={step.step}
                    className="relative px-2"
                    initial="hidden"
                    animate={controls}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: index * 0.1,
                          duration: 0.5,
                        },
                      },
                    }}
                  >
                    {/* Step Circle */}
                    <div className={`${step.color} w-14 h-14 rounded-full flex items-center justify-center shadow-md relative z-10 mx-auto mb-3`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    
                    {/* Step Number */}
                    <div className="absolute top-0 right-1/3 -mt-1 bg-white dark:bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-primary text-primary z-20">
                      {step.step}
                    </div>

                    {/* Arrow Icon (except for the last item) */}
                    {index < 4 && (
                      <div className="absolute top-7 right-0 transform z-10">
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                        >
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Step Content */}
                    <div className="text-center px-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Second row - with continuation line */}
              <div className="mt-12 relative">
                {/* Timeline connection line from first to second row */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 h-8 w-1.5 bg-gradient-to-b from-teal-500 to-blue-500 z-0 rounded-full opacity-70"/>
                
                {/* Timeline line for second row */}
                <div className="absolute h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 top-7 left-10 right-10 z-0 rounded-full opacity-70 mx-auto"/>
                
                <div className="grid grid-cols-5 gap-1">
                  {projectSteps.slice(5).map((step, index) => {
                    // Adjust index to account for the slice
                    const actualIndex = index + 5;
                    return (
                      <motion.div
                        key={step.step}
                        className="relative px-2"
                        initial="hidden"
                        animate={controls}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: actualIndex * 0.1,
                              duration: 0.5,
                            },
                          },
                        }}
                      >
                        {/* Step Circle */}
                        <div className={`${step.color} w-14 h-14 rounded-full flex items-center justify-center shadow-md relative z-10 mx-auto mb-3`}>
                          <step.icon className="w-6 h-6" />
                        </div>
                        
                        {/* Step Number */}
                        <div className="absolute top-0 right-1/3 -mt-1 bg-white dark:bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-primary text-primary z-20">
                          {step.step}
                        </div>

                        {/* Arrow Icon (except for the last item) */}
                        {index < 4 && (
                          <div className="absolute top-7 right-0 transform z-10">
                            <motion.div
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: actualIndex * 0.2 }}
                            >
                              <ArrowRight className="w-4 h-4 text-primary" />
                            </motion.div>
                          </div>
                        )}
                        
                        {/* Step Content */}
                        <div className="text-center px-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm p-6 rounded-xl border border-primary/20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              I'll guide you through each step of the process, ensuring clear communication and exceptional results.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#quick-quote"
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium transition-all hover:shadow-lg hover:bg-primary/90"
              >
                Get a Quote
              </a>
              <a
                href="tel:+918280320550"
                className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 text-primary dark:text-primary/80 border border-primary/30 font-medium transition-all hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Phone className="w-4 h-4 inline-block mr-2" />
                Call Directly
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}