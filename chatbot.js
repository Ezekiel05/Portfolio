// Site assistant: a small intent-matching chatbot that runs entirely in the browser.
// No server or API key. Each intent lists keywords; the best-scoring intent answers.
(function () {
  "use strict";

  const LINKEDIN = "https://www.linkedin.com/in/edrian-barandino-57a531215";
  const EMAIL = "edrianbarandino@gmail.com";

  // ---------- knowledge ----------
  // reply: HTML string. chips: follow-up suggestions. go: section to offer a jump to. topic: pre-fills the contact form.
  const INTENTS = [
    {
      id: "greet",
      keys: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "kumusta", "musta", "yo"],
      reply: "Hi there! I can tell you about Edrian's experience, skills, the work he takes on, or how to reach him. What would you like to know?",
      chips: ["What's his experience?", "What can he build for me?", "Is he available?"],
    },
    {
      id: "about",
      keys: ["who is", "who are you", "about him", "about edrian", "yourself", "introduce", "summary", "background", "profile", "edrian"],
      weight: 0.6,
      reply: "Edrian Barandino is a software developer with <strong>6+ years</strong> of experience in .NET Core, Web API development and full-stack web applications. He builds scalable internal systems, optimizes backend services and improves application performance. He's based in Bacoor, Cavite, Philippines.",
      chips: ["What's his experience?", "What's his tech stack?", "How do I contact him?"],
    },
    {
      id: "experience",
      keys: ["experience", "work history", "job", "jobs", "career", "intouchcx", "intouch", "company", "years", "role", "position", "worked"],
      reply: "Edrian has been at <strong>InTouchCX</strong> since June 2018: Junior Software Developer until Sept 2020, and <strong>Intermediate Software Developer</strong> since then. Highlights include leading the move from legacy MVC pages to Vue.js, building an internal Encryption Web API that cut server workload by 30%, migrating Classic ASP apps to ASP.NET, and deploying an IVR system.",
      chips: ["Tell me about the 30% result", "What else has he built?", "What's his tech stack?"],
      go: "#experience",
    },
    {
      id: "encryption",
      keys: ["encryption", "30", "30%", "30 percent", "percent", "server load", "workload", "performance", "optimize", "optimise", "faster", "speed"],
      reply: "Edrian designed and built an internal <strong>Encryption Web API in .NET 5</strong>. Moving that work into one focused service <strong>reduced server workload by 30%</strong> and made processing more efficient.",
      chips: ["Legacy migrations?", "Can he build an API for me?"],
      go: "#work",
    },
    {
      id: "migration",
      keys: ["migrate", "migration", "legacy", "classic asp", "asp", "modernize", "modernise", "modernization", "upgrade", "old system", "rewrite", "vue"],
      reply: "Modernizing legacy systems is a big part of Edrian's work. He migrated applications from <strong>Classic ASP to ASP.NET</strong> and led the move of MVC pages to a <strong>Vue.js</strong> front end, making them easier to maintain with a better user experience. He can do the same for your aging app.",
      chips: ["Start a project", "What's his tech stack?"],
      go: "#work",
    },
    {
      id: "ivr",
      keys: ["ivr", "call", "calls", "routing", "phone system", "call center", "contact center"],
      reply: "Edrian developed and deployed an <strong>IVR system</strong> that routes customer calls automatically and handles call automation.",
      chips: ["What else has he built?", "What's his experience?"],
      go: "#work",
    },
    {
      id: "chatbot",
      keys: ["chatbot", "bot", "ai", "machine learning", "ml", "tensorflow", "nltk", "flask", "nlp", "how do you work", "are you real"],
      reply: "I'm a small assistant running right in your browser. Edrian has built chatbots before, including a <strong>wellness chatbot built from scratch</strong>: he trained its intent-recognition model in Python with NLTK, TensorFlow and TFLearn, served it through Flask, and built a .NET Core API with MS SQL and a Vue.js dashboard to manage its responses.",
      chips: ["What else has he built?", "What's his tech stack?"],
      go: "#experience",
    },
    {
      id: "skills",
      keys: ["skill", "skills", "stack", "tech", "technology", "technologies", "language", "languages", "framework", "frameworks", ".net", "dotnet", "c#", "csharp", "javascript", "sql", "python", "go", "golang", "java", "wpf", "entity framework", "jquery", "css"],
      reply: "Edrian's main stack:<ul><li><strong>Backend:</strong> C#, .NET Core, ASP.NET MVC, Entity Framework</li><li><strong>APIs:</strong> .NET Web API, plus Go, Python, Flask and Java</li><li><strong>Frontend:</strong> JavaScript, Vue.js, jQuery, CSS, WordPress</li><li><strong>Databases:</strong> MS SQL</li><li><strong>Desktop:</strong> WPF</li></ul>",
      chips: ["What can he build for me?", "What's his experience?"],
      go: "#skills",
    },
    {
      id: "services",
      keys: ["service", "services", "build", "freelance", "project", "hire you", "help my business", "business", "website", "web app", "application", "app", "system", "api", "offer", "can you do", "can he do"],
      reply: "Edrian's specialty is moving legacy Classic ASP and ASP.NET apps onto modern .NET and Vue.js. He also:<ul><li>Builds Web APIs that take load off slow backends (one cut server workload by 30%)</li><li>Builds web apps to replace paper or spreadsheet processes</li><li>Migrates Joomla sites to WordPress</li></ul>Describe your project and he'll suggest the simplest fix.",
      chips: ["Start a project", "How much does it cost?", "What's his tech stack?"],
      go: "#help",
      topic: "A freelance project",
    },
    {
      id: "wordpress",
      keys: ["wordpress", "joomla", "cms", "blog"],
      reply: "Yes. Edrian has done freelance <strong>WordPress</strong> work, migrating client websites from <strong>Joomla to WordPress</strong> and rebuilding their pages and content.",
      chips: ["Start a project", "What else can he build?"],
      go: "#help",
      topic: "A freelance project",
    },
    {
      id: "projects",
      keys: ["projects", "portfolio", "github", "personal project", "side project", "qr", "attendance", "expense", "receipt", "mac", "macos", "swift", "examples", "samples", "code"],
      reply: "Beyond his day job, Edrian builds his own software:<ul><li><strong>QR Attendance Pro</strong>: staff sign in by scanning a QR badge, with shift rosters, reports and printable badges (React, Supabase). <a href=\"https://github.com/Ezekiel05/QRAttendancePro\" target=\"_blank\" rel=\"noopener\">View on GitHub</a></li><li>A receipt-scanning expense tracker</li><li>A native macOS app for running Windows programs</li></ul>",
      chips: ["Tell me about the chatbot he built", "What's his experience?"],
      go: "#experience",
    },
    {
      id: "availability",
      keys: ["available", "availability", "open to", "hiring", "hire", "full time", "full-time", "fulltime", "part time", "part-time", "opportunity", "recruit", "recruiter", "vacancy", "position open", "looking for work", "job offer"],
      reply: "Yes! Edrian is <strong>open to full-time roles and freelance projects</strong>. Send him a short message about the role or project and he'll get back to you.",
      chips: ["Discuss a role", "Start a project", "How do I contact him?"],
      go: "#contact",
      topic: "A job opportunity",
    },
    {
      id: "contact",
      keys: ["contact", "email", "e-mail", "phone", "number", "call him", "reach", "message", "linkedin", "get in touch", "talk"],
      reply: `You can reach Edrian at:<ul><li>Email: <a href="mailto:${EMAIL}">${EMAIL}</a></li><li>Phone: <a href="tel:+639081524924">0908 152 4924</a></li><li><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></li></ul>Or use the contact form at the bottom of the page.`,
      chips: ["Open the contact form", "Is he available?"],
      go: "#contact",
    },
    {
      id: "location",
      keys: ["where", "location", "based", "live", "city", "country", "philippines", "cavite", "bacoor", "manila", "remote", "onsite", "on-site", "hybrid", "timezone", "time zone"],
      reply: "Edrian is based in <strong>Bacoor, Cavite, Philippines</strong> (Philippine time, UTC+8). For work setup, whether remote, hybrid or on-site, just mention what you have in mind in your message.",
      chips: ["How do I contact him?", "Is he available?"],
    },
    {
      id: "education",
      keys: ["education", "school", "university", "college", "degree", "study", "studied", "adamson", "graduate", "engineering"],
      reply: "Edrian has a <strong>Bachelor of Science in Computer Engineering</strong> from Adamson University in Malate, Manila (2013 to 2018).",
      chips: ["What's his experience?", "What's his tech stack?"],
      go: "#education",
    },
    {
      id: "rates",
      keys: ["rate", "rates", "price", "pricing", "cost", "costs", "how much", "budget", "fee", "fees", "quote", "salary", "charge"],
      reply: "It depends on the size and scope of the work. Send Edrian a short description of what you need, and he'll reply with questions, a rough approach and an estimate.",
      chips: ["Start a project", "Discuss a role"],
      go: "#contact",
      topic: "A freelance project",
    },
    {
      id: "thanks",
      keys: ["thanks", "thank you", "ty", "salamat", "great", "awesome", "cool", "nice", "ok", "okay", "bye", "goodbye"],
      reply: "You're welcome! If you'd like to work with Edrian, the contact form is at the bottom of the page. Have a great day!",
      chips: ["Open the contact form"],
    },
  ];

  // quick replies that map straight to an action or intent
  const CHIP_ACTIONS = {
    "Start a project": { intent: "services", jump: "#contact", topic: "A freelance project", say: "Great! I've opened the contact form and set it to \"A freelance project\". Tell Edrian what you need." },
    "Discuss a role": { jump: "#contact", topic: "A job opportunity", say: "Great! I've opened the contact form and set it to \"A job opportunity\". Share the role details and Edrian will get back to you." },
    "Open the contact form": { jump: "#contact", say: "Here's the contact form. Edrian usually replies within a day or two." },
  };

  const FALLBACK = {
    reply: "I'm not sure about that one. I can answer questions about Edrian's experience, skills, services, availability and contact details. For anything else, send him a message directly.",
    chips: ["What's his experience?", "What can he build for me?", "How do I contact him?"],
  };

  // ---------- matching ----------
  const norm = (s) => " " + s.toLowerCase().replace(/[^a-z0-9#%+.\s-]/g, " ").replace(/\s+/g, " ").trim() + " ";

  function match(text) {
    const t = norm(text);
    let best = null, bestScore = 0;
    for (const intent of INTENTS) {
      let score = 0;
      for (const k of intent.keys) {
        const key = norm(k);
        if (t.includes(key)) score += key.trim().split(" ").length + (key.length > 6 ? 0.5 : 0);
      }
      // greetings and thanks only win when the message is mostly that
      if ((intent.id === "greet" || intent.id === "thanks") && t.trim().split(" ").length > 4) score *= 0.4;
      score *= intent.weight || 1;
      if (score > bestScore) { best = intent; bestScore = score; }
    }
    return bestScore > 0 ? best : null;
  }

  // ---------- UI ----------
  const root = document.createElement("div");
  root.className = "chat";
  root.innerHTML = `
    <button class="chat-launch" type="button" aria-expanded="false" aria-controls="chat-panel">
      <span class="chat-launch-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"/><circle cx="9" cy="9.5" r="1.1"/><circle cx="12" cy="9.5" r="1.1"/><circle cx="15" cy="9.5" r="1.1"/></svg>
      </span>
      <span class="chat-launch-text">Ask me anything</span>
    </button>
    <section class="chat-panel" id="chat-panel" role="dialog" aria-label="Chat with Edrian's assistant" hidden>
      <header class="chat-head">
        <span class="chat-avatar" aria-hidden="true">EB</span>
        <div class="chat-title"><strong>Edrian's assistant</strong><span>Usually answers instantly</span></div>
        <button class="chat-close" type="button" aria-label="Close chat">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>
      <div class="chat-log" role="log" aria-live="polite"></div>
      <div class="chat-chips" aria-label="Suggested questions"></div>
      <form class="chat-form" autocomplete="off">
        <label class="visually-hidden" for="chat-input">Type your question</label>
        <input id="chat-input" type="text" placeholder="Type your question..." maxlength="300">
        <button type="submit" aria-label="Send">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg>
        </button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const launch = root.querySelector(".chat-launch");
  const panel = root.querySelector(".chat-panel");
  const log = root.querySelector(".chat-log");
  const chips = root.querySelector(".chat-chips");
  const form = root.querySelector(".chat-form");
  const input = root.querySelector("#chat-input");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let started = false;

  function addMsg(html, who) {
    const el = document.createElement("div");
    el.className = `chat-msg chat-${who}`;
    if (who === "user") el.textContent = html; else el.innerHTML = html;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function setChips(list) {
    chips.innerHTML = "";
    (list || []).forEach((label) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chat-chip"; b.textContent = label;
      b.addEventListener("click", () => handle(label));
      chips.appendChild(b);
    });
  }

  function addJump(selector, topic) {
    const target = document.querySelector(selector);
    if (!target) return;
    const a = document.createElement("button");
    a.type = "button"; a.className = "chat-jump";
    const name = (target.querySelector("h2") || {}).textContent || "this section";
    a.textContent = `Show me: ${name}`;
    a.addEventListener("click", () => goTo(selector, topic));
    log.lastElementChild.appendChild(a);
  }

  function goTo(selector, topic) {
    if (topic) { const s = document.getElementById("f-type"); if (s) s.value = topic; }
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (window.matchMedia("(max-width: 600px)").matches) close();
    if (selector === "#contact") setTimeout(() => { const f = document.getElementById("f-name"); if (f) f.focus({ preventScroll: true }); }, reduce ? 0 : 600);
  }

  function botSay(html, chipList, jump, topic) {
    const typing = addMsg('<span class="chat-typing"><i></i><i></i><i></i></span>', "bot");
    setChips([]);
    setTimeout(() => {
      typing.innerHTML = html;
      if (jump) addJump(jump, topic);
      setChips(chipList);
      log.scrollTop = log.scrollHeight;
    }, reduce ? 0 : 450 + Math.min(html.length, 400));
  }

  function handle(text) {
    const q = text.trim();
    if (!q) return;
    addMsg(q, "user");
    const action = CHIP_ACTIONS[q];
    if (action) {
      botSay(action.say, ["Is he available?", "What's his tech stack?"]);
      setTimeout(() => goTo(action.jump, action.topic), reduce ? 0 : 500);
      return;
    }
    const aliases = {
      "What's his experience?": "experience", "What can he build for me?": "services", "What else can he build?": "services",
      "Is he available?": "availability", "What's his tech stack?": "skills", "How do I contact him?": "contact",
      "Tell me about the 30% result": "encryption", "Legacy migrations?": "migration", "Can he build an API for me?": "services",
      "What else has he built?": "projects", "Tell me about the chatbot he built": "chatbot", "How much does it cost?": "rates",
    };
    const intent = aliases[q] ? INTENTS.find((i) => i.id === aliases[q]) : match(q);
    if (intent) botSay(intent.reply, intent.chips, intent.go, intent.topic);
    else botSay(FALLBACK.reply, FALLBACK.chips, "#contact");
  }

  function open() {
    panel.hidden = false;
    root.classList.add("is-open");
    launch.setAttribute("aria-expanded", "true");
    if (!started) {
      started = true;
      botSay("Hi! I'm Edrian's assistant. Ask me about his experience, skills, the work he takes on, or how to reach him.",
        ["What's his experience?", "What can he build for me?", "Is he available?", "How do I contact him?"]);
    }
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    root.classList.remove("is-open");
    launch.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    launch.focus({ preventScroll: true });
  }

  launch.addEventListener("click", () => (panel.hidden ? open() : close()));
  root.querySelector(".chat-close").addEventListener("click", close);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) close(); });
  form.addEventListener("submit", (e) => { e.preventDefault(); const v = input.value; input.value = ""; handle(v); });
})();
