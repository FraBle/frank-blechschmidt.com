declare const umami: { track: (name: string, data?: Record<string, string>) => void } | undefined;

function trackEvent(name: string, data?: Record<string, string>) {
  if (typeof umami !== "undefined") umami.track(name, data);
}

// Track theme switches
document.querySelectorAll<HTMLButtonElement>('[role="radiogroup"] button[role="radio"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.getAttribute("title")?.replace(" theme", "").toLowerCase();
    if (theme) trackEvent("theme_switched", { theme });
  });
});

// Track email copy
document.querySelector<HTMLButtonElement>('[x-data*="copyToClipboard"] button')?.addEventListener("click", () => {
  trackEvent("email_copied");
});

// Track outbound links
document.querySelectorAll<HTMLAnchorElement>("a[href^='http']").forEach((link) => {
  if (link.hostname !== window.location.hostname) {
    link.addEventListener("click", () => {
      trackEvent("outbound_link_clicked", { url: link.href });
    });
  }
});

// Track command palette opens
document.querySelectorAll(".footer-button").forEach((btn) => {
  btn.addEventListener("click", () => trackEvent("command_palette_opened"));
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    trackEvent("command_palette_opened");
  }
});
