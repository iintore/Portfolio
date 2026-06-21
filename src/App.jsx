import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Save,
  Star,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { FaBehance, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const asset = (name) => `/assets/${name}`;

const services = [
  { title: "UI/UX Design", image: asset("service-uiux.jpg") },
  { title: "Design System", image: asset("service-design-system.jpg") },
  { title: "Product Strategy", image: asset("service-product-strategy.jpg") },
  { title: "Product Discover", image: asset("service-discovery.jpg") },
];



const processSteps = [
  {
    label: "step1",
    title: "Getting Close to the Problem",
    body: "Before designing anything, we spent time understanding what people were struggling with, what the business needed, and where opportunities existed.",
  },
  {
    label: "step2",
    title: "Finding What Matters Most",
    body: "Not every problem deserves a solution. We identified the biggest pain points, aligned on priorities, and focused on what would create the most value.",
  },
  {
    label: "step3",
    title: "Turning Ideas Into Experiences",
    body: "I explored concepts, mapped journeys, tested flows, and refined the experience until it felt simple, intuitive, and ready for real users.",
  },
  {
    label: "step4",
    title: "And Bringing It Into the Real World",
    body: "Design doesn't stop in Figma. We worked closely with developers, launched the product, gathered feedback, and continued improving the experience.",
  },
];

const testimonials = [
  {
    name: "James Wan",
    company: "Horizon Digital",
    avatar: asset("avatar-james.png"),
    quote:
      "The attention to detail and creative approach gave our website a modern, professional look. It perfectly represents our company and enhances our brand presence significantly.",
  },
  {
    name: "Rachel Foster",
    company: "Elite Interiors",
    avatar: asset("avatar-rachel.jpg"),
    quote:
      "We needed a high-end, elegant website, and the results went beyond what we imagined. The refined design and seamless experience perfectly align with our brand identity.",
  },
  {
    name: "Nicolo Taime",
    company: "Creative Edge Studio",
    avatar: asset("avatar-nicolo.png"),
    quote:
      "A true professional approach! The vision was brought to life with unique and visually compelling designs. The process was smooth, and the outcome was outstandingly well-executed.",
  },
  {
    name: "Chasli Thompson",
    company: "Vertex Technologies",
    avatar: asset("avatar-chasli.png"),
    quote:
      "From concept to execution, the designs exceeded our expectations in every way. They are stunning, user-friendly, and strategically crafted for engagement and conversions.",
  },
  {
    name: "Sarah Mitchell",
    company: "Prime Realty",
    avatar: asset("avatar-sarah.png"),
    quote:
      "Exceptional design skills! The sleek, sophisticated visuals instantly elevated our brand. The designs make a lasting impact and set us apart from the competition effortlessly.",
  },
];

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "I specialize in product design, User Experience design and user research while creating modern, user-friendly experiences tailored to your needs and your users",
  },
  {
    question: "Do you provide revisions?",
    answer:
      "Yes! I offer two free rounds of revisions to ensure the final design meets your vision perfectly. Additional revisions are available if needed",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "Pricing depends on the project scope and the contract type. Contact me if you think we can work together",
  },
  {
    question: "How long does a project take?",
    answer: "Timelines vary based on project complexity/",
  },
];

