/* RunBalPhoto: a small hash-routed single-page portfolio.
 * Routes:  #/              home
 *          #/work          all projects
 *          #/work/<slug>   project viewer (#/work/<slug>/<n> opens photo n)
 *          #/info          about + contact
 * Content comes from content/site.js (window.SITE).
 */
(() => {
  "use strict";

  const SITE = window.SITE || { projects: [], categories: [], bio: [], contact: [] };
  const root = document.documentElement;
  const view = document.getElementById("view");
  const label = document.querySelector(".cursor-label");
  const announcer = document.getElementById("announcer");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

  const THEME = { home: "light", work: "light", info: "dark", project: "black" };
  const THEME_COLOR = { light: "#ffffff", dark: "#0d0c0b", black: "#000000" };

  // ------------------------------------------------------------- content
  const projects = (SITE.projects || []).map((p) => {
    const images = (p.images || []).map((entry, i, all) => {
      const img = typeof entry === "string" ? { src: entry } : { ...entry };
      if (!img.src.includes("/")) img.src = `images/${p.slug}/${img.src}`;
      if (!img.alt) img.alt = `${p.title}, photo ${i + 1} of ${all.length}`;
      return img;
    });
    return { ...p, images };
  }).filter((p) => p.slug && p.images.length);

  const findProject = (slug) => projects.find((p) => p.slug === slug);

  // -------------------------------------------------------------- helpers
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;
      if (key === "class") el.className = value;
      else if (key === "style") el.style.cssText = value;
      else if (key.startsWith("on")) el.addEventListener(key.slice(2), value);
      else el.setAttribute(key, value === true ? "" : value);
    }
    for (const child of children.flat(Infinity)) {
      if (child == null || child === false) continue;
      el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  }

  // Remember each photo's size once loaded, so revisited pages keep their layout
  // (and the work page can restore its scroll position).
  const knownSizes = new Map();

  function photo(image, { eager = false, wrap = true, className = "" } = {}) {
    const size = knownSizes.get(image.src) || (image.width && image.height ? [image.width, image.height] : null);
    const img = h("img", {
      src: image.src,
      alt: image.alt || "",
      class: className || null,
      width: size ? size[0] : null,
      height: size ? size[1] : null,
      loading: eager ? "eager" : "lazy",
      decoding: "async",
      draggable: "false",
    });
    const done = () => {
      if (img.naturalWidth) knownSizes.set(image.src, [img.naturalWidth, img.naturalHeight]);
      img.classList.add("is-loaded");
    };
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", () => img.classList.add("is-loaded"), { once: true });
    }
    return wrap ? h("span", { class: "photo", style: "display:block" }, img) : img;
  }

  const preload = (src) => { const i = new Image(); i.decoding = "async"; i.src = src; };
  const announce = (text) => { announcer.textContent = text; };

  // ---------------------------------------------------------- cursor label
  let labelTarget = null;

  function hideLabel() {
    labelTarget = null;
    label.classList.remove("is-visible");
  }

  document.addEventListener("mousemove", (e) => {
    if (!finePointer.matches) return;
    const target = e.target instanceof Element ? e.target.closest("[data-label]") : null;
    if (!target) { if (labelTarget) hideLabel(); return; }
    if (target !== labelTarget || label.textContent !== target.dataset.label) {
      labelTarget = target;
      label.textContent = target.dataset.label;
    }
    const pad = 14;
    const w = label.offsetWidth, ht = label.offsetHeight;
    let x = e.clientX + pad, y = e.clientY + pad;
    if (x + w > innerWidth - 4) x = e.clientX - pad - w;
    if (y + ht > innerHeight - 4) y = e.clientY - pad - ht;
    label.style.transform = `translate(${x}px, ${y}px)`;
    label.classList.add("is-visible");
  }, { passive: true });

  document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) hideLabel(); });

  // ----------------------------------------------------------------- views
  function homeView() {
    const featured = projects.filter((p) => p.featured).slice(0, 12);
    const list = featured.length ? featured : projects.slice(0, 10);

    const strip = h("ul", { class: "strip" },
      list.map((p, i) => h("li", { class: "strip-item", style: `--i:${i}` },
        h("a", { href: `#/work/${p.slug}`, "data-label": p.title, "aria-label": p.title },
          photo(p.images[0])))));

    const carousel = h("div", { class: "carousel" },
      list.map((p, i) => h("a", { class: "carousel-item", href: `#/work/${p.slug}`, style: `--i:${i}` },
        h("span", { class: "carousel-title" }, p.title),
        photo(p.images[0], { wrap: false }))));

    // Mouse users: vertical wheel scrolls sideways, click-and-drag scrolls too.
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        carousel.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    carousel.addEventListener("wheel", onWheel, { passive: false });

    let drag = null;
    carousel.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: carousel.scrollLeft, moved: false };
    });
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
    function onDragMove(e) {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; carousel.classList.add("is-dragging"); }
      if (drag.moved) carousel.scrollLeft = drag.left - dx;
    }
    function onDragEnd() {
      if (drag && drag.moved) {
        // let the click that follows a drag fall through harmlessly
        requestAnimationFrame(() => carousel.classList.remove("is-dragging"));
      }
      drag = null;
    }

    return {
      el: h("section", { class: "home", "aria-label": "Featured work" }, strip, carousel),
      destroy() {
        window.removeEventListener("pointermove", onDragMove);
        window.removeEventListener("pointerup", onDragEnd);
      },
    };
  }

  let workFilter = "All";

  function workView() {
    const used = new Set(projects.map((p) => p.category));
    const categories = ["All", ...(SITE.categories || []).filter((c) => used.has(c))];
    for (const c of used) if (c && !categories.includes(c)) categories.push(c);
    if (!categories.includes(workFilter)) workFilter = "All";

    const buttons = categories.map((c) => h("button", {
      type: "button",
      class: "filter",
      "aria-pressed": String(c === workFilter),
      onclick: () => setFilter(c),
    }, c));

    const items = projects.map((p, i) => h("li", { class: "grid-item", "data-category": p.category || "", style: `--i:${i % 6}` },
      h("a", { href: `#/work/${p.slug}`, "data-label": p.title },
        photo(p.images[0]),
        h("span", { class: "grid-caption" },
          h("span", null, p.title),
          p.category ? h("span", { class: "muted" }, p.category) : null))));

    function setFilter(c) {
      workFilter = c;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === c)));
      let n = 0;
      items.forEach((li) => {
        const show = c === "All" || li.dataset.category === c;
        li.hidden = !show;
        if (show) {
          li.style.setProperty("--i", String(n++ % 6));
          // restart the entrance animation
          li.style.animation = "none";
          void li.offsetWidth;
          li.style.animation = "";
        }
      });
      announce(`${n} project${n === 1 ? "" : "s"} shown`);
    }
    setFilter(workFilter);

    return {
      el: h("section", { class: "work" },
        h("h2", { class: "sr-only" }, "Work"),
        categories.length > 2 ? h("div", { class: "filters", role: "group", "aria-label": "Filter by category" }, buttons) : null,
        h("ul", { class: "grid" }, items)),
    };
  }

  function infoView() {
    const external = (href) => /^https?:/i.test(href);
    return {
      el: h("section", { class: "info" },
        h("h2", { class: "sr-only" }, "Info"),
        h("div", { class: "info-text" }, (SITE.bio || []).map((t) => h("p", null, t))),
        SITE.portrait ? h("figure", { class: "info-portrait" }, photo({ src: SITE.portrait, alt: SITE.portraitAlt || "Portrait of the photographer" }, { eager: true })) : null,
        h("ul", { class: "info-contact" }, (SITE.contact || []).map((c) =>
          h("li", null, h("a", { href: c.href, target: external(c.href) ? "_blank" : null, rel: external(c.href) ? "noopener" : null }, c.label)))),
        SITE.motto ? h("p", { class: "info-motto" }, SITE.motto) : null),
    };
  }

  function projectView(route) {
    const p = findProject(route.slug);
    if (!p) return null;
    const n = p.images.length;
    let index = Math.min(Math.max(route.index, 0), n - 1);
    const wrap = (i) => (i + n) % n;

    const main = h("div", { class: "stage-main", "data-label": "Next" });
    const side = (dir) => h("button", {
      type: "button",
      class: `side side-${dir}`,
      "aria-label": dir === "prev" ? "Previous photo" : "Next photo",
      onclick: () => go(index + (dir === "prev" ? -1 : 1)),
    });
    const prevSide = side("prev");
    const nextSide = side("next");

    const dots = n > 1 && n <= 15
      ? p.images.map((_, i) => h("button", { type: "button", class: "dot", "aria-label": `Photo ${i + 1}`, onclick: () => go(i) }))
      : [];
    const counter = h("span", { class: "counter" });

    let description = null, descButton = null;
    if (p.description) {
      description = h("p", { class: "description", id: "project-description", hidden: true }, p.description);
      descButton = h("button", {
        type: "button",
        class: "bar-cell",
        "aria-expanded": "false",
        "aria-controls": "project-description",
        onclick: () => {
          const open = description.hidden;
          description.hidden = !open;
          descButton.setAttribute("aria-expanded", String(open));
        },
      }, "Description");
    }

    const meta = [p.category, p.year].filter(Boolean).join(" · ");
    const el = h("section", { class: "project", "aria-label": p.title },
      h("div", { class: "project-bar" },
        h("h2", { class: "bar-cell bar-title" }, p.title),
        meta ? h("span", { class: "bar-cell bar-meta" }, meta) : null,
        h("span", { class: "bar-spacer" }),
        descButton,
        h("a", { class: "bar-cell", href: "#/work" }, "Close")),
      h("div", { class: "stage" }, n > 1 ? prevSide : h("span", { class: "side" }), main, n > 1 ? nextSide : h("span", { class: "side" }), description),
      h("div", { class: "project-foot" },
        h("button", { type: "button", class: "foot-btn", onclick: () => go(index - 1), disabled: n < 2 }, "Previous"),
        dots.length ? h("div", { class: "dots" }, dots) : counter,
        h("button", { type: "button", class: "foot-btn", onclick: () => go(index + 1), disabled: n < 2 }, "Next")));

    function render() {
      main.replaceChildren(photo(p.images[index], { eager: true, wrap: false }));
      if (n > 1) {
        prevSide.replaceChildren(photo(p.images[wrap(index - 1)], { eager: true }));
        nextSide.replaceChildren(photo(p.images[wrap(index + 1)], { eager: true }));
        preload(p.images[wrap(index + 2)].src);
      }
      dots.forEach((d, i) => d.setAttribute("aria-current", String(i === index)));
      counter.textContent = `${index + 1} / ${n}`;
      document.title = `${p.title} (${index + 1}/${n}) | RunBalPhoto`;
    }

    function go(i) {
      if (n < 2) return;
      index = wrap(i);
      // Keep the URL shareable without adding a history entry per photo.
      history.replaceState(null, "", `#/work/${p.slug}/${index + 1}`);
      render();
      announce(`Photo ${index + 1} of ${n}`);
    }

    // click left half = previous, right half = next
    main.addEventListener("mousemove", (e) => {
      const r = main.getBoundingClientRect();
      main.dataset.label = e.clientX < r.left + r.width / 2 ? "Previous" : "Next";
    });
    main.addEventListener("click", (e) => {
      const r = main.getBoundingClientRect();
      go(index + (e.clientX < r.left + r.width / 2 ? -1 : 1));
    });

    // swipe on touch screens
    let touch = null;
    main.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") touch = { x: e.clientX, y: e.clientY }; });
    main.addEventListener("pointerup", (e) => {
      if (!touch) return;
      const dx = e.clientX - touch.x, dy = e.clientY - touch.y;
      touch = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
        go(index + (dx < 0 ? 1 : -1));
      }
    });

    function onKey(e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "Escape") location.hash = "#/work";
    }

    render();
    return {
      el,
      mount() { document.addEventListener("keydown", onKey); },
      destroy() { document.removeEventListener("keydown", onKey); },
      update(route2) { index = Math.min(Math.max(route2.index, 0), n - 1); render(); },
    };
  }

  const views = { home: homeView, work: workView, info: infoView, project: projectView };
  const titles = { home: "RunBalPhoto", work: "Work | RunBalPhoto", info: "Info | RunBalPhoto" };

  // ---------------------------------------------------------------- router
  function parseRoute() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    if (parts[0] === "work" && parts[1]) {
      return { name: "project", slug: parts[1], index: (parseInt(parts[2], 10) || 1) - 1 };
    }
    if (parts[0] === "work") return { name: "work" };
    if (parts[0] === "info") return { name: "info" };
    return { name: "home" };
  }

  let mounted = null;
  let pending = 0;
  let workScroll = 0;
  let firstRender = true;

  function navigate() {
    const route = parseRoute();

    // Same project, different photo (e.g. the hash was edited): just switch photo.
    if (mounted && mounted.route.name === "project" && route.name === "project" && mounted.route.slug === route.slug) {
      mounted.route = route;
      mounted.update(route);
      return;
    }

    const next = views[route.name](route);
    if (!next) { location.replace("#/work"); return; } // unknown project

    const from = mounted ? mounted.route.name : null;
    if (from === "work") workScroll = window.scrollY;

    root.dataset.route = route.name;
    root.dataset.theme = THEME[route.name];
    themeMeta.setAttribute("content", THEME_COLOR[THEME[route.name]]);
    if (titles[route.name]) document.title = titles[route.name];
    document.querySelectorAll(".nav-link").forEach((a) => a.removeAttribute("aria-current"));
    const active = route.name === "info" ? ".nav-info" : (route.name === "work" || route.name === "project") ? ".nav-work" : null;
    if (active) document.querySelector(active).setAttribute("aria-current", "page");
    hideLabel();

    const token = ++pending;
    const swap = () => {
      if (token !== pending) return;
      if (mounted && mounted.destroy) mounted.destroy();
      view.replaceChildren(next.el);
      next.route = route;
      mounted = next;
      if (next.mount) next.mount();
      view.classList.remove("is-leaving");
      window.scrollTo(0, route.name === "work" && from === "project" ? workScroll : 0);
      if (!firstRender) view.focus({ preventScroll: true });
      firstRender = false;
    };

    if (!mounted || reduceMotion.matches) swap();
    else {
      view.classList.add("is-leaving");
      setTimeout(swap, 200);
    }
  }

  // ------------------------------------------------------------------ boot
  document.getElementById("tagline").textContent = SITE.tagline || "";

  document.querySelector(".skip-link").addEventListener("click", (e) => {
    e.preventDefault();
    view.focus();
  });

  if (!reduceMotion.matches) {
    root.classList.add("is-intro");
    setTimeout(() => root.classList.remove("is-intro"), 3200);
  }

  window.addEventListener("hashchange", navigate);
  navigate();
})();
