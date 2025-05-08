import { motion } from "framer-motion";
import { Link } from "wouter";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FaLinkedin, FaTwitter, FaGithub, FaFacebook, FaWhatsapp } from "react-icons/fa";
import ContactForm from "@/components/forms/contact-form";
import { SEO } from "@/lib/seo-utils";
import ConversionTracker from "@/components/tracking/conversion-tracker";

const Contact = () => {
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

  return (
    <>
      <SEO 
        title="Contact | Samuel Marndi"
        description="Get in touch with Samuel Marndi for professional web development, digital marketing, and UI/UX design services. Request a quote or consultation today."
        canonical="/contact"
        ogImage="/images/og-contact.jpg"
        ogType="website"
      />
      
      {/* Conversion tracking for marketing campaigns */}
      <ConversionTracker 
        trackingId="UA-XXXXXXXX-X" // Replace with actual Google Analytics ID
        pixelId="XXXXXXXXXX" // Replace with actual Facebook Pixel ID
        uetTagId="XXXXXXXX" // Replace with actual Microsoft UET Tag ID
        adsTrackerId={1} // ID for internal tracking system
      />

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
                Let's Work Together
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                variants={itemVariants}
              >
                I'm here to help you achieve your digital goals. Reach out to discuss your project or ask any questions.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <motion.div 
                className="lg:col-span-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
                  variants={itemVariants}
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Send Me a Message
                  </h2>
                  <ContactForm />
                </motion.div>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible"
              >
                <div className="space-y-8">
                  {/* Contact Details */}
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
                    variants={itemVariants}
                  >
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                      Contact Information
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                          <a 
                            href="mailto:samuelmarandi6@gmail.com" 
                            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors"
                          >
                            samuelmarandi6@gmail.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Phone / WhatsApp</h3>
                          <a 
                            href="tel:+918280320550" 
                            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-foreground transition-colors"
                          >
                            +91 8280320550
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">Location</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            Dhobanijoda, P.O-Kandalia, P.S-Bangriposi,<br />
                            Mayurbhanj, Odisha-757092<br />
                            India
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Social Media */}
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
                    variants={itemVariants}
                  >
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                      Connect with Me
                    </h2>
                    <div className="flex space-x-4">
                      <a 
                        href="https://linkedin.com/in/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary-foreground transition-colors"
                      >
                        <FaLinkedin className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://twitter.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary-foreground transition-colors"
                      >
                        <FaTwitter className="h-5 w-5" />
                      </a>
                      <a 
                        href="https://instagram.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 dark:hover:text-primary-foreground transition-colors"
                      >
                        <FaInstagram className="h-5 w-5" />
                      </a>
                    </div>
                  </motion.div>
                  
                  {/* Quick Links */}
                  <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8"
                    variants={itemVariants}
                  >
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                      Quick Links
                    </h2>
                    <div className="space-y-3">
                      <Link href="/services" className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <span className="font-medium">Services</span>
                        <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Link>
                      <Link href="/portfolio" className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <span className="font-medium">Portfolio</span>
                        <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Link>
                      <Link href="/about" className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <span className="font-medium">About Me</span>
                        <ArrowUpRight className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container px-4 mx-auto mt-20">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Answers to common questions about working with me
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  What is your typical response time?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I typically respond to all inquiries within 24 hours during business days. For urgent matters, you can also reach me by phone.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  How do we get started on a project?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  After initial contact, we'll schedule a consultation to discuss your needs and goals. Then I'll provide a detailed proposal with timeline and pricing. Once approved, we'll start with the discovery phase.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  What information should I provide in my initial inquiry?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To provide the most helpful response, include details about your project scope, goals, timeline, and budget range. Any existing materials or examples of what you're looking for are also helpful.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Do you work with clients internationally?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, I work with clients worldwide. We can communicate via email, phone, or video conferencing tools to accommodate different time zones and ensure smooth collaboration.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default Contact;
