/**
 * Coastal Clinical Editorial: a left-led consultation spine uses ivory space,
 * Abrahams Aqua, coral offer accents, and human clinical imagery to feel precise and reassuring.
 */
import { FormEvent, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const phone = "(305) 203-1007";

const treatmentList = [
  "Natural-looking dentures",
  "Implant-supported dentures",
  "Metal-free partial dentures",
  "Same-day repairs",
  "Denture stabilization",
  "Crowns & bridges",
];

const steps = [
  ["01", "Share what changed", "Tell us what feels broken, uncomfortable, or overdue. We start by listening."],
  ["02", "Meet Dr Abrahams", "Your consultation is clear, unrushed, and focused on the options that fit your needs."],
  ["03", "See the lab advantage", "When appropriate, our on-site lab helps us move from plan to repair in the same day."],
  ["04", "Leave with direction", "You will understand the next step, the timing, and how to care for your renewed smile."],
];

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Dr Abrahams Denture Repair home">
      <img src="/manus-storage/dr-abrahams-symbol_03815376.png" alt="" />
      <span className="brand-type">
        <small>MIAMI BEACH</small>
        <strong>DR ABRAHAMS</strong>
        <em>PROSTHODONTIST</em>
      </span>
    </a>
  );
}

function ConsultationForm({ compact = false }: { compact?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form className={`consultation-form ${compact ? "consultation-form--compact" : ""}`} onSubmit={handleSubmit}>
      {submitted ? (
        <div className="form-success" role="status">
          <span><Check aria-hidden="true" /></span>
          <div><strong>Thank you — we have your request.</strong><p>Our team will be in touch to arrange your complimentary consultation.</p></div>
        </div>
      ) : (
        <>
          <div className="form-grid">
            <label>
              <span>Full name</span>
              <input required name="name" type="text" placeholder="Your name" />
            </label>
            <label>
              <span>Phone number</span>
              <input required name="phone" type="tel" placeholder="(305) 000-0000" />
            </label>
          </div>
          {!compact && (
            <label>
              <span>Email address</span>
              <input required name="email" type="email" placeholder="you@email.com" />
            </label>
          )}
          <label>
            <span>How can we help?</span>
            <select defaultValue="">
              <option value="" disabled>Select an option</option>
              <option>Repair a broken denture</option>
              <option>Same-day dentures</option>
              <option>Partial dentures</option>
              <option>Implant-supported dentures</option>
              <option>Something else</option>
            </select>
          </label>
          <button className="button button--coral button--form" type="submit">
            Request my consultation <ArrowUpRight aria-hidden="true" />
          </button>
          <p className="form-note">By requesting an appointment, you agree to be contacted by our office about scheduling.</p>
        </>
      )}
    </form>
  );
}

