// Auto-expand the two most recent experience roles so key achievements
// are visible without clicking "Show more"
document.addEventListener("alpine:initialized", () => {
  requestAnimationFrame(() => {
    const showMoreSpans = document.querySelectorAll(
      'span[x-text="expanded ? \'Show less\' : \'Show more\'"]',
    );
    const expanded = new Set<Element>();
    for (const span of showMoreSpans) {
      const btn = span.closest("button");
      const scope = btn?.closest("[x-data]");
      if (btn && scope && !expanded.has(scope)) {
        btn.click();
        expanded.add(scope);
        if (expanded.size >= 2) break;
      }
    }
  });
});
