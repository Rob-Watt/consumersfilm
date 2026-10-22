import { site } from "../../lib/site";

// Update this date whenever the policy text changes.
const effective = "October 22, 2026";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${site.operator} handles personal information on consumersfilm.com.`,
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  const email = site.contactEmail;
  const mail = <a href={`mailto:${email}`}>{email}</a>;

  return (
    <main className="legal theme-light">
      <article className="legal__body">
        <h1>Privacy Policy</h1>
        <p className="legal__date">Effective {effective}</p>

        <p>
          consumersfilm.com is the official website for the film <em>{site.title}</em>. It is run by{" "}
          {site.operator}, a film production company based in {site.operatorLocation} (“we”, “us”).
          This policy explains what personal information the site collects, how we use it, and the
          choices you have.
        </p>

        <h2>What we collect</h2>
        <h3>If you join the email list</h3>
        <p>Your email address and the date you signed up.</p>

        <h3>If you create an account or log in</h3>
        <p>
          Your email address. If you log in with Google, Google shares your name, email address and
          profile picture with us; we don’t receive your Google password. We also keep basic records
          of when you log in.
        </p>

        <h3>When you visit the site</h3>
        <p>
          The site is hosted by GitHub Pages, which may record your IP address and browser details in
          its server logs for security and reliability. We don’t use those logs to identify you.
        </p>

        <h3>Stored in your browser</h3>
        <p>
          The site saves a small amount of information in your browser’s local storage: whether
          you’ve already seen the sign-up window (so it doesn’t keep appearing) and, if you log in,
          a session token that keeps you logged in. We don’t use cookies, and nothing is stored for
          advertising or tracking.
        </p>

        <h2>What we don’t do</h2>
        <ul>
          <li>We don’t show ads or use advertising networks.</li>
          <li>We don’t use analytics or tracking tools that follow you across websites.</li>
          <li>We don’t sell your personal information or share it for targeted advertising.</li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>To send you news about <em>{site.title}</em>, if you joined the email list.</li>
          <li>To let you log in and to send you log-in links.</li>
          <li>To answer messages and requests you send us.</li>
          <li>To keep the site secure and prevent misuse.</li>
        </ul>

        <h2>Services that handle your information for us</h2>
        <p>We use a small number of providers, who process information only to provide their service to us:</p>
        <ul>
          <li><strong>Supabase</strong> stores the email list and user accounts.</li>
          <li><strong>Resend</strong> delivers log-in emails.</li>
          <li><strong>Google</strong> handles sign-in, if you choose “Continue with Google”.</li>
          <li><strong>GitHub</strong> hosts the website.</li>
        </ul>
        <p>
          Your information may be processed in the United States and other countries where these
          providers operate. We may also disclose information if the law requires it.
        </p>
        <p>
          The site links to other websites, such as IMDb and our shop partners. Their own privacy
          policies apply when you visit them.
        </p>

        <h2>How long we keep it</h2>
        <p>
          We keep your email address on the list until you unsubscribe, and your account until you
          ask us to delete it.
        </p>

        <h2>Your choices and rights</h2>
        <p>
          You can unsubscribe from the email list at any time, using the link in any email we send
          or by emailing us. You can ask us to tell you what information we hold about you, to
          correct it, or to delete it, by emailing {mail}.
        </p>
        <p>
          <strong>California residents</strong> have the right to know what personal information we
          collect and how it is used, to have it deleted or corrected, and to opt out of its sale or
          sharing. We don’t sell or share personal information, so there is nothing to opt out of.
          We won’t treat you differently for using these rights. We will respond to requests within
          45 days, and may need to confirm your identity first. You can also ask someone to make a
          request on your behalf.
        </p>

        <h2>Do Not Track</h2>
        <p>
          We don’t track visitors across websites, so the site works the same whether or not your
          browser sends a “Do Not Track” or Global Privacy Control signal.
        </p>

        <h2>Children</h2>
        <p>
          This site is not directed to children under 13, and we don’t knowingly collect their
          personal information. If you believe a child has given us their information, please email
          us and we will delete it.
        </p>

        <h2>Security</h2>
        <p>
          We use reasonable measures to protect your information, including encrypted connections
          and access controls, but no method of transmission or storage is completely secure.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we change this policy, we’ll update the date at the top of this page. If the changes are
          significant, we’ll also let people on the email list know.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or requests: {mail}
          <br />
          {site.operator}, {site.operatorLocation}
        </p>
      </article>
    </main>
  );
}
