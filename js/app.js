(() => {
  "use strict";

  const videoRoot = "assets/videos/";
  const imageRoot = "assets/images/";

  const simRgbSamples = [
    ["dataset_sim_rgb_01.mp4", "Sequence 1 · view A", "random"],
    ["dataset_sim_rgb_02.mp4", "Sequence 1 · view B", "random"],
    ["dataset_sim_rgb_03.mp4", "Sequence 1 · view C", "random"],
    ["dataset_sim_rgb_04.mp4", "Sequence 2 · view A", "random"],
    ["dataset_sim_rgb_05.mp4", "Sequence 2 · wrist A", "wrist"],
    ["dataset_sim_rgb_06.mp4", "Sequence 2 · view B", "random"],
    ["dataset_sim_rgb_07.mp4", "Sequence 2 · wrist B", "wrist"],
    ["dataset_sim_rgb_08.mp4", "Sequence 3 · random", "random"],
    ["dataset_sim_rgb_09.mp4", "Sequence 3 · wrist", "wrist"],
    ["dataset_sim_rgb_10.mp4", "Sequence 4 · view A", "random"],
    ["dataset_sim_rgb_11.mp4", "Sequence 4 · wrist A", "wrist"],
    ["dataset_sim_rgb_12.mp4", "Sequence 4 · view B", "random"],
    ["dataset_sim_rgb_13.mp4", "Sequence 4 · wrist B", "wrist"]
  ];

  const fullStateSamples = [
    ["Mug", "Core object"],
    ["Bottle", "Core object"],
    ["Tape roll", "Procedural object"],
    ["Camera", "Semantic object"],
    ["Fruit basket", "MuJoCo object"],
    ["Soda can", "Semantic object"],
    ["Mug", "Core object"],
    ["Fruit", "Semantic object"],
    ["Egg", "Procedural object"]
  ];

  const comparisonSamples = [
    ["results_sim_comparison_08.mp4", "Camera"],
    ["results_sim_comparison_01.mp4", "Jar A"],
    ["results_sim_comparison_10.mp4", "Bottle"],
    ["results_sim_comparison_03.mp4", "Toy figure"],
    ["results_sim_comparison_06.mp4", "Mug"],
    ["results_sim_comparison_02.mp4", "Vase"],
    ["results_sim_comparison_11.mp4", "Box"],
    ["results_sim_comparison_04.mp4", "Jar B"],
    ["results_sim_comparison_09.mp4", "Tape dispenser"],
    ["results_sim_comparison_12.mp4", "Tape measure"],
    ["results_sim_comparison_05.mp4", "Jar C"],
    ["results_sim_comparison_07.mp4", "Wall clock"]
  ];

  const simInferenceLabels = [
    "Ball", "Remote control", "Bowl", "Bottle A", "Camera", "Food item", "Can", "Bottle B",
    "Held-out sample 01", "Held-out sample 02", "Held-out sample 03", "Held-out sample 04",
    "Held-out sample 05", "Held-out sample 06", "Held-out sample 07", "Training sample"
  ];

  const s2rPairs = [
    ["Bimanual interaction", "Bimanual"],
    ["Left-hand interaction", "Left hand"],
    ["Right-hand interaction A", "Right hand"],
    ["Right-hand interaction B", "Right hand"],
    ["Right-hand interaction C", "Right hand"]
  ];

  const s2rInferenceLabels = [
    "Clip · segment 1",
    "Coca-Cola 330 ml · take 3 · segment 1",
    "Coca-Cola 330 ml · take 3 · segment 2",
    "Coca-Cola 330 ml · take 3 · segment 3",
    "Coca-Cola 330 ml · take 6 · segment 1",
    "Coca-Cola 330 ml · take 6 · segment 2",
    "Coca-Cola 500 ml · take 1 · segment 3",
    "Coca-Cola 500 ml · take 5 · segment 1",
    "Coca-Cola 500 ml · take 5 · segment 2",
    "Coca-Cola 500 ml · take 5 · segment 3",
    "Coca-Cola 500 ml · take 6 · segment 1",
    "Coca-Cola 500 ml · take 6 · segment 2",
    "Coca-Cola 500 ml · take 6 · segment 3",
    "Dumbbell · segment 1",
    "Dumbbell · segment 2",
    "Dumbbell · segment 3",
    "Ganten Water 560 ml · segment 1",
    "Ganten Water 560 ml · segment 2",
    "Lays Chips tube · take 1 · segment 1",
    "Lays Chips tube · take 1 · segment 2",
    "Lays Chips tube · take 5 · segment 1",
    "Lays Chips tube · take 5 · segment 2",
    "Nongfu Spring Water 550 ml · segment 1",
    "Nongfu Spring Water 550 ml · segment 2",
    "Nongfu Spring Water 550 ml · segment 3",
    "Spicy cup noodles · segment 1",
    "Spicy cup noodles · segment 2",
    "Tennis ball · segment 1"
  ];

  const inferenceColumns = [
    "RGB frame",
    "Contact GT",
    "Generated contact",
    "Pressure GT",
    "Generated pressure"
  ];

  function makeVideo(filename, label, className = "") {
    const video = document.createElement("video");
    video.className = `lazy-video ${className}`.trim();
    video.controls = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "none";
    video.setAttribute("aria-label", label);

    const source = document.createElement("source");
    source.dataset.src = videoRoot + filename;
    source.type = "video/mp4";
    video.append(source);
    return video;
  }

  function makeVideoShell(video) {
    const shell = document.createElement("div");
    shell.className = "video-shell";
    shell.append(video);
    return shell;
  }

  function makeColumnLabels() {
    const labels = document.createElement("div");
    labels.className = "column-labels";
    labels.setAttribute("aria-label", "Video column labels");
    inferenceColumns.forEach((label) => {
      const span = document.createElement("span");
      span.textContent = label;
      labels.append(span);
    });
    return labels;
  }

  function makeTitle(label, tag = "") {
    const title = document.createElement("div");
    title.className = "media-card-title";
    const name = document.createElement("span");
    name.textContent = label;
    title.append(name);
    if (tag) {
      const small = document.createElement("small");
      small.textContent = tag;
      title.append(small);
    }
    return title;
  }

  function makeMediaCard(filename, label, options = {}) {
    const figure = document.createElement("figure");
    figure.className = "media-card";
    const surface = document.createElement("div");
    surface.className = "media-card-surface";

    if (options.inferenceLabels) {
      surface.append(makeColumnLabels());
    }

    const video = makeVideo(filename, label);
    const shell = makeVideoShell(video);

    if (options.viewType) {
      const chip = document.createElement("span");
      chip.className = `view-chip ${options.viewType === "wrist" ? "wrist" : ""}`.trim();
      chip.textContent = options.viewType === "wrist" ? "Wrist view" : "Random view";
      shell.append(chip);
    }

    surface.append(shell, makeTitle(label, options.tag || ""));
    figure.append(surface);

    if (options.caption) {
      const caption = document.createElement("figcaption");
      caption.innerHTML = options.caption;
      figure.append(caption);
    }
    return figure;
  }

  function renderRgbGallery() {
    const gallery = document.querySelector("#sim-rgb-gallery");
    simRgbSamples.forEach(([filename, label, viewType]) => {
      gallery.append(makeMediaCard(filename, label, { viewType }));
    });
  }

  function renderFullStateGallery() {
    const gallery = document.querySelector("#sim-fullstate-gallery");
    fullStateSamples.forEach(([objectName, sourceType], index) => {
      const number = String(index + 1).padStart(2, "0");
      const card = document.createElement("article");
      card.className = "episode-card";

      const header = document.createElement("div");
      header.className = "episode-header";
      const heading = document.createElement("h4");
      heading.textContent = `Episode ${number} · ${objectName}`;
      const tag = document.createElement("span");
      tag.textContent = sourceType;
      header.append(heading, tag);

      const video = makeVideo(
        `dataset_sim_fullstate_${number}.mp4`,
        `Complete UNISON-Sim episode ${number}: ${objectName}`
      );
      const shell = makeVideoShell(video);

      const timeline = document.createElement("figure");
      timeline.className = "timeline-figure";
      const image = document.createElement("img");
      image.src = `${imageRoot}dataset_sim_timeline_${number}.png`;
      image.alt = `Contact area and total pressure timeline for episode ${number}.`;
      image.loading = "lazy";
      const caption = document.createElement("figcaption");
      caption.textContent = "Episode timeline · contact area and total pressure across the grasp";
      timeline.append(image, caption);
      card.append(header, shell, timeline);
      gallery.append(card);
    });
  }

  function renderComparisonGallery() {
    const gallery = document.querySelector("#sim-comparison-gallery");
    comparisonSamples.forEach(([filename, label]) => {
      gallery.append(makeMediaCard(filename, label, {
        tag: "Contact / pressure"
      }));
    });
  }

  function renderSimInferenceGallery() {
    const gallery = document.querySelector("#sim-inference-gallery");
    simInferenceLabels.forEach((label, index) => {
      const number = String(index + 1).padStart(2, "0");
      gallery.append(makeMediaCard(`results_sim_inference_${number}.mp4`, label, {
        inferenceLabels: true,
        tag: "UNISON-Sim"
      }));
    });
  }

  function renderS2RPairs() {
    const gallery = document.querySelector("#s2r-pair-gallery");
    s2rPairs.forEach(([label, handType], caseIndex) => {
      const caseNumber = String(caseIndex + 1).padStart(2, "0");
      const set = document.createElement("article");
      set.className = "s2r-set";

      const header = document.createElement("div");
      header.className = "s2r-set-header";
      const heading = document.createElement("h4");
      heading.textContent = `Pair ${caseNumber} · ${label}`;
      const tag = document.createElement("span");
      tag.textContent = handType;
      header.append(heading, tag);

      const viewGrid = document.createElement("div");
      viewGrid.className = "s2r-view-grid";
      for (let viewIndex = 1; viewIndex <= 4; viewIndex += 1) {
        const viewNumber = String(viewIndex).padStart(2, "0");
        const item = document.createElement("figure");
        item.className = "s2r-view";
        const shell = makeVideoShell(
          makeVideo(
            `dataset_s2r_pair_${caseNumber}_view_${viewNumber}.mp4`,
            `${label}, synchronized camera view ${viewIndex}`
          )
        );
        const halfLabels = document.createElement("div");
        halfLabels.className = "half-labels";
        halfLabels.innerHTML = "<span>Simulation</span><span>Real</span>";
        shell.append(halfLabels);
        item.append(shell, makeTitle(`View ${viewIndex}`));
        viewGrid.append(item);
      }

      set.append(header, viewGrid);
      gallery.append(set);
    });
  }

  function renderS2RInferenceGallery() {
    const gallery = document.querySelector("#s2r-inference-gallery");
    s2rInferenceLabels.forEach((label, index) => {
      const number = String(index + 1).padStart(2, "0");
      gallery.append(makeMediaCard(`results_s2r_inference_${number}.mp4`, label, {
        inferenceLabels: true,
        tag: "Adapted UNISON",
        caption: "<strong>Pose inset.</strong> The lower-left comparison shows WiLoR on the left and the UNISON reconstruction on the right."
      }));
    });
  }

  function prepareCollapsibleGalleries() {
    document.querySelectorAll(".collapsible-gallery").forEach((gallery) => {
      const visibleCount = Number(gallery.dataset.visibleCount || 0);
      Array.from(gallery.children).forEach((child, index) => {
        if (index >= visibleCount) child.classList.add("is-extra");
      });
    });

    document.querySelectorAll("[data-gallery-target]").forEach((button) => {
      const gallery = document.getElementById(button.dataset.galleryTarget);
      const collapsedText = button.innerHTML;
      const expandedText = 'Show fewer <span aria-hidden="true">↑</span>';
      button.addEventListener("click", () => {
        const isCollapsed = gallery.classList.toggle("is-collapsed");
        button.setAttribute("aria-expanded", String(!isCollapsed));
        button.innerHTML = isCollapsed ? collapsedText : expandedText;
        if (isCollapsed) {
          gallery.querySelectorAll(".is-extra video").forEach((video) => video.pause());
        }
      });
    });
  }

  const motion = {
    paused: false,
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function hydrateVideo(video) {
    if (video.dataset.hydrated === "true") return;
    const source = video.querySelector("source[data-src]");
    if (!source) return;
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
    video.dataset.hydrated = "true";
    video.load();
  }

  function prepareLazyVideo() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          hydrateVideo(video);
          if (!motion.paused && !motion.reduced) {
            const playPromise = video.play();
            if (playPromise) playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "320px 0px", threshold: 0.05 });

    document.querySelectorAll(".lazy-video").forEach((video) => observer.observe(video));

    const toggle = document.querySelector("#motion-toggle");
    if (motion.reduced) {
      motion.paused = true;
      toggle.setAttribute("aria-pressed", "true");
      toggle.innerHTML = '<span aria-hidden="true">▶</span> Enable motion';
    }

    toggle.addEventListener("click", () => {
      motion.paused = !motion.paused;
      toggle.setAttribute("aria-pressed", String(motion.paused));
      toggle.innerHTML = motion.paused
        ? '<span aria-hidden="true">▶</span> Enable motion'
        : '<span aria-hidden="true">Ⅱ</span> Pause motion';

      document.querySelectorAll(".lazy-video").forEach((video) => {
        if (motion.paused) {
          video.pause();
        } else {
          const rect = video.getBoundingClientRect();
          const nearby = rect.bottom > -200 && rect.top < window.innerHeight + 200;
          if (nearby) {
            hydrateVideo(video);
            const playPromise = video.play();
            if (playPromise) playPromise.catch(() => {});
          }
        }
      });
    });
  }

  function prepareReadingProgress() {
    const bar = document.querySelector("#reading-progress-bar");
    let ticking = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function prepareActiveNavigation() {
    const links = Array.from(document.querySelectorAll(".nav-links a"));
    const lookup = new Map(links.map((link) => [link.getAttribute("href").slice(1), link]));
    const sections = Array.from(lookup.keys())
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => link.classList.remove("is-active"));
      const active = lookup.get(visible.target.id);
      if (active) active.classList.add("is-active");
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.25] });

    sections.forEach((section) => observer.observe(section));
  }

  renderRgbGallery();
  renderFullStateGallery();
  renderComparisonGallery();
  renderSimInferenceGallery();
  renderS2RPairs();
  renderS2RInferenceGallery();
  prepareCollapsibleGalleries();
  prepareLazyVideo();
  prepareReadingProgress();
  prepareActiveNavigation();
})();
