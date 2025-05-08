import React from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/ui/page-header";

const TermsConditions = () => {
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Samuel Marndi - Web Developer & Digital Marketer</title>
        <meta
          name="description"
          content="Terms and Conditions for Samuel Marndi's web development and digital marketing services. Read about the terms governing the use of my services and website."
        />
        <meta
          property="og:title"
          content="Terms and Conditions | Samuel Marndi - Web Developer & Digital Marketer"
        />
        <meta
          property="og:description"
          content="Terms and Conditions for Samuel Marndi's web development and digital marketing services. Read about the terms governing the use of my services and website."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://samuelmarndi.in/terms-conditions" />
      </Helmet>

      <PageHeader
        title="Terms and Conditions"
        description="These terms and conditions outline the rules and regulations for the use of my services."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms and Conditions", href: "/terms-conditions" },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-blue dark:prose-invert">
          <h2>Introduction</h2>
          <p>
            These terms and conditions govern your use of the website and services operated by Samuel Marndi. By accessing this website or using my services, you agree to be bound by these terms and conditions. If you disagree with any part of these terms, please do not use my website or services.
          </p>
          
          <h2>Services Description</h2>
          <p>
            I provide web development, digital marketing, and related services as described on my website. The exact scope, deliverables, timelines, and payment terms for each service will be outlined in a separate service agreement or statement of work provided to you before the commencement of any project.
          </p>
          
          <h2>Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, I own the intellectual property rights for all material on this website. All intellectual property rights are reserved.
          </p>
          <p>
            Upon full payment for services, you are granted the rights to the deliverables as specified in your service agreement. However, I reserve the right to:
          </p>
          <ul>
            <li>Retain ownership of any proprietary tools, frameworks, or methodologies used in creating your deliverables</li>
            <li>Display or link to your project in my portfolio (unless specified otherwise in writing)</li>
            <li>Use non-confidential aspects of your project for demonstration or educational purposes</li>
          </ul>
          
          <h2>Client Responsibilities</h2>
          <p>
            As a client, you agree to:
          </p>
          <ul>
            <li>Provide accurate and complete information required for the project</li>
            <li>Review and provide feedback on deliverables in a timely manner</li>
            <li>Obtain any necessary third-party permissions for materials you provide</li>
            <li>Make payments according to the agreed payment schedule</li>
            <li>Comply with all applicable laws and regulations regarding content and data</li>
          </ul>
          
          <h2>Service Delivery and Acceptance</h2>
          <p>
            I will make every effort to deliver services according to agreed-upon timelines. However, some timelines may be estimates and could be affected by factors such as client response times, third-party dependencies, or unforeseen technical challenges.
          </p>
          <p>
            Upon delivery of each milestone or final deliverable, you will have an opportunity to review and request reasonable revisions as outlined in your service agreement. Acceptance is assumed if no feedback is provided within the specified review period.
          </p>
          
          <h2>Payment Terms</h2>
          <p>
            Payment terms, including amounts, schedules, and methods, will be specified in your service agreement. Unless otherwise agreed:
          </p>
          <ul>
            <li>A deposit may be required before work begins</li>
            <li>Invoices are due upon receipt</li>
            <li>Late payments may incur additional fees</li>
            <li>I reserve the right to pause work if payments are significantly overdue</li>
          </ul>
          <p>
            Full payment is required before the transfer of final deliverables or publishing of websites.
          </p>
          
          <h2>Cancellation and Termination</h2>
          <p>
            Either party may terminate services with written notice as specified in your service agreement. In case of termination:
          </p>
          <ul>
            <li>You will be invoiced for work completed up to the termination date</li>
            <li>Any deposit may be non-refundable as stated in your agreement</li>
            <li>I will deliver work completed to date once all outstanding invoices are paid</li>
          </ul>
          <p>
            For more details on cancellations and refunds, please refer to my <a href="/refund-policy">Refund Policy</a>.
          </p>
          
          <h2>Limitation of Liability</h2>
          <p>
            While I strive to provide high-quality services, I cannot guarantee that:
          </p>
          <ul>
            <li>The website will be uninterrupted or error-free</li>
            <li>All digital marketing efforts will yield specific results or returns on investment</li>
            <li>Third-party services integrated into your project will function without issues</li>
          </ul>
          <p>
            My liability is limited to the amount paid for services. I am not liable for indirect, consequential, or incidental damages.
          </p>
          
          <h2>Third-Party Services and Tools</h2>
          <p>
            My services may include or require the use of third-party tools, platforms, or services (such as hosting providers, plugins, or APIs). These third-party services are subject to their own terms and conditions. I am not responsible for changes, discontinuation, or issues with third-party services that may affect your project.
          </p>
          
          <h2>Confidentiality</h2>
          <p>
            I will maintain the confidentiality of sensitive information provided by you during the course of our work together. Similarly, you agree to keep confidential any proprietary information regarding my processes, methodologies, or business practices.
          </p>
          
          <h2>Website Use</h2>
          <p>
            When using this website, you agree not to:
          </p>
          <ul>
            <li>Use it in any way that causes, or may cause, damage to the website or impairment of availability</li>
            <li>Use it in any way that is unlawful, illegal, fraudulent, or harmful</li>
            <li>Use it in connection with any commercial activities without explicit permission</li>
            <li>Copy, reproduce, or redistribute content without permission</li>
          </ul>
          
          <h2>Modifications to Terms</h2>
          <p>
            I reserve the right to revise these terms at any time without notice. By continuing to use this website or my services after any revisions, you are agreeing to be bound by the revised terms.
          </p>
          
          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India, and you submit to the exclusive jurisdiction of the courts located in India for resolution of any disputes.
          </p>
          
          <h2>Contact</h2>
          <p>
            If you have any questions about these terms and conditions, please contact me at:
          </p>
          <p>
            <strong>Email:</strong> samuelmarandi6@gmail.com<br />
            <strong>Phone:</strong> +91 8280320550
          </p>
          
          <p className="text-sm text-gray-500 mt-8">
            Last updated: May 8, 2025
          </p>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;