function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/case-studies")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load case studies");
        return response.json();
      })
      .then((data) => {
        setCaseStudies(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return { caseStudies, setCaseStudies, status };
}

function useExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/experiences")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load experiences");
        return response.json();
      })
      .then((data) => {
        setExperiences(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return { experiences, setExperiences, status };
}

function getPath() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

export function App() {
  const { caseStudies, setCaseStudies, status } = useCaseStudies();
  const { experiences, setExperiences, status: expStatus } = useExperiences();
  const [path, setPath] = useState(getPath());
  const [drawerProjectId, setDrawerProjectId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("portfolio_auth") === "true"
  );
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false);
  const [isPreloaderFinished, setIsPreloaderFinished] = useState(false);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [path]);

  const slug = path.startsWith("/projects/") ? path.split("/").pop() : null;
  const current = slug ? caseStudies.find((item) => item.slug === slug) : null;
  const drawerProject = caseStudies.find((item) => item.id === drawerProjectId) || current;

  useEffect(() => {
    if (status === "ready" && current) {
      setDrawerProjectId(current.id);
    }
  }, [current, status]);

  const navigate = (to) => {
    window.history.pushState({}, "", to);
    setPath(getPath());
  };

  const openProject = (project) => {
    setDrawerProjectId(project.id);
  };

  const closeProject = () => {
    setDrawerProjectId(null);
    if (window.location.pathname.startsWith("/projects/")) {
      navigate("/projects");
    }
  };

  const isDataReady = status !== "loading" && expStatus !== "loading";

  if (!isPreloaderFinished) {
    return (
      <LoadingFrame
        isDataReady={isDataReady}
        onComplete={() => setIsPreloaderFinished(true)}
      />
    );
  }

  if (path === "/cms") {
    if (!isAuthenticated) {
      setTimeout(() => navigate("/"), 0);
      return <LoadingFrame isDataReady={false} />;
    }
    return (
      <CmsPage
        caseStudies={caseStudies}
        setCaseStudies={setCaseStudies}
        experiences={experiences}
        setExperiences={setExperiences}
        navigate={navigate}
        onLogout={() => {
          setIsAuthenticated(false);
          localStorage.removeItem("portfolio_auth");
          navigate("/");
        }}
      />
    );
  }

  const isValidRoute =
    path === "/" ||
    path === "/projects" ||
    path.startsWith("/projects/");

  if (!isValidRoute) {
    return (
      <>
        <Shell navigate={navigate} onOpenAuth={() => setIsAuthDrawerOpen(true)}>
          <NotFoundPage navigate={navigate} />
        </Shell>
        {isAuthDrawerOpen && (
          <AuthDrawer
            onClose={() => setIsAuthDrawerOpen(false)}
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              localStorage.setItem("portfolio_auth", "true");
              setIsAuthDrawerOpen(false);
              navigate("/cms");
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Shell navigate={navigate} onOpenAuth={() => setIsAuthDrawerOpen(true)}>
        {path === "/projects" || path.startsWith("/projects/") ? (
          <ProjectsIndex
            caseStudies={caseStudies}
            navigate={navigate}
            openProject={openProject}
          />
        ) : (
          <HomePage
            caseStudies={caseStudies}
            experiences={experiences}
            navigate={navigate}
            openProject={openProject}
          />
        )}
        <ProjectDrawer
          project={drawerProject}
          caseStudies={caseStudies}
          onClose={closeProject}
          openProject={openProject}
        />
      </Shell>
      {isAuthDrawerOpen && (
        <AuthDrawer
          onClose={() => setIsAuthDrawerOpen(false)}
          onLoginSuccess={() => {
            setIsAuthenticated(true);
            localStorage.setItem("portfolio_auth", "true");
            setIsAuthDrawerOpen(false);
            navigate("/cms");
          }}
        />
      )}
    </>
  );
}

function LoadingFrame({ isDataReady = true, onComplete = () => { } }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let timer;
    const updateProgress = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }

        // Organic step size targeting ~3 seconds total (average ~1% every 30ms)
        let step = 1;
        const rand = Math.random();
        if (rand < 0.25) {
          step = 0; // Brief pause to look like active processing
        } else if (rand < 0.75) {
          step = 1;
        } else if (rand < 0.93) {
          step = 2;
        } else {
          step = 3;
        }

        // Near the end, buffer if data is not ready
        if (prev >= 95) {
          if (!isDataReady) {
            // Hold at 99 until data is ready
            return prev < 99 ? prev + 1 : 99;
          } else {
            // Finish normally
            step = Math.random() < 0.5 ? 1 : 2;
          }
        }

        const next = prev + step;
        return next > 100 ? 100 : next;
      });
    };

    timer = setInterval(updateProgress, 30);

    return () => clearInterval(timer);
  }, [isDataReady]);

  useEffect(() => {
    if (progress === 100 && isDataReady) {
      setIsFadingOut(true);
      const exitTimer = setTimeout(() => {
        onComplete();
      }, 400); // 400ms corresponds to CSS transition duration
      return () => clearTimeout(exitTimer);
    }
  }, [progress, isDataReady, onComplete]);

  return (
    <main className={`loading-frame ${isFadingOut ? "fade-out" : ""}`}>
      <div className="loading-content">
        <div className="name-loader" aria-label="Loading portfolio for Tony Lewis MANZI">
          <span className="name-part">TONY LEWIS</span>
          <span className="name-dots" aria-hidden="true">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </span>
          <span className="name-part">MANZI</span>
        </div>
      </div>
    </main>
  );
}

function Shell({ children, navigate, onOpenAuth }) {
  usePremiumScrollMotion();
  useScrollReveal(children);

  return (
    <>
      <Header navigate={navigate} onOpenAuth={onOpenAuth} />
      <CustomCursor />
      {children}
    </>
  );
}

function usePremiumScrollMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;
      document.querySelectorAll("[data-parallax]").forEach((node) => {
        const rect = node.getBoundingClientRect();
        const depth = Number(node.getAttribute("data-parallax") || 18);
        const centerOffset = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        const clamped = Math.max(-1.2, Math.min(1.2, centerOffset));
        node.style.setProperty("--parallax-y", `${(-clamped * depth).toFixed(2)}px`);
        node.style.setProperty("--parallax-scale", `${(1 + Math.abs(clamped) * 0.012).toFixed(4)}`);
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
}

function useScrollReveal(dependency) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        observer.observe(el);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [dependency]);
}

