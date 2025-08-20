/* ========== أدوات مساعدة عامة ========== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const setText = (el, val) => el && (el.textContent = val);

/* التاريخ اليوم */
(() => {
  const d = new Date();
  setText(
    $("#today"),
    d.toLocaleString(document.documentElement.lang, { dateStyle: "full" })
  );
  setText($("#year"), d.getFullYear());
})();

/* تنقل الجوال */
(() => {
  const btn = $("#navToggle"),
    list = $("#navList");
  btn?.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });
})();

/* شريط الإعلانات (يتكرر بسلاسة) */
(() => {
  const t = $("#ticker");
  if (!t) return;
  // نضاعف العناصر لتحقيق شريط مستمر
  t.innerHTML = t.innerHTML + t.innerHTML + t.innerHTML;
})();

/* تبديل الوضع (داكن/فاتح) + تباين عالٍ + تقليل الحركة */
(() => {
  const themeBtn = $("#themeToggle");
  const contrastBtn = $("#contrastToggle");
  const reduce = $("#reduceMotion");

  // تفضيلات المستخدم
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
    .matches;
  const savedTheme = localStorage.getItem("theme"); // "light" | "dark"
  const root = document.documentElement;

  function applyTheme(mode) {
    if (mode === "light") root.classList.add("light");
    else root.classList.remove("light");
    document.body.classList.toggle("theme-light", mode === "light");
    document.body.classList.toggle("theme-dark", mode !== "light");
    localStorage.setItem("theme", mode);
    themeBtn.textContent = mode === "light" ? "🌙" : "☀️";
  }
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeBtn?.addEventListener("click", () => {
    const mode = root.classList.contains("light") ? "dark" : "light";
    applyTheme(mode);
  });

  contrastBtn?.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");
    const on = document.body.classList.contains("high-contrast");
    contrastBtn.setAttribute("aria-pressed", String(on));
  });

  reduce?.addEventListener("change", (e) => {
    document.body.style.setProperty(
      "animation",
      e.target.checked ? "none" : ""
    );
  });
})();

/* تعدد اللغات (عربي/English) + اتجاه الصفحة */
(() => {
  const dict = {
    ar: {
      schoolName: "مدرسة الصف الثانوية المشتركة",
      "nav.home": "الرئيسية",
      "nav.about": "من نحن",
      "nav.programs": "البرامج",
      "nav.news": "الأخبار",
      "nav.calendar": "التقويم",
      "nav.staff": "الهيئة",
      "nav.admissions": "القبول",
      "nav.contact": "اتصل بنا",
      "hero.title": "نُعدّ قادة الغد بتعليم عالمي وتجربة إنسانية ثرية.",
      "hero.sub":
        "مناهج حديثة، أنشطة دولية، ومجتمع متنوع يدعم طلابنا للتميّز محليًا وعالميًا.",
      "cta.apply": "قدِّم الآن",
      "cta.explore": "استكشف البرامج",
      "about.title": "من نحن",
      "about.body":
        "مدرسة ثانوية مختلطة تقدّم برامج وطنية ودولية (STEM، Cambridge، IB-Style) مع تركيز على القيم والتميز الأكاديمي والأنشطة العالمية.",
      "programs.title": "البرامج الأكاديمية",
      "filter.all": "الكل",
      "filter.hum": "العلوم الإنسانية",
      "filter.sports": "الرياضة",
      "news.title": "الأخبار والإعلانات",
      "calendar.title": "التقويم المدرسي",
      "calendar.note":
        "هذا التقويم يُسحب تلقائيًا من Google Calendar. استبدل رابط iframe برابط تقويم المدرسة العام.",
      "staff.title": "الهيئة التعليمية والإدارية",
      "adm.title": "القبول والتسجيل",
      "adm.body": "املأ النموذج وسنتواصل معك خلال 48 ساعة.",
      "adm.submit": "إرسال الطلب",
      "adm.privacy": "لن نشارك بياناتك مع أطراف ثالثة.",
      "testi.title": "ماذا يقول مجتمعنا",
      "gallery.title": "معرض الأنشطة",
      "faq.title": "الأسئلة الشائعة",
      "contact.title": "اتصل بنا",
      "contact.send": "إرسال",
      "contact.map": "موقعنا",
      "contact.note": "هذا النموذج تجريبي (بدون خادم). سنعرض رسالة تأكيد فورية."
    },
    en: {
      schoolName: "Al-Saf Co-Ed Secondary School",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.programs": "Programs",
      "nav.news": "News",
      "nav.calendar": "Calendar",
      "nav.staff": "Staff",
      "nav.admissions": "Admissions",
      "nav.contact": "Contact",
      "hero.title":
        "We prepare tomorrow’s leaders with global education and rich human experience.",
      "hero.sub":
        "Modern curricula, international activities, and a diverse community empowering students to excel locally and globally.",
      "cta.apply": "Apply Now",
      "cta.explore": "Explore Programs",
      "about.title": "About Us",
      "about.body":
        "A co-educational secondary school offering national & international tracks (STEM, Cambridge, IB-Style) with values and academic excellence.",
      "programs.title": "Academic Programs",
      "filter.all": "All",
      "filter.hum": "Humanities",
      "filter.sports": "Sports",
      "news.title": "News & Announcements",
      "calendar.title": "School Calendar",
      "calendar.note":
        "This calendar is embedded from Google Calendar. Replace the iframe src with your public school calendar.",
      "staff.title": "Faculty & Administration",
      "adm.title": "Admissions",
      "adm.body": "Fill the form and we’ll get back within 48 hours.",
      "adm.submit": "Submit Application",
      "adm.privacy": "We don’t share your data with third parties.",
      "testi.title": "What Our Community Says",
      "gallery.title": "Activities Gallery",
      "faq.title": "FAQs",
      "contact.title": "Contact Us",
      "contact.send": "Send",
      "contact.map": "Our Location",
      "contact.note": "This form is demo-only (no backend)."
    }
  };

  const btn = $("#langToggle");
  let lang = localStorage.getItem("lang") || "ar";

  function applyLang(l) {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[l][key]) setText(el, dict[l][key]);
    });
    btn.textContent = l === "ar" ? "EN" : "ع";
    localStorage.setItem("lang", l);
  }
  applyLang(lang);
  btn?.addEventListener("click", () => {
    lang = lang === "ar" ? "en" : "ar";
    applyLang(lang);
  });
})();