function MobileMenu({ open, close }: { open: boolean; close: () => void }) {
  return (
    <div className={`mobile-menu ${open ? "mobile-menu--open" : ""}`} aria-hidden={!open}>
      <div className="mobile-menu__head"><Logo /><button onClick={close} className="icon-button" aria-label="Close menu"><X /></button></div>
      <nav aria-label="Mobile navigation">
        <a onClick={close} href="#why">Why Dr Abrahams <ArrowDownRight /></a>
        <a onClick={close} href="#care">Denture care <ArrowDownRight /></a>
        <a onClick={close} href="#process">Your consultation <ArrowDownRight /></a>
        <a onClick={close} href="#request">Request an appointment <ArrowDownRight /></a>
      </nav>
      <a className="mobile-menu__phone" href="tel:3052031007"><Phone /> {phone}</a>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="site-shell">
      <div className="topline">
        <div className="site-width topline__inner">
          <a href="https://maps.app.goo.gl/Z155xb63Bjcu8C3c6" target="_blank" rel="noreferrer">960 Arthur Godfrey Rd #400, Miami Beach, FL 33140 <ArrowUpRight aria-hidden="true" /></a>
          <span>Dedicated prosthodontic care, close to home</span>
        </div>
      </div>

      <header className="site-header">
        <div className="site-width header-inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#why">Why Dr Abrahams</a>
            <a href="#care">Denture care</a>
            <a href="#process">The process</a>
          </nav>
          <div className="header-actions">
            <a className="phone-link" href="tel:3052031007"><Phone aria-hidden="true" /> <span>{phone}</span></a>
            <a className="button button--small" href="#request">Book appointment <ArrowUpRight aria-hidden="true" /></a>
            <button className="icon-button menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} close={() => setMenuOpen(false)} />

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-backdrop" />
          <div className="hero-veil" />
          <div className="site-width hero-layout">
            <div className="hero-copy">
              <p className="eyebrow eyebrow--light"><i /> Denture repair · Miami Beach</p>
              <h1 id="hero-title">A repaired smile can be <em>closer</em> than you think.</h1>
              <p className="hero-intro">Personal denture repair and same-day restorative care from Miami Beach’s dedicated prosthodontist.</p>
              <div className="hero-actions">
                <a className="button button--coral" href="#request">Book a free consult <ArrowUpRight aria-hidden="true" /></a>
                <a className="text-button text-button--light" href="#care">Explore denture care <ArrowDownRight aria-hidden="true" /></a>
              </div>
              <div className="hero-proof">
                <span><CalendarDays /> Scheduling this week</span>
                <span><ShieldCheck /> Most insurances accepted</span>
              </div>
            </div>
            <aside className="offer-card" aria-label="Complimentary consultation offer">
              <p className="offer-card__overline">The first step is simple</p>
              <div className="offer-card__heading"><span>Free</span><strong>Consult</strong></div>
              <p>Meet Dr Abrahams, understand your options, and find the right path forward.</p>
              <a href="#request" className="offer-card__link">Request an appointment <ArrowDownRight /></a>
            </aside>
          </div>
          <div className="hero-footer site-width"><span>Same-day service when clinically appropriate</span><ChevronDown aria-hidden="true" /></div>
        </section>

        <section id="why" className="expert-section section-pad" aria-labelledby="expert-title">
          <div className="orbit orbit--a" aria-hidden="true" />
          <div className="site-width expert-layout">
            <div className="section-label"><span>01</span><p>Why choose<br />Dr Abrahams</p></div>
            <div className="expert-copy">
              <p className="eyebrow"><i /> The only prosthodontist in Miami Beach</p>
              <h2 id="expert-title">When your smile needs <em>specialised care.</em></h2>
              <p className="body-large">Dr. Howard Abrahams combines advanced prosthodontic training with a distinctly personal approach. Every recommendation begins with your comfort, your schedule, and your goals.</p>
              <a href="#request" className="text-button">Meet with Dr Abrahams <ArrowDownRight aria-hidden="true" /></a>
            </div>
            <div className="expert-image-frame">
              <img src="/manus-storage/dr-abrahams-consultation_b8d94055.jpg" alt="A dentist listening carefully during a consultation" />
              <div className="image-note"><span>15+</span><p>years of clinical<br />experience</p></div>
            </div>
          </div>
          <div className="site-width credential-band">
            <div><span className="credential-icon"><Clock3 /></span><p><strong>On-site lab</strong><br />for same-day delivery</p></div>
            <div><span className="credential-number">580+</span><p><strong>5-Star Google Reviews</strong><br />from our community</p></div>
            <div><span className="credential-icon"><Sparkles /></span><p><strong>Unmatched care</strong><br />and clear guidance</p></div>
          </div>
        </section>

        <section id="care" className="care-section" aria-labelledby="care-title">
          <div className="site-width care-layout">
            <div className="care-image-stack">
              <div className="care-image care-image--main"><img src="/manus-storage/dr-abrahams-lab-craft_46fd0b60.jpg" alt="Detailed work on a custom denture in the on-site lab" /></div>
              <div className="care-image care-image--small"><img src="/manus-storage/dr-abrahams-restorative-smile_02663fcd.jpg" alt="A patient relaxed and confident after restorative care" /></div>
              <span className="stamp">Built around<br />your life</span>
            </div>
            <div className="care-copy section-pad">
              <p className="eyebrow"><i /> Dentures, without the delay</p>
              <h2 id="care-title">Precision made for your <em>everyday.</em></h2>
              <p className="body-large">Many people expect to wait weeks for a new denture or repair. With an in-house lab, Dr Abrahams can offer a more immediate path — including same-day dentures and repairs when appropriate.</p>
              <div className="care-list">
                {treatmentList.map((treatment, index) => <div key={treatment}><span>0{index + 1}</span><p>{treatment}</p><ArrowUpRight /></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="lab-section section-pad" aria-labelledby="lab-title">
          <div className="site-width lab-layout">
            <div className="lab-title"><p className="eyebrow eyebrow--light"><i /> Here, expertise stays close</p><h2 id="lab-title">Your care doesn’t leave the building.</h2></div>
            <div className="lab-copy"><p>Our fully equipped office and on-site lab help us create custom restorations while you wait, rather than routing your care through a distant process. It is precision with more of your time in mind.</p><a className="button button--outline" href="#request">Discuss your options <ArrowUpRight /></a></div>
          </div>
        </section>

        <section id="process" className="process-section section-pad" aria-labelledby="process-title">
          <div className="site-width process-heading"><div className="section-label"><span>02</span><p>Your complimentary<br />consultation</p></div><div><p className="eyebrow"><i /> A clear path, in four conversations</p><h2 id="process-title">Your smile deserves a <em>considered plan.</em></h2></div></div>
          <div className="site-width process-list">
            {steps.map(([number, title, copy]) => <article key={number} className="process-item"><span>{number}</span><h3>{title}</h3><p>{copy}</p><ArrowDownRight aria-hidden="true" /></article>)}
          </div>
        </section>

        <section id="request" className="request-section" aria-labelledby="request-title">
          <div className="request-image" role="img" aria-label="A denture being evaluated in a clinical laboratory" />
          <div className="request-overlay" />
          <div className="site-width request-layout">
            <div className="request-copy"><p className="eyebrow eyebrow--light"><i /> Request a consultation</p><h2 id="request-title">Get the right guidance for what comes <em>next.</em></h2><p>Tell us a little about what brought you here. Our office will be in touch to arrange your complimentary consultation.</p><div className="request-contact"><a href="tel:3052031007"><Phone /> {phone}</a><a href="https://maps.app.goo.gl/Z155xb63Bjcu8C3c6" target="_blank" rel="noreferrer">960 Arthur Godfrey Rd #400<br />Miami Beach, FL 33140 <ArrowUpRight /></a></div></div>
            <div className="request-form-wrap"><p className="form-kicker">Your appointment request</p><ConsultationForm /></div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-width footer-main"><Logo /><div><p>Restorative dentistry with the focus, capability, and attention your smile deserves.</p><a href="#top" className="footer-top">Back to top <ArrowUpRight /></a></div><a className="footer-phone" href="tel:3052031007">{phone}</a></div>
        <div className="site-width footer-bottom"><span>© {new Date().getFullYear()} Dr Abrahams. All rights reserved.</span><div><a href="#top">Privacy policy</a><a href="#top">Accessibility</a></div></div>
      </footer>
    </div>
  );
}
