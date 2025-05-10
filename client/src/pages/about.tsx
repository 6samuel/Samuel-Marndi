import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Briefcase, 
  Check, 
  Code, 
  GraduationCap, 
  BarChart2,
  Palette
} from "lucide-react";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const skills = [
    { name: "Web Development", icon: <Code className="h-5 w-5" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
    { name: "Digital Marketing", icon: <BarChart2 className="h-5 w-5" />, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
    { name: "UI/UX Design", icon: <Palette className="h-5 w-5" />, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
    { name: "SEO Optimization", icon: <BookOpen className="h-5 w-5" />, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
    { name: "Frontend Frameworks", icon: <Code className="h-5 w-5" />, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300" },
    { name: "Backend Development", icon: <Code className="h-5 w-5" />, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  ];

  const values = [
    { 
      title: "Quality", 
      description: "I believe in delivering exceptional quality in every project, focusing on performance, usability, and attention to detail."
    },
    { 
      title: "Transparency", 
      description: "Open communication and clear expectations are the foundation of successful client relationships."
    },
    { 
      title: "Innovation", 
      description: "I stay at the forefront of technology trends to provide cutting-edge solutions that give clients a competitive edge."
    },
    { 
      title: "Results", 
      description: "I'm committed to delivering measurable results that help clients achieve their business objectives."
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Samuel Marndi | Web Developer & Digital Marketer</title>
        <meta 
          name="description" 
          content="Learn about Samuel Marndi, a professional web developer and digital marketer with expertise in creating custom websites and implementing effective marketing strategies."
        />
        <meta property="og:title" content="About Samuel Marndi | Web Developer & Digital Marketer" />
        <meta 
          property="og:description" 
          content="Learn about Samuel Marndi, a professional web developer and digital marketer with expertise in creating custom websites and implementing effective marketing strategies."
        />
      </Helmet>

      <div className="pt-16 pb-24">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 pb-16">
          <div className="container px-4 mx-auto">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white"
                variants={itemVariants}
              >
                About Me
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                I'm Samuel Marndi, a passionate web developer and digital marketer dedicated to helping businesses succeed online.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Image and Quick Info */}
            <motion.div 
              className="lg:col-span-1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="sticky top-24 space-y-8"
                variants={itemVariants}
              >
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl transform translate-x-4 translate-y-4"></div>
                  <OptimizedImage 
                    src="https://pbs.twimg.com/profile_images/1921059700109438976/uFfkCwFP_400x400.jpg" 
                    alt="Samuel Marndi" 
                    className="relative z-10 rounded-lg shadow-lg w-full"
                    priority={true}
                  />
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">At a Glance</h3>
                  
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Experience</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">7+ years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Projects Completed</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">100+</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Education</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">BSc in Computer Science</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-6 text-center">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Ready to work together?</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Let's discuss how I can help your business grow with custom digital solutions.
                  </p>
                  <Link href="/contact">
                    <Button className="w-full">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Main Content */}
            <motion.div 
              className="lg:col-span-2 space-y-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true }}
            >
              {/* About Me */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  My Story
                </h2>
                <div className="prose dark:prose-invert prose-lg max-w-none">
                  <p>
                    I'm a dedicated web developer and digital marketing specialist with over 7 years of experience in creating impactful digital solutions for businesses of all sizes. My journey in web development began while studying Computer Science, where I discovered my passion for building websites and digital experiences that drive results.
                  </p>
                  <p>
                    Throughout my career, I've worked with a diverse range of clients—from startups to established businesses—helping them establish a strong online presence and achieve their business goals. My approach combines technical expertise with a deep understanding of user experience and marketing strategies to deliver solutions that not only look great but also perform exceptionally well.
                  </p>
                  <p>
                    What sets me apart is my holistic approach to digital projects. I don't just build websites; I create comprehensive digital solutions that consider your business objectives, target audience, and growth strategy. Each project is a collaborative effort, where I work closely with clients to understand their vision and translate it into reality.
                  </p>
                  <p>
                    When I'm not coding or optimizing websites, you'll find me staying updated on the latest industry trends, experimenting with new technologies, and continuously expanding my skill set to provide cutting-edge solutions to my clients.
                  </p>
                </div>
              </motion.section>

              {/* Skills */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Expertise & Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                      <div className={`p-2 rounded-full ${skill.color}`}>
                        {skill.icon}
                      </div>
                      <span className="font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    My technical skills include proficiency in HTML, CSS, JavaScript, React, Node.js, PHP, WordPress, and various digital marketing tools. I stay current with emerging technologies and industry best practices to ensure my clients receive the most effective solutions for their needs.
                  </p>
                </div>
              </motion.section>

              {/* Core Values */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  My Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {values.map((value, index) => (
                    <div 
                      key={index} 
                      className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <h3 className="font-bold text-lg mb-3 flex items-center">
                        <Check className="mr-2 h-5 w-5 text-primary" />
                        {value.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Approach */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  My Approach
                </h2>
                <div className="prose dark:prose-invert prose-lg max-w-none">
                  <p>
                    I believe in a collaborative approach to every project. My process involves:
                  </p>
                  <ul>
                    <li>
                      <strong>Discovery:</strong> Understanding your business, goals, target audience, and competitors to develop a strategic plan.
                    </li>
                    <li>
                      <strong>Planning:</strong> Creating a detailed roadmap that outlines the scope, timeline, and deliverables for your project.
                    </li>
                    <li>
                      <strong>Design:</strong> Developing visually appealing and user-friendly designs that align with your brand identity.
                    </li>
                    <li>
                      <strong>Development:</strong> Building your solution using the latest technologies and best practices for optimal performance.
                    </li>
                    <li>
                      <strong>Testing:</strong> Rigorous quality assurance to ensure everything functions flawlessly across all devices.
                    </li>
                    <li>
                      <strong>Launch:</strong> Smooth deployment and ongoing support to ensure your project's success.
                    </li>
                  </ul>
                  <p>
                    Throughout this process, I maintain clear communication, provide regular updates, and welcome your feedback to ensure the final product exceeds your expectations.
                  </p>
                </div>
              </motion.section>

              {/* Why Choose Me */}
              <motion.section variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  Why Choose Me
                </h2>
                <div className="prose dark:prose-invert prose-lg max-w-none">
                  <p>
                    When you work with me, you're not just hiring a freelancer—you're partnering with a dedicated professional who is invested in your success. Here's what sets me apart:
                  </p>
                  <ul>
                    <li>
                      <strong>Personalized Attention:</strong> I take the time to understand your unique needs and tailor solutions specifically for your business.
                    </li>
                    <li>
                      <strong>End-to-End Service:</strong> From initial concept to ongoing maintenance, I provide comprehensive support throughout your project's lifecycle.
                    </li>
                    <li>
                      <strong>Results-Oriented Approach:</strong> I focus on creating solutions that drive tangible business results, not just aesthetic appeal.
                    </li>
                    <li>
                      <strong>Timely Delivery:</strong> I respect deadlines and ensure your project is completed on time and within budget.
                    </li>
                    <li>
                      <strong>Ongoing Support:</strong> Our relationship doesn't end at launch; I provide continued support to help your digital presence evolve and grow.
                    </li>
                  </ul>
                </div>
              </motion.section>
              
              {/* CTA */}
              <motion.section 
                variants={itemVariants}
                className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-8 rounded-xl text-center"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Ready to Start Your Project?
                </h2>
                <p className="mb-6 text-gray-700 dark:text-gray-300">
                  Let's discuss how I can help you achieve your digital goals and take your business to the next level.
                </p>
                <Link href="/contact">
                  <Button size="lg">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.section>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
