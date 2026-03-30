// Auto-expand the two most recent experience roles so key achievements
// are visible without clicking "Show more"
document.addEventListener("alpine:initialized", () => {
  requestAnimationFrame(() => {
    const selector = 'button:has(> span[x-text="expanded ? \'Show less\' : \'Show more\'"])';
    const buttons = document.querySelectorAll(selector);
    const expanded = new Set();
    for (const btn of buttons) {
      const scope = btn.closest("[x-data]");
      if (scope && !expanded.has(scope)) {
        btn.click();
        expanded.add(scope);
        if (expanded.size >= 2) break;
      }
    }
  });
});