function CustomCursor() {
  const cursorRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const positionRef = React.useRef({ x: 0, y: 0 });
  const hoverTargetRef = React.useRef(null);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return undefined;

    document.body.classList.add("has-custom-cursor");

    const sync = () => {
      rafRef.current = 0;
      cursorRef.current?.style.setProperty("--cursor-x", `${positionRef.current.x}px`);
      cursorRef.current?.style.setProperty("--cursor-y", `${positionRef.current.y}px`);
    };

    const move = (event) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
      setVisible(true);
      const target = event.target.closest?.("[data-cursor-label]");
      if (hoverTargetRef.current !== target) {
        hoverTargetRef.current?.classList.remove("is-cursor-hover");
        hoverTargetRef.current = target || null;
        hoverTargetRef.current?.classList.add("is-cursor-hover");
      }
      if (target) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--hover-x", `${event.clientX - rect.left}px`);
        target.style.setProperty("--hover-y", `${event.clientY - rect.top}px`);
      }
      setLabel(target?.getAttribute("data-cursor-label") || "");
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(sync);
      }
    };

    const clearHover = () => {
      hoverTargetRef.current?.classList.remove("is-cursor-hover");
      hoverTargetRef.current = null;
      setLabel("");
    };

    const leave = () => {
      clearHover();
      setVisible(false);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("pointerdown", clearHover);
    window.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      hoverTargetRef.current?.classList.remove("is-cursor-hover");
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("pointerdown", clearHover);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${visible ? "is-visible" : ""} ${label ? "has-label" : ""}`}
      ref={cursorRef}
      aria-hidden="true"
    >
      <span className="cursor-dot" />
      <span className="cursor-label">{label}</span>
    </div>
  );
}

function Header({ navigate, onOpenAuth }) {
  return (
    <header className="site-header">
      <div />
      <a className="open-link" href="#" onClick={(e) => { e.preventDefault(); onOpenAuth(); }}>
        <span className="availability-dot" />
        Designing Tech
      </a>
    </header>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="section-head reveal-on-scroll">
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
    </div>
  );
}

function PillButton({ href, children, onClick, variant = "dark", ...props }) {
  return (
    <a className={`pill-button ${variant}`} href={href} onClick={onClick} {...props}>
      <span>{children}</span>
      <ArrowUpRight size={19} strokeWidth={1.8} />
    </a>
  );
}

function HomePage({ caseStudies, experiences, navigate, openProject }) {
  const featured = caseStudies.filter((item) => item.featured).slice(0, 12);

  return (
    <main>
      <Hero />
      <BlurDivider />
      <ProjectsPreview projects={featured} navigate={navigate} openProject={openProject} />
      <SkillsSection experiences={experiences} />
      <ProcessSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero">
      <video
        className="hero-video"
        src={asset("hero-orb-video.mp4")}
        data-parallax="30"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hero-inner">
        <div className="hero-copy">
          <h1>
            <span className="muted-title">Hey, </span>
            <br className="mobile-only-break" />
            <span className="muted-title">I'm </span>
            <ImagePill src={asset("tony-headshot.png")} alt="Tony Lewis MANZI" />
            <span>Tony Lewis</span>
            <br />
            <span className="desktop-product-line">
              <span>Senior UI/UX Designer</span>
              <ProjectPills />
            </span>
            <span className="mobile-product-title">Senior UI/UX Designer</span>
            <br className="location-break" />
            <span className="muted-title">Based in </span>
            <span>Kigali</span>
            <ImagePill src={asset("kigali-map.png")} alt="Kigali map" />
          </h1>
          <p>
            Hey <span aria-hidden="true">👋🏾</span>, I'm Tony Lewis MANZI, welcome to my world. I love
            building beautiful, timeless applications & web products experiences
            for users
          </p>
          <PillButton href="https://calendly.com/tonylewismanzi/meet-tony-lewis" target="_blank" rel="noreferrer">
            Get In Touch
          </PillButton>
        </div>
      </div>
    </section>
  );
}

function ImagePill({ src, alt }) {
  return (
    <span className="image-pill">
      <img src={src} alt={alt} />
    </span>
  );
}

function ProjectPills() {
  return (
    <span className="project-pills">
      <ImagePill src={asset("hero-project-1.png")} alt="project preview" />
      <ImagePill src={asset("hero-project-2.png")} alt="project preview" />
    </span>
  );
}

function BlurDivider() {
  return <div className="blur-divider" aria-hidden="true" />;
}

function ProjectsPreview({ projects, navigate, openProject }) {
  return (
    <section className="section projects-section" id="my-projects">
      <SectionHeader
        eyebrow="My Projects"
        title="The designs that turn vision into reality"
      />
      <div className="project-stack">
        {projects.map((project, index) => (
          <ProjectCard
            project={project}
            key={project.id}
            openProject={openProject}
            staggerIndex={index}
          />
        ))}
      </div>
      <PillButton
        href="/projects"
        variant="light"
        onClick={(event) => {
          event.preventDefault();
          navigate("/projects");
        }}
      >
        See All
      </PillButton>
    </section>
  );
}

function ProjectCard({ project, openProject, compact = false, staggerIndex = 0 }) {
  return (
    <a
      className={`project-card ${compact ? "compact" : ""} reveal-on-scroll`}
      style={{ "--stagger-delay": `${staggerIndex * 80}ms` }}
      data-cursor-label="View work"
      href={`/projects/${project.slug}`}
      onClick={(event) => {
        event.preventDefault();
        openProject(project);
      }}
    >
      <div className="project-image">
        <img src={project.heroImage} alt={`${project.title} project`} data-parallax="18" />
      </div>
      <div className="project-row">
        <h3>{project.title}</h3>
        <ArrowUpRight size={20} strokeWidth={1.6} />
      </div>
    </a>
  );
}

function SkillsSection({ experiences = [] }) {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="Skills & Expertise"
        title="The knowledge that powers my designs and empathy"
      />
      <div className="skills-card">
        <img
          className="skills-bg"
          src={asset("skills-bg.png")}
          alt="Design work table"
          data-parallax="14"
        />
        <img
          className="profile-orb"
          src={asset("profile-cutout.png")}
          alt="Tony Lewis MANZI"
          data-parallax="-10"
        />
        <div className="skill-chips">
          {["UX", "UI", "Product", "Research"].map((skill, index) => (
            <span
              key={skill}
              className="reveal-on-scroll"
              style={{ "--stagger-delay": `${index * 80}ms` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="experience-list">
        {experiences.map(({ role, company, period }, index) => (
          <div
            className="experience-row reveal-on-scroll"
            style={{ "--stagger-delay": `${index * 80}ms` }}
            key={`${role}-${company}-${index}`}
          >
            <p>{role}</p>
            <p>{company}</p>
            <p>{period}</p>
          </div>
        ))}
      </div>

      <div className="script-cta">
        <p>Tell Me About Your Next Solution Project</p>
        <PillButton href="https://calendly.com/tonylewismanzi/meet-tony-lewis" target="_blank" rel="noreferrer">
          Get In Touch Today
        </PillButton>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="section process-section">
      <SectionHeader
        eyebrow="Process"
        title="The strategy behind exceptional results"
      />
      <div className="timeline">
        {processSteps.map((step, index) => (
          <article
            className="process-card reveal-on-scroll"
            style={{ "--stagger-delay": `${index * 100}ms` }}
            key={step.title}
          >
            <span className="timeline-dot" />
            <p className="step-label">{step.label}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <span className="step-number">- {String(index + 1).padStart(3, "0")}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="section">
      <SectionHeader eyebrow="Expertise" title="What I'm good at" />
      <div className="service-grid">
        {services.map((service, index) => (
          <article
            className="service-card reveal-on-scroll"
            style={{ "--stagger-delay": `${index * 100}ms` }}
            key={service.title}
          >
            <img src={service.image} alt={service.title} data-parallax="10" />
            <h3>{service.title}</h3>
          </article>
        ))}
      </div>
      <div className="service-tags">
        {["Product Design", "UX Design", "UI Design", "Research", "Communication", "Mobile & Web"].map(
          (tag, index) => (
            <span
              key={tag}
              className="reveal-on-scroll"
              style={{ "--stagger-delay": `${index * 60}ms` }}
            >
              {tag}
            </span>
          ),
        )}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section testimonials-served">
      <div className="served-row">
        <div className="avatar-stack">
          {["user-1.png", "user-2.png", "user-3.jpg", "user-4.jpeg"].map((name) => (
            <img src={asset(name)} alt="client" key={name} />
          ))}
        </div>
        <p>
          <span>Served</span> <strong>418,532 +</strong> users worldwide
        </p>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq-section">
      <SectionHeader eyebrow="FAQ'S" title="Your concerns, addressed with clarity" />
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <article
            className={`faq-item ${open === index ? "is-open" : ""} reveal-on-scroll`}
            style={{ "--stagger-delay": `${index * 80}ms` }}
            key={faq.question}
          >
            <button onClick={() => setOpen(open === index ? -1 : index)}>
              <span>{faq.question}</span>
              <ChevronDown size={18} />
            </button>
            <div className="faq-answer">
              <div className="faq-answer-inner">
                <p>{faq.answer}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="script-cta faq-cta reveal-on-scroll">
        <p>Still have questions? Feel free to get in touch today!</p>
        <PillButton href="https://calendly.com/tonylewismanzi/meet-tony-lewis" target="_blank" rel="noreferrer">
          Get In Touch Today
        </PillButton>
      </div>
    </section>
  );
}

function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section className="section contact-section" id="contact">
      <SectionHeader
        eyebrow="Contact"
        title="Reach out and let's bring your vision to life"
      />
      <form
        className="contact-form reveal-on-scroll"
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
      >
        <label>
          Full Name
          <input name="name" placeholder="John Murinzi" />
        </label>
        <label>
          Email Address
          <input name="email" type="email" placeholder="murinzi@example.com" />
        </label>
        <label className="wide">
          Website (optional)
          <input name="website" placeholder="Company Website" />
        </label>
        <label className="wide">
          Select Budget
          <select name="budget" defaultValue="">
            <option value="" disabled>
              Select...
            </option>
            <option>less than $1000</option>
            <option>$2,000 - $2,000</option>
            <option>$2,000 - $2,000</option>
            <option>$4,000+</option>
          </select>
        </label>
        <label className="wide">
          How may I assist you?
          <textarea name="message" placeholder="Give us more info.." />
        </label>
        <button className="submit-button" type="submit">
          {sent ? "Message Ready" : "Send Your Message"}
        </button>
      </form>
      <div className="book-call">
        <p>Preffer to Book a call ?</p>
        <a
          href="https://calendly.com/tonylewismanzi/meet-tony-lewis"
          target="_blank"
          rel="noreferrer"
        >
          Book a call anytime
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <h2>TONY</h2>
        <p>
          I craft unique product experiences that reflect brand's personality and
          objectives. With a solid background in software engineering, I blend
          innovation with practicality and stay on top of design trends to ensure
          all projects are visually stunning and functionally flawless
        </p>
        <div className="footer-contact">
          <a href="mailto:tonylewismanzi@gmail.com">tonylewismanzi@gmail.com</a>
          <div className="socials">
            <a href="https://www.linkedin.com/in/tonylewismanzi/" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://www.behance.net/tonylewismanzi" aria-label="Behance">
              <FaBehance />
            </a>
            <a href="https://x.com/iintore" aria-label="X">
              <FaXTwitter />
            </a>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Tony Lewis MANZI</p>
          <p>All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

function ProjectsIndex({ caseStudies, navigate, openProject }) {
  return (
    <main>
      <section className="section index-hero">
        <SectionHeader
          eyebrow="My Projects"
          title="The designs that turn vision into a bold reality"
        />
        <PillButton href="https://calendly.com/tonylewismanzi/meet-tony-lewis" target="_blank" rel="noreferrer">
          Get In Touch Today
        </PillButton>
        <div className="project-stack index-stack">
          {caseStudies.map((project) => (
            <ProjectCard
              project={project}
              key={project.id}
              openProject={openProject}
            />
          ))}
        </div>
      </section>
      <ContactSection />
      <Footer />
    </main>
  );
}

function getProjectSections(project) {
  if (!project) return [];
  if (Array.isArray(project.sections)) return project.sections;

  return [
    {
      id: `${project.id}-intro`,
      type: "text",
      kicker: "Introduction",
      title: "Introduction",
      body: project.summary || "",
    },
    {
      id: `${project.id}-hero`,
      type: "image",
      image: project.heroImage || "",
      caption: `${project.title} overview`,
    },
    {
      id: `${project.id}-objective`,
      type: "text",
      kicker: "Objective",
      title: "Objective",
      body: project.objective || "",
    },
    ...(project.gallery || []).map((image, index) => ({
      id: `${project.id}-gallery-${index}`,
      type: "image",
      image,
      caption: `${project.title} case study image ${index + 1}`,
    })),
    {
      id: `${project.id}-closing`,
      type: "text",
      kicker: "Outcome",
      title: "Outcome",
      body: project.closing || "",
    },
  ];
}

function makeStoryBlock(type = "text") {
  const id = `block-${Date.now()}-${Math.round(Math.random() * 1000)}`;
  if (type === "image") {
    return {
      id,
      type: "image",
      image: "/assets/project-strettch.png",
      caption: "Add a short image caption here.",
    };
  }

  return {
    id,
    type: "text",
    kicker: "Story",
    title: "New Section",
    body: "Write the section paragraph here.",
  };
}

function ProjectDrawer({ project, caseStudies, onClose, openProject }) {
  const sections = useMemo(() => getProjectSections(project), [project]);
  const related = project
    ? caseStudies.filter((item) => item.id !== project.id).slice(0, 3)
    : [];

  useEffect(() => {
    if (!project) return undefined;
    document.body.classList.add("drawer-open");
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("drawer-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, project]);

  if (!project) return null;

  return (
    <div className="project-drawer-layer" role="dialog" aria-modal="true">
      <button className="project-drawer-scrim" aria-label="Close project" onClick={onClose} />
      <aside className="project-drawer">
        <div className="drawer-inner">
          <div className="drawer-grip" aria-hidden="true" />
          <button className="drawer-close" aria-label="Close project" onClick={onClose}>
            <X size={19} />
          </button>

          <section className="drawer-hero">
            <div className="case-copy">
              <p className="eyebrow compact-eyebrow">
                <span />
                Case Study
              </p>
              <h1>{project.title}</h1>
              <p>{project.summary}</p>
              <PillButton href={project.previewUrl}>Live Preview</PillButton>
            </div>
            <div className="case-meta">
              <div>
                <span>Company</span>
                <p>{project.client}</p>
              </div>
              <div>
                <span>Role</span>
                <p>{project.services}</p>
              </div>
            </div>
          </section>

          <div className="case-story">
            {sections.map((section) =>
              section.type === "image" ? (
                <figure className="case-drawer-media" key={section.id}>
                  <img
                    src={section.image}
                    alt={section.caption || `${project.title} case study`}
                    data-parallax="8"
                  />
                  {section.caption && <figcaption>{section.caption}</figcaption>}
                </figure>
              ) : (
                <section className="case-story-block" key={section.id}>
                  <span>{section.kicker || "Story"}</span>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </section>
              ),
            )}
          </div>

          <section className="drawer-related">
            <h2>Check out some of my recent projects.</h2>
            <div className="related-grid">
              {related.map((item) => (
                <ProjectCard
                  project={item}
                  key={item.id}
                  openProject={openProject}
                  compact
                />
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

function getDominantColors(img) {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 2, 2);
  const data = ctx.getImageData(0, 0, 2, 2).data;

  const colors = [];
  for (let i = 0; i < 4; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }
  return colors;
}

async function generateMacOsThumbnail(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const colors = getDominantColors(img);

          const canvas = document.createElement("canvas");
          canvas.width = 1200;
          canvas.height = 800;
          const ctx = canvas.getContext("2d");

          // 1. Draw Liquid Mesh Gradient Background
          ctx.fillStyle = colors[0];
          ctx.fillRect(0, 0, 1200, 800);

          const linGrad = ctx.createLinearGradient(0, 0, 1200, 800);
          linGrad.addColorStop(0, colors[1]);
          linGrad.addColorStop(1, colors[2]);
          ctx.globalAlpha = 0.55;
          ctx.fillStyle = linGrad;
          ctx.fillRect(0, 0, 1200, 800);

          const radGrad1 = ctx.createRadialGradient(200, 200, 100, 300, 300, 600);
          radGrad1.addColorStop(0, colors[3]);
          radGrad1.addColorStop(1, "transparent");
          ctx.globalAlpha = 0.65;
          ctx.fillStyle = radGrad1;
          ctx.fillRect(0, 0, 1200, 800);

          const radGrad2 = ctx.createRadialGradient(1000, 600, 100, 900, 500, 500);
          radGrad2.addColorStop(0, colors[1]);
          radGrad2.addColorStop(1, "transparent");
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = radGrad2;
          ctx.fillRect(0, 0, 1200, 800);

          ctx.globalAlpha = 1.0;

          // 2. Draw mock macOS Window
          const drawWidth = 900;
          const drawHeight = Math.min(560, 900 * (img.height / img.width));

          const wx = (1200 - drawWidth) / 2;
          const wy = (800 - drawHeight) / 2;
          const radius = 16;

          // Shadow for window
          ctx.save();
          ctx.shadowColor = "rgba(0, 0, 0, 0.32)";
          ctx.shadowBlur = 44;
          ctx.shadowOffsetY = 22;
          ctx.shadowOffsetX = 0;

          ctx.beginPath();
          ctx.moveTo(wx + radius, wy);
          ctx.lineTo(wx + drawWidth - radius, wy);
          ctx.quadraticCurveTo(wx + drawWidth, wy, wx + drawWidth, wy + radius);
          ctx.lineTo(wx + drawWidth, wy + drawHeight - radius);
          ctx.quadraticCurveTo(wx + drawWidth, wy + drawHeight, wx + drawWidth - radius, wy + drawHeight);
          ctx.lineTo(wx + radius, wy + drawHeight);
          ctx.quadraticCurveTo(wx, wy + drawHeight, wx, wy + drawHeight - radius);
          ctx.lineTo(wx, wy + radius);
          ctx.quadraticCurveTo(wx, wy, wx + radius, wy);
          ctx.closePath();

          ctx.fillStyle = "#ffffff";
          ctx.fill();
          ctx.clip();

          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;

          const sourceHeight = img.width * (drawHeight / drawWidth);
          ctx.drawImage(
            img,
            0,
            0,
            img.width,
            sourceHeight,
            wx,
            wy,
            drawWidth,
            drawHeight
          );
          ctx.restore();

          // Border highlight
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(wx + radius, wy);
          ctx.lineTo(wx + drawWidth - radius, wy);
          ctx.quadraticCurveTo(wx + drawWidth, wy, wx + drawWidth, wy + radius);
          ctx.lineTo(wx + drawWidth, wy + drawHeight - radius);
          ctx.quadraticCurveTo(wx + drawWidth, wy + drawHeight, wx + drawWidth - radius, wy + drawHeight);
          ctx.lineTo(wx + radius, wy + drawHeight);
          ctx.quadraticCurveTo(wx, wy + drawHeight, wx, wy + drawHeight - radius);
          ctx.lineTo(wx, wy + radius);
          ctx.quadraticCurveTo(wx, wy, wx + radius, wy);
          ctx.closePath();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();

          // macOS window control buttons
          if (drawHeight > 80) {
            const drawDot = (cx, cy, color) => {
              ctx.beginPath();
              ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
              ctx.fillStyle = color;
              ctx.fill();
              ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
              ctx.lineWidth = 0.5;
              ctx.stroke();
            };
            drawDot(wx + 22, wy + 22, "#ff5f56"); // Red
            drawDot(wx + 38, wy + 22, "#ffbd2e"); // Yellow
            drawDot(wx + 54, wy + 22, "#27c93f"); // Green
          }

          const resultDataUrl = canvas.toDataURL("image/png");
          resolve(resultDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Unable to load image for canvas."));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("FileReader error."));
    reader.readAsDataURL(file);
  });
}

async function uploadFile(filename, base64Data) {
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, fileData: base64Data }),
  });
  if (!response.ok) {
    throw new Error("Upload failed");
  }
  return await response.json();
}

function CmsPage({ caseStudies, setCaseStudies, experiences = [], setExperiences, navigate, onLogout }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [draft, setDraft] = useState(caseStudies);
  const [selectedId, setSelectedId] = useState(caseStudies[0]?.id || "");
  const [draftExperiences, setDraftExperiences] = useState(experiences);
  const [selectedExpIndex, setSelectedExpIndex] = useState(0);
  const [saveState, setSaveState] = useState("idle");

  useEffect(() => {
    setDraft(caseStudies);
    setSelectedId((current) => current || caseStudies[0]?.id || "");
  }, [caseStudies]);

  useEffect(() => {
    setDraftExperiences(experiences);
    setSelectedExpIndex((current) => (current < experiences.length ? current : 0));
  }, [experiences]);

  const selectedIndex = draft.findIndex((item) => item.id === selectedId);
  const selected = draft[selectedIndex] || draft[0];
  const selectedSections = selected ? getProjectSections(selected) : [];

  const selectedExp = draftExperiences[selectedExpIndex] || draftExperiences[0];

  const updateSelected = (field, value) => {
    if (!selected) return;
    setDraft((items) =>
      items.map((item) =>
        item.id === selected.id
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    );
  };

  const updateSelectedExperience = (field, value) => {
    if (!selectedExp) return;
    setDraftExperiences((items) =>
      items.map((item, index) =>
        index === selectedExpIndex
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    );
  };

  const updateSelectedSections = (nextSections) => {
    updateSelected("sections", nextSections);
  };

  const updateBlock = (index, field, value) => {
    updateSelectedSections(
      selectedSections.map((block, blockIndex) =>
        blockIndex === index ? { ...block, [field]: value } : block,
      ),
    );
  };

  const changeBlockType = (index, type) => {
    const existing = selectedSections[index];
    const next = makeStoryBlock(type);
    updateSelectedSections(
      selectedSections.map((block, blockIndex) =>
        blockIndex === index ? { ...next, id: existing.id } : block,
      ),
    );
  };

  const addBlock = (type) => {
    updateSelectedSections([...selectedSections, makeStoryBlock(type)]);
  };

  const removeBlock = (index) => {
    updateSelectedSections(selectedSections.filter((_, blockIndex) => blockIndex !== index));
  };

  const moveBlock = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= selectedSections.length) return;
    const next = [...selectedSections];
    const [block] = next.splice(index, 1);
    next.splice(nextIndex, 0, block);
    updateSelectedSections(next);
  };

  const addCaseStudy = () => {
    const id = `case-study-${Date.now()}`;
    const next = {
      id,
      slug: id,
      title: "New Case Study",
      summary: "Add the project summary here.",
      client: "Company name",
      services: "Senior UI/UX Designer",
      previewUrl: "https://example.com",
      heroImage: "/assets/project-strettch.png",
      gallery: ["/assets/strettch-detail-1.png"],
      objective: "Describe the case-study objective here.",
      closing: "Add the final case-study note here.",
      sections: [
        makeStoryBlock("text"),
        makeStoryBlock("image"),
      ],
      featured: false,
    };
    setDraft((items) => [...items, next]);
    setSelectedId(id);
  };

  const addExperience = () => {
    const next = {
      role: "New Role",
      company: "New Company",
      period: "2026 - Current",
    };
    setDraftExperiences((items) => [...items, next]);
    setSelectedExpIndex(draftExperiences.length);
  };

  const duplicate = () => {
    if (!selected) return;
    const id = `${selected.slug}-copy-${Date.now()}`;
    const copy = {
      ...selected,
      id,
      slug: id,
      title: `${selected.title} Copy`,
      featured: false,
      sections: getProjectSections(selected).map((block) => ({
        ...block,
        id: `${block.id}-copy-${Date.now()}`,
      })),
    };
    setDraft((items) => [...items, copy]);
    setSelectedId(id);
  };

  const duplicateExperience = () => {
    if (!selectedExp) return;
    const copy = {
      ...selectedExp,
      role: `${selectedExp.role} Copy`,
    };
    setDraftExperiences((items) => [...items, copy]);
    setSelectedExpIndex(draftExperiences.length);
  };

  const remove = () => {
    if (!selected) return;
    const next = draft.filter((item) => item.id !== selected.id);
    setDraft(next);
    setSelectedId(next[0]?.id || "");
  };

  const deleteExperience = () => {
    if (!selectedExp) return;
    const next = draftExperiences.filter((_, index) => index !== selectedExpIndex);
    setDraftExperiences(next);
    setSelectedExpIndex(next.length > 0 ? 0 : 0);
  };

  const save = async () => {
    setSaveState("saving");
    try {
      if (activeTab === "projects") {
        const response = await fetch("/api/case-studies", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (!response.ok) throw new Error("Could not save case studies");
        setCaseStudies(draft);
      } else {
        const response = await fetch("/api/experiences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftExperiences),
        });
        if (!response.ok) throw new Error("Could not save experiences");
        setExperiences(draftExperiences);
      }
      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
    }
  };

  return (
    <main className="cms-shell">
      <aside className="cms-sidebar">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", paddingRight: "10px", marginBottom: "34px" }}>
          <button className="cms-back" onClick={() => navigate("/")}>
            Tony Lewis MANZI
          </button>
          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(23, 23, 23, 0.4)",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              padding: "4px 8px"
            }}
            onMouseOver={(e) => e.target.style.color = "#dc2626"}
            onMouseOut={(e) => e.target.style.color = "rgba(23, 23, 23, 0.4)"}
          >
            Logout
          </button>
        </div>

        <div className="cms-tabs">
          <button
            className={activeTab === "projects" ? "active" : ""}
            onClick={() => {
              setActiveTab("projects");
              setSaveState("idle");
            }}
          >
            Projects
          </button>
          <button
            className={activeTab === "experiences" ? "active" : ""}
            onClick={() => {
              setActiveTab("experiences");
              setSaveState("idle");
            }}
          >
            Experiences
          </button>
        </div>

        {activeTab === "projects" ? (
          <>
            <p>Case Study CMS</p>
            <div className="cms-list">
              {draft.map((item) => (
                <button
                  className={item.id === selected?.id ? "active" : ""}
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <button className="cms-action" onClick={addCaseStudy}>
              <Plus size={16} /> Add Case Study
            </button>
          </>
        ) : (
          <>
            <p>Experiences CMS</p>
            <div className="cms-list">
              {draftExperiences.map((item, index) => (
                <button
                  className={index === selectedExpIndex ? "active" : ""}
                  key={index}
                  onClick={() => setSelectedExpIndex(index)}
                >
                  {item.role || "New Role"}
                </button>
              ))}
            </div>
            <button className="cms-action" onClick={addExperience}>
              <Plus size={16} /> Add Experience
            </button>
          </>
        )}
      </aside>

      <section className="cms-editor">
        <div className="cms-toolbar">
          <div>
            <p>Editing</p>
            {activeTab === "projects" ? (
              <h1>{selected?.title || "No case study selected"}</h1>
            ) : (
              <h1>{selectedExp?.role || "No experience selected"}</h1>
            )}
          </div>
          <div className="cms-toolbar-actions">
            {activeTab === "projects" && (
              <a href="/projects" target="_blank" rel="noreferrer">
                <ExternalLink size={17} /> Preview
              </a>
            )}
            <button
              onClick={activeTab === "projects" ? duplicate : duplicateExperience}
              disabled={activeTab === "projects" ? !selected : !selectedExp}
            >
              <Copy size={17} /> Duplicate
            </button>
            <button
              onClick={activeTab === "projects" ? remove : deleteExperience}
              disabled={activeTab === "projects" ? !selected : !selectedExp}
            >
              <Trash2 size={17} /> Delete
            </button>
            <button className="primary" onClick={save}>
              <Save size={17} /> {saveState === "saving" ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {saveState === "saved" && (
          <p className="cms-status">
            Saved to {activeTab === "projects" ? "content/case-studies.json" : "content/experience.json"}
          </p>
        )}
        {saveState === "error" && (
          <p className="cms-status error">Could not save. Make sure the Node server is running.</p>
        )}

        {activeTab === "projects" ? (
          selected && (
            <div className="cms-grid">
              <CmsInput label="Title" value={selected.title} onChange={(v) => updateSelected("title", v)} />
              <CmsInput label="Slug" value={selected.slug} onChange={(v) => updateSelected("slug", v)} />
              <CmsInput label="Company" value={selected.client} onChange={(v) => updateSelected("client", v)} />
              <CmsInput label="Role" value={selected.services} onChange={(v) => updateSelected("services", v)} />
              <CmsInput label="Preview URL" value={selected.previewUrl} onChange={(v) => updateSelected("previewUrl", v)} />
              <div className="cms-upload-field">
                <label>Hero Image (UI Screenshot to macOS Thumbnail)</label>
                <div className="cms-upload-controls">
                  {selected.heroImage && (
                    <img src={selected.heroImage} alt="Hero thumbnail" className="cms-image-preview" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        const thumbnailBase64 = await generateMacOsThumbnail(file);
                        const cleanName = `project-${selected.id}-${Date.now()}.png`;
                        const res = await uploadFile(cleanName, thumbnailBase64);
                        if (res.ok) {
                          updateSelected("heroImage", res.url);
                        }
                      } catch (err) {
                        alert("Error generating or uploading thumbnail: " + err.message);
                      }
                    }}
                  />
                </div>
              </div>
              <label className="cms-check">
                <input
                  type="checkbox"
                  checked={selected.featured}
                  onChange={(event) => updateSelected("featured", event.target.checked)}
                />
                Show on homepage
              </label>
              <CmsTextarea label="Summary" value={selected.summary} onChange={(v) => updateSelected("summary", v)} />

              <div className="cms-block-builder wide">
                <div className="cms-block-builder-head">
                  <div>
                    <p>Project story feed</p>
                    <h2>Drawer content sections</h2>
                  </div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => addBlock("text")}>
                      <Type size={16} /> Add Text
                    </button>
                    <button type="button" onClick={() => addBlock("image")}>
                      <ImageIcon size={16} /> Add Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to clear all blocks?")) {
                          updateSelectedSections([]);
                        }
                      }}
                      style={{ color: "#dc2626", borderColor: "rgba(220, 38, 38, 0.2)" }}
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset sections to default template? This will replace all current blocks.")) {
                          const template = [
                            {
                              id: `${selected.id}-intro`,
                              type: "text",
                              kicker: "Introduction",
                              title: "Introduction",
                              body: selected.summary || "",
                            },
                            {
                              id: `${selected.id}-hero`,
                              type: "image",
                              image: selected.heroImage || "",
                              caption: `${selected.title} overview`,
                            },
                            {
                              id: `${selected.id}-objective`,
                              type: "text",
                              kicker: "Objective",
                              title: "Objective",
                              body: selected.objective || "",
                            },
                            ...(selected.gallery || []).map((image, index) => ({
                              id: `${selected.id}-gallery-${index}`,
                              type: "image",
                              image,
                              caption: `${selected.title} case study image ${index + 1}`,
                            })),
                            {
                              id: `${selected.id}-closing`,
                              type: "text",
                              kicker: "Outcome",
                              title: "Outcome",
                              body: selected.closing || "",
                            },
                          ];
                          updateSelectedSections(template);
                        }
                      }}
                    >
                      Reset to Template
                    </button>
                  </div>
                </div>
                <div className="cms-block-list">
                  {selectedSections.map((block, index) => (
                    <article className="cms-block" key={block.id}>
                      <div className="cms-block-head">
                        <label>
                          Block Type
                          <select
                            value={block.type}
                            onChange={(event) => changeBlockType(index, event.target.value)}
                          >
                            <option value="text">Text section</option>
                            <option value="image">Image</option>
                          </select>
                        </label>
                        <div className="cms-block-actions">
                          <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0}>
                            Move Up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlock(index, 1)}
                            disabled={index === selectedSections.length - 1}
                          >
                            Move Down
                          </button>
                          <button type="button" onClick={() => removeBlock(index)}>
                            Delete
                          </button>
                        </div>
                      </div>
                      {block.type === "image" ? (
                        <div className="cms-block-grid">
                          <div className="cms-upload-field">
                            <label>Image (UI Screenshot)</label>
                            <div className="cms-upload-controls">
                              {block.image && (
                                <img src={block.image} alt="Block preview" className="cms-image-preview" />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (event) => {
                                  const file = event.target.files?.[0];
                                  if (!file) return;
                                  try {
                                    const reader = new FileReader();
                                    reader.onload = async (e) => {
                                      const rawBase64 = e.target.result;
                                      const extension = file.name.split(".").pop() || "png";
                                      const cleanName = `block-${selected.id}-${index}-${Date.now()}.${extension}`;
                                      const res = await uploadFile(cleanName, rawBase64);
                                      if (res.ok) {
                                        updateBlock(index, "image", res.url);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  } catch (err) {
                                    alert("Error uploading image: " + err.message);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <CmsInput
                            label="Caption"
                            value={block.caption || ""}
                            onChange={(value) => updateBlock(index, "caption", value)}
                          />
                        </div>
                      ) : (
                        <div className="cms-block-grid">
                          <CmsInput
                            label="Kicker"
                            value={block.kicker || ""}
                            onChange={(value) => updateBlock(index, "kicker", value)}
                          />
                          <CmsInput
                            label="Title"
                            value={block.title || ""}
                            onChange={(value) => updateBlock(index, "title", value)}
                          />
                          <CmsTextarea
                            label="Paragraph"
                            value={block.body || ""}
                            onChange={(value) => updateBlock(index, "body", value)}
                          />
                        </div>
                      )}
                    </article>
                  ))}
                </div>
                <div className="cms-block-builder-bottom-actions">
                  <button type="button" onClick={() => addBlock("text")}>
                    <Type size={16} /> Add Text
                  </button>
                  <button type="button" onClick={() => addBlock("image")}>
                    <ImageIcon size={16} /> Add Image
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          selectedExp && (
            <div className="cms-grid">
              <CmsInput
                label="Role / Title"
                value={selectedExp.role}
                onChange={(v) => updateSelectedExperience("role", v)}
              />
              <CmsInput
                label="Company"
                value={selectedExp.company}
                onChange={(v) => updateSelectedExperience("company", v)}
              />
              <CmsInput
                label="Period / Date"
                value={selectedExp.period}
                onChange={(v) => updateSelectedExperience("period", v)}
              />
            </div>
          )
        )}
      </section>
    </main>
  );
}

function CmsInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function CmsTextarea({ label, value, onChange }) {
  return (
    <label className="wide">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function AuthDrawer({ onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("drawer-open");
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("drawer-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "iintore" && password === "Manzit@2002") {
      onLoginSuccess();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="project-drawer-layer" role="dialog" aria-modal="true">
      <button className="project-drawer-scrim" aria-label="Close login" onClick={onClose} />
      <aside className="project-drawer" style={{ maxHeight: "480px", height: "max-content", padding: "60px 24px" }}>
        <div className="drawer-inner" style={{ maxWidth: "420px" }}>
          <div className="drawer-grip" aria-hidden="true" />
          <button className="drawer-close" aria-label="Close login" onClick={onClose}>
            <X size={19} />
          </button>

          <div style={{ marginTop: "10px" }}>
            <h2 style={{ fontSize: "28px", fontFamily: "Times New Roman, serif", fontWeight: 400, textAlign: "center", marginBottom: "8px" }}>
              CMS Authentication
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(23, 23, 23, 0.6)", textAlign: "center", margin: "0 0 28px" }}>
              Enter your credentials to access the portfolio manager.
            </p>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <label>
                Username
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </label>
              <button type="submit" className="login-submit">
                Login
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
}

function NotFoundPage({ navigate }) {
  return (
    <main className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>I don't think i have that</h2>
        <p>
          Glad you're having fun from my portfolio, but I don't have that page. feel free to check out my projects or contact me if you're interested in working together.
        </p>
        <PillButton href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          Back to Home
        </PillButton>
      </div>
    </main>
  );
}


