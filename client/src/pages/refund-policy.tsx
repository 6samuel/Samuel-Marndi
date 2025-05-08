import React from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/ui/page-header";

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Refund Policy | Samuel Marndi - Web Developer & Digital Marketer</title>
        <meta
          name="description"
          content="Refund Policy for Samuel Marndi's web development and digital marketing services. Learn about my refund terms and conditions for all services."
        />
        <meta
          property="og:title"
          content="Refund Policy | Samuel Marndi - Web Developer & Digital Marketer"
        />
        <meta
          property="og:description"
          content="Refund Policy for Samuel Marndi's web development and digital marketing services. Learn about my refund terms and conditions for all services."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://samuelmarndi.in/refund-policy" />
      </Helmet>

      <PageHeader
        title="Refund Policy"
        description="This refund policy outlines the terms under which refunds may be issued for my services."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Refund Policy", href: "/refund-policy" },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-blue dark:prose-invert">
          <h2>Introduction</h2>
          <p>
            I want you to be completely satisfied with the services I provide. This refund policy outlines when and how refunds are processed for different types of services I offer. By engaging my services, you agree to the terms of this refund policy.
          </p>
          
          <h2>Web Development and Design Projects</h2>
          
          <h3>Deposit and Initial Payments</h3>
          <p>
            For web development projects, I typically require an initial deposit to secure your project in my schedule and begin work. This deposit is generally non-refundable as it compensates for time allocated to your project, preliminary work, and opportunity costs of declining other work.
          </p>
          
          <h3>Milestone Payments</h3>
          <p>
            For projects with milestone payments:
          </p>
          <ul>
            <li>Each milestone payment is for work completed up to that point</li>
            <li>Once a milestone is approved and paid for, that payment is non-refundable</li>
            <li>If the project is cancelled before completion, you will receive all work completed to date that has been paid for</li>
          </ul>
          
          <h3>Project Cancellation by Client</h3>
          <p>
            If you choose to cancel a project in progress:
          </p>
          <ul>
            <li>You will be billed for all work completed up to the cancellation date</li>
            <li>Any deposit paid is non-refundable</li>
            <li>The completed portion of the project will be delivered once all outstanding invoices are paid</li>
          </ul>
          
          <h3>Project Cancellation by Me</h3>
          <p>
            In the rare event that I need to cancel a project due to unforeseen circumstances:
          </p>
          <ul>
            <li>You will be billed only for work completed up to that point</li>
            <li>Any prepaid amounts for work not yet completed will be refunded</li>
            <li>I will make reasonable efforts to refer you to other qualified professionals</li>
          </ul>
          
          <h2>Digital Marketing Services</h2>
          
          <h3>Monthly Services</h3>
          <p>
            For ongoing monthly services such as SEO, social media management, or PPC campaign management:
          </p>
          <ul>
            <li>Services are typically billed monthly in advance</li>
            <li>No refunds are provided for the current month once work has begun</li>
            <li>You may cancel future months with notice as specified in your service agreement (typically 30 days)</li>
          </ul>
          
          <h3>Campaign Setup Fees</h3>
          <p>
            Setup fees for marketing campaigns (such as initial PPC account setup or SEO audits) are non-refundable once work has begun, as they represent completed work.
          </p>
          
          <h2>Consultation Services</h2>
          <p>
            For consulting services:
          </p>
          <ul>
            <li><strong>Rescheduling:</strong> Consultation appointments may be rescheduled without penalty with at least 24 hours' notice</li>
            <li><strong>Cancellations:</strong> 
              <ul>
                <li>With more than 48 hours' notice: Full refund or credit for future services</li>
                <li>With 24-48 hours' notice: 50% refund or full credit for future services</li>
                <li>With less than 24 hours' notice: No refund, but a one-time option to reschedule at my discretion</li>
              </ul>
            </li>
            <li><strong>No-shows:</strong> No refund will be provided if you fail to attend a scheduled consultation without notice</li>
          </ul>
          
          <h2>Product Quality and Satisfaction</h2>
          
          <h3>Quality Guarantee</h3>
          <p>
            I strive to deliver the highest quality of work. If you believe the delivered work does not meet the agreed-upon specifications:
          </p>
          <ul>
            <li>You must notify me in writing within 7 days of delivery</li>
            <li>Your concerns must specifically reference items in the original project scope</li>
            <li>I will work to address reasonable revision requests within the original project scope</li>
          </ul>
          
          <h3>Revision Limitations</h3>
          <p>
            Refunds will not be issued for:
          </p>
          <ul>
            <li>Change requests that fall outside the original agreed-upon project scope</li>
            <li>Subjective aspects of the work (such as design preferences) if the work objectively meets the agreed specifications</li>
            <li>Issues caused by third-party services outside my control</li>
            <li>Problems resulting from your failure to follow recommended guidelines or provide required information</li>
          </ul>
          
          <h2>Payment Processing Fees</h2>
          <p>
            In cases where refunds are issued, please note:
          </p>
          <ul>
            <li>Payment processor fees (from PayPal, Stripe, Razorpay, etc.) are usually non-refundable</li>
            <li>These fees may be deducted from any refund amount</li>
          </ul>
          
          <h2>How to Request a Refund</h2>
          <p>
            To request a refund:
          </p>
          <ol>
            <li>Contact me at samuelmarandi6@gmail.com with the subject line "Refund Request"</li>
            <li>Include your name, the service purchased, date of purchase, and reason for the refund request</li>
            <li>I will respond to your request within 3 business days</li>
          </ol>
          
          <h2>Processing Time</h2>
          <p>
            If a refund is approved:
          </p>
          <ul>
            <li>Refunds will be processed within 7-10 business days</li>
            <li>The refund will be issued using the same payment method used for the original purchase when possible</li>
            <li>You will be notified by email when the refund has been processed</li>
          </ul>
          
          <h2>Exceptions</h2>
          <p>
            I reserve the right to make exceptions to this policy on a case-by-case basis at my sole discretion. Any exceptions made will not constitute a waiver of this policy for future transactions.
          </p>
          
          <h2>Changes to This Policy</h2>
          <p>
            I reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to the website. Your continued use of my services following the posting of changes constitutes your acceptance of such changes.
          </p>
          
          <h2>Contact</h2>
          <p>
            If you have any questions about this refund policy, please contact me at:
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

export default RefundPolicy;