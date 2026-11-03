// Mobile navigation
const toggle = document.querySelector(".nav-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav a").forEach((a) =>
    a.addEventListener("click", () => document.body.classList.remove("nav-open"))
  );
}

// Fade sections in as they scroll into view
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in"));
}

// Contact form (sends through Formspree without leaving the page)
const form = document.querySelector("form[data-ajax-form]");
if (form) {
  const topic = new URLSearchParams(location.search).get("topic");
  if (topic && form.topic.querySelector(`option[value="${topic}"]`)) form.topic.value = topic;

  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.className = "form-status";
    status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.errors?.map((x) => x.message).join(", "));
      form.reset();
      status.classList.add("ok");
      status.textContent = "Thank you! Your message is on its way to our phones. We'll be in touch soon.";
    } catch {
      status.classList.add("err");
      status.textContent = "Hmm, that didn't send. Please try again in a moment.";
    } finally {
      btn.disabled = false;
    }
  });
}

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
