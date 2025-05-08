import React from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/ui/page-header";

const CookiePolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | Samuel Marndi - Web Developer & Digital Marketer</title>
        <meta
          name="description"
          content="Cookie Policy for Samuel Marndi's website. Learn how cookies are used on this site and how you can control them."
        />
        <meta
          property="og:title"
          content="Cookie Policy | Samuel Marndi - Web Developer & Digital Marketer"
        />
        <meta
          property="og:description"
          content="Cookie Policy for Samuel Marndi's website. Learn how cookies are used on this site and how you can control them."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://samuelmarndi.in/cookie-policy" />
      </Helmet>

      <PageHeader
        title="Cookie Policy"
        description="This cookie policy explains how I use cookies and similar technologies on my website."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cookie Policy", href: "/cookie-policy" },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose prose-blue dark:prose-invert">
          <h2>Introduction</h2>
          <p>
            This Cookie Policy explains how I use cookies and similar technologies to recognize you when you visit my website at <a href="https://samuelmarndi.in">samuelmarndi.in</a>. It explains what these technologies are and why I use them, as well as your rights to control my use of them.
          </p>
          
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p>
            Cookies set by the website owner (in this case, Samuel Marndi) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
          </p>
          
          <h2>Why Do I Use Cookies?</h2>
          <p>
            I use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for my website to operate, and I refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable me to track and target the interests of my users to enhance the experience on my site. Third parties serve cookies through my site for advertising, analytics, and other purposes.
          </p>
          
          <h2>Types of Cookies I Use</h2>
          <p>
            The specific types of first and third-party cookies served through my website and the purposes they perform include:
          </p>
          
          <h3>Essential Website Cookies</h3>
          <p>
            These cookies are strictly necessary to provide you with services available through my website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how my website functions.
          </p>
          
          <h3>Performance and Functionality Cookies</h3>
          <p>
            These cookies are used to enhance the performance and functionality of my website but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
          </p>
          
          <h3>Analytics and Customization Cookies</h3>
          <p>
            These cookies collect information that is used either in aggregate form to help me understand how my website is being used or how effective my marketing campaigns are, or to help me customize my website for you. I use analytics cookies such as Google Analytics to gather information about how users interact with the website, which helps me improve its functionality and user experience.
          </p>
          
          <h3>Advertising Cookies</h3>
          <p>
            These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
          </p>
          
          <h3>Social Media Cookies</h3>
          <p>
            These cookies are used to enable you to share pages and content that you find interesting on my website through third-party social networking and other websites. These cookies may also be used for advertising purposes.
          </p>
          
          <h2>How Can You Control Cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences as follows:
          </p>
          
          <h3>Browser Controls</h3>
          <p>
            You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use my website though your access to some functionality and areas of my website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
          </p>
          
          <h3>Disabling Most Interest-Based Advertising</h3>
          <p>
            Most advertising networks offer you a way to opt out of interest-based advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">http://www.youronlinechoices.com</a>.
          </p>
          
          <h3>Opting Out of Google Analytics</h3>
          <p>
            To opt out of being tracked by Google Analytics across all websites, visit <a href="http://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">http://tools.google.com/dlpage/gaoptout</a>.
          </p>
          
          <h2>What About Other Tracking Technologies?</h2>
          <p>
            Cookies are not the only way to recognize or track visitors to a website. I may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables me to recognize when someone has visited my website or opened an email that I have sent them. This allows me, for example, to monitor the traffic patterns of users from one page within my website to another, to deliver or communicate with cookies, to understand whether you have come to my website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
          </p>
          
          <h2>Do You Use Flash Cookies or Local Shared Objects?</h2>
          <p>
            My website may also use so-called "Flash Cookies" (also known as Local Shared Objects or "LSOs") to, among other things, collect and store information about your use of my services, fraud prevention, and for other site operations.
          </p>
          <p>
            If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html" target="_blank" rel="noopener noreferrer">Website Storage Settings Panel</a>. You can also control Flash Cookies by going to the <a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html" target="_blank" rel="noopener noreferrer">Global Storage Settings Panel</a> and following the instructions.
          </p>
          <p>
            Please note that setting the Flash Player to restrict or limit acceptance of Flash Cookies may reduce or impede the functionality of some Flash applications, including, potentially, Flash applications used in connection with my services or online content.
          </p>
          
          <h2>Do You Serve Targeted Advertising?</h2>
          <p>
            Third parties may serve cookies on your computer or mobile device to serve advertising through my website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. This can be accomplished by them using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you. The information collected through this process does not enable me or them to identify your name, contact details, or other personally identifying details unless you choose to provide these.
          </p>
          
          <h2>How Often Will You Update this Cookie Policy?</h2>
          <p>
            I may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies I use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about my use of cookies and related technologies.
          </p>
          <p>
            The date at the bottom of this Cookie Policy indicates when it was last updated.
          </p>
          
          <h2>Contact</h2>
          <p>
            If you have any questions about my use of cookies or other technologies, please contact me at:
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

export default CookiePolicy;