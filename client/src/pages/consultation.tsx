import React from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/ui/page-header";
import SiteFooter from "@/components/layouts/site-footer";
import ConsultationForm from "@/components/consultation/consultation-form";
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";

const ConsultationPage = () => {
  return (
    <>
      <Helmet>
        <title>Book a Consultation | Samuel Marndi - Web Developer & Digital Marketer</title>
        <meta
          name="description"
          content="Schedule a personal one-hour consultation with Samuel Marndi to discuss your web development, digital marketing or technology needs. Expert advice for your business or project."
        />
        <meta
          property="og:title"
          content="Book a Consultation | Samuel Marndi - Web Developer & Digital Marketer"
        />
        <meta
          property="og:description"
          content="Schedule a personal one-hour consultation with Samuel Marndi to discuss your web development, digital marketing or technology needs. Expert advice for your business or project."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://samuelmarndi.in/consultation" />
      </Helmet>

      <PageHeader
        title="Book a Consultation"
        description="Schedule a personal one-hour consultation to discuss your project requirements, technical challenges, or digital marketing strategy."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Book a Consultation", href: "/consultation" },
        ]}
      />

      <div className="container px-4 py-12 mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Why Book a Consultation?</h2>
              <p className="text-gray-600 mb-4">
                Whether you're launching a new website, facing technical challenges, or looking to enhance 
                your online presence, a personal consultation can help you get clarity and 
                direction from an industry expert.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Consultation Details</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-600">60 minutes (can be extended if needed)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-gray-600">Monday to Friday, 9 AM to 7 PM (IST)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Platform</p>
                    <p className="text-gray-600">Google Meet, Zoom, or Microsoft Teams</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="w-5 h-5 mt-1 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Consultation Fee</p>
                    <p className="text-gray-600">₹1000 per hour</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Topics We Can Discuss</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Website development requirements and technology solutions</li>
                <li>Digital marketing strategy and implementation roadmap</li>
                <li>SEO analysis and recommendations for your website</li>
                <li>Technical troubleshooting and problem-solving</li>
                <li>Website optimization and performance improvements</li>
                <li>E-commerce solutions and integration options</li>
                <li>Content strategy and social media marketing approach</li>
                <li>Custom application development planning</li>
                <li>AI integration opportunities for your business</li>
              </ul>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
              <h3 className="text-xl font-semibold mb-3">After Booking</h3>
              <p className="text-gray-600 mb-3">
                Once your booking is confirmed and payment is completed, you'll receive:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>A confirmation email with the date and time of our consultation</li>
                <li>A calendar invitation with the meeting link</li>
                <li>A brief questionnaire to help me prepare for our discussion</li>
                <li>Post-consultation, you'll receive a summary of our discussion and recommended next steps</li>
              </ul>
            </div>
          </div>
          
          <div>
            <ConsultationForm />
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
};

export default ConsultationPage;