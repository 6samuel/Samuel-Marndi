import React from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/ui/page-header";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Samuel Marndi - Web Developer & Digital Marketer</title>
        <meta
          name="description"
          content="Privacy Policy for Samuel Marndi's web development and digital marketing services. Learn how your personal data is collected, used, and protected."
        />
        <meta
          property="og:title"
          content="Privacy Policy | Samuel Marndi - Web Developer & Digital Marketer"
        />
        <meta
          property="og:description"
          content="Privacy Policy for Samuel Marndi's web development and digital marketing services. Learn how your personal data is collected, used, and protected."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://samuelmarndi.in/privacy-policy" />
      </Helmet>

      <PageHeader
        title="Privacy Policy"
        description="This Privacy Policy outlines how I collect, use, and protect your personal information."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy" },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-blue dark:prose-invert">
          <h2>Introduction</h2>
          <p>
            At Samuel Marndi, I respect your privacy and am committed to protecting your personal data. This privacy policy will inform you about how I look after your personal data when you visit my website and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2>Information I Collect</h2>
          <p>
            I may collect, use, store and transfer different kinds of personal data about you which I have grouped together as follows:
          </p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address, telephone numbers, and physical address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use my website, products, and services.</li>
            <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from me and my third parties and your communication preferences.</li>
          </ul>
          
          <h2>How I Collect Your Personal Data</h2>
          <p>
            I use different methods to collect data from and about you including through:
          </p>
          <ul>
            <li><strong>Direct interactions.</strong> You may give me your Identity and Contact by filling in forms or by corresponding with me by post, phone, email, or otherwise.</li>
            <li><strong>Automated technologies or interactions.</strong> As you interact with my website, I may automatically collect Technical Data about your equipment, browsing actions, and patterns.</li>
            <li><strong>Third parties or publicly available sources.</strong> I may receive personal data about you from various third parties and public sources as set out below:
              <ul>
                <li>Technical Data from analytics providers such as Google.</li>
                <li>Contact, Financial and Transaction Data from providers of technical, payment and delivery services.</li>
              </ul>
            </li>
          </ul>
          
          <h2>How I Use Your Personal Data</h2>
          <p>
            I will only use your personal data when the law allows me to. Most commonly, I will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where I need to perform the contract I am about to enter into or have entered into with you.</li>
            <li>Where it is necessary for my legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where I need to comply with a legal obligation.</li>
          </ul>
          
          <h3>Purposes for which I will use your personal data</h3>
          <ul>
            <li>To register you as a new customer</li>
            <li>To process and deliver your order</li>
            <li>To manage my relationship with you</li>
            <li>To enable you to participate in a feature on my website</li>
            <li>To administer and protect my business and this website</li>
            <li>To deliver relevant website content and advertisements to you</li>
            <li>To use data analytics to improve my website, products/services, marketing, customer relationships, and experiences</li>
          </ul>
          
          <h2>Cookies</h2>
          <p>
            Cookies are small files placed on your computer's hard drive that enable the website to identify your computer as you view different pages. Cookies allow websites and applications to store your preferences in order to present content, options or functions that are specific to you. Like most interactive websites, my website uses cookies to enable it to retrieve user details for each visit.
          </p>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
          </p>
          <p>
            For more details about cookies and how I use them, please see my <a href="/cookie-policy">Cookie Policy</a>.
          </p>
          
          <h2>Data Security</h2>
          <p>
            I have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, I limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on my instructions and they are subject to a duty of confidentiality.
          </p>
          <p>
            I have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where I am legally required to do so.
          </p>
          
          <h2>Data Retention</h2>
          <p>
            I will only retain your personal data for as long as reasonably necessary to fulfill the purposes I collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. I may retain your personal data for a longer period in the event of a complaint or if I reasonably believe there is a prospect of litigation in respect to my relationship with you.
          </p>
          
          <h2>Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
          </p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
          
          <h2>Changes to the Privacy Policy</h2>
          <p>
            I reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If I make material changes to this policy, I will notify you here that it has been updated, so that you are aware of what information I collect, how I use it, and under what circumstances, if any, I use and/or disclose it.
          </p>
          
          <h2>Contact</h2>
          <p>
            If you have any questions about this privacy policy or my treatment of your personal information, please contact me at:
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

export default PrivacyPolicy;