/* سلايدر بسيط للـ HERO (دون إطارات متحركة ثقيلة) */
(() => {
  const container = $("#slides");
  if (!container) return;
  let i = 0;
  setInterval(() => {
    const imgs = $$("img", container);
    imgs.forEach((im, idx) => (im.style.opacity = idx === i ? "1" : ".0"));
    i = (i + 1) % imgs.length;
  }, 4500);
})();

/* فلترة البرامج */
(() => {
  const filters = $$(".filter");
  const cards = $$(".program");
  filters.forEach((f) =>
    f.addEventListener("click", () => {
      filters.forEach((x) => x.classList.remove("active"));
      f.classList.add("active");
      const tag = f.dataset.filter;
      cards.forEach(
        (c) =>
          (c.style.display =
            tag === "all" || c.dataset.tags.includes(tag) ? "" : "none")
      );
    })
  );
})();

/* بحث فوري داخل الصفحة (البرامج + الأخبار + الهيئة) */
(() => {
  const form = $("#siteSearch");
  const box = $("#searchResults");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("#q").value.trim().toLowerCase();
    if (!q) {
      box.hidden = true;
      return;
    }
    const pools = [
      "#programCards .card",
      "#newsCards .card",
      ".staff-grid .staff"
    ];
    const items = pools.flatMap((sel) => $$(sel));
    const hits = items
      .filter((el) => el.textContent.toLowerCase().includes(q))
      .slice(0, 8);
    if (!hits.length) {
      box.innerHTML = "<div>لا نتائج</div>";
      box.hidden = false;
      return;
    }
    box.innerHTML = hits
      .map(
        (h) =>
          `<div class="tiny"><strong>•</strong> ${
            h.querySelector("h3")?.textContent || h.textContent.slice(0, 80)
          }</div>`
      )
      .join("");
    box.hidden = false;
  });
})();

/* نماذج بدون خادم */
function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText =
    "position:fixed; inset-inline:0; bottom:20px; margin:auto; width:max-content; background:#151922; color:#e9edf3; border:1px solid #263045; padding:10px 14px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.35); z-index:50";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}
$("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  toast("تم إرسال رسالتك ✅");
  e.target.reset();
});
$("#applyForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  toast("تم إرسال طلب القبول ✅");
  e.target.reset();
});

/* كاروسيل شهادات بسيط */
(() => {
  const el = $("#testi");
  if (!el) return;
  let i = 0;
  setInterval(() => {
    const q = $$("blockquote", el);
    q.forEach((b, idx) => (b.style.display = idx === i ? "block" : "none"));
    i = (i + 1) % q.length;
  }, 4000);
})();