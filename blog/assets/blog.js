const BLOG_CONFIG = {
  manifestPath: "./articles/manifest.json",
  articleBasePath: "./articles/",
  siteUrl: "https://sessio.fr",
};

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function formatDateFr(dateString) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

function readingTime(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min de lecture`;
}

function slugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function articleUrl(article) {
  return `/blog/article.html?slug=${encodeURIComponent(article.slug)}`;
}

async function fetchManifest() {
  const response = await fetch(`${BLOG_CONFIG.manifestPath}?v=${Date.now()}`);
  if (!response.ok) throw new Error("Impossible de charger articles/manifest.json");
  const manifest = await response.json();
  return [...manifest.articles].sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function fetchMarkdown(article) {
  const response = await fetch(`${BLOG_CONFIG.articleBasePath}${article.file}?v=${Date.now()}`);
  if (!response.ok) throw new Error(`Impossible de charger l'article ${article.file}`);
  return response.text();
}

function inlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let quote = [];

  const closeParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!list) return;
    html.push(`<${list.type}>${list.items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${list.type}>`);
    list = null;
  };

  const closeQuote = () => {
    if (!quote.length) return;
    html.push(`<blockquote>${quote.map((line) => `<p>${inlineMarkdown(line)}</p>`).join("")}</blockquote>`);
    quote = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeParagraph();
      closeList();
      closeQuote();
      continue;
    }

    if (line.startsWith("> ")) {
      closeParagraph();
      closeList();
      quote.push(line.slice(2));
      continue;
    }

    if (line.startsWith("### ")) {
      closeParagraph();
      closeList();
      closeQuote();
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      closeParagraph();
      closeList();
      closeQuote();
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      closeParagraph();
      closeQuote();
      if (!list || list.type !== "ul") list = { type: "ul", items: [] };
      list.items.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      closeParagraph();
      closeQuote();
      if (!list || list.type !== "ol") list = { type: "ol", items: [] };
      list.items.push(line.replace(/^\d+\.\s+/, ""));
      continue;
    }

    paragraph.push(line);
  }

  closeParagraph();
  closeList();
  closeQuote();

  return html.join("\n");
}

function renderTags(tags = []) {
  return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
}

async function renderIndex() {
  const grid = $("#articlesGrid");
  if (!grid) return;

  const empty = $("#emptyState");
  const input = $("#searchInput");

  try {
    const articles = await fetchManifest();

    const render = (items) => {
      grid.innerHTML = items.map((article) => `
        <a class="article-card" href="${articleUrl(article)}">
          <div class="tag-row">${renderTags(article.tags)}</div>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.excerpt)}</p>
          <div class="card-meta">
            <span>${formatDateFr(article.date)}</span>
            <span aria-hidden="true">·</span>
            <span>${escapeHtml(article.readingTime || "Article")}</span>
          </div>
        </a>
      `).join("");

      if (empty) empty.hidden = items.length > 0;
    };

    render(articles);

    input?.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      const filtered = articles.filter((article) => {
        const searchable = [
          article.title,
          article.excerpt,
          ...(article.tags || []),
        ].join(" ").toLowerCase();

        return searchable.includes(query);
      });

      render(filtered);
    });
  } catch (error) {
    grid.innerHTML = `
      <div class="error-box">
        <strong>Le blog n'a pas pu charger les articles.</strong><br />
        Vérifie que le fichier <code>blog/articles/manifest.json</code> existe bien.
      </div>
    `;
    console.error(error);
  }
}

async function renderArticle() {
  const content = $("#articleContent");
  if (!content) return;

  const slug = slugFromUrl();

  try {
    const articles = await fetchManifest();
    const article = articles.find((item) => item.slug === slug) || articles[0];

    if (!article) throw new Error("Aucun article dans le manifest.");

    const markdown = await fetchMarkdown(article);
    const cleanMarkdown = markdown.replace(/^# .+$/m, "").trim();

    $("#articleTitle").textContent = article.title;
    $("#articleExcerpt").textContent = article.excerpt;
    $("#articleDate").textContent = formatDateFr(article.date);
    $("#articleReadingTime").textContent = article.readingTime || readingTime(markdown);
    $("#articleTags").innerHTML = renderTags(article.tags);
    content.innerHTML = markdownToHtml(cleanMarkdown);

    document.title = `${article.title} — Blog Sessio`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", article.excerpt);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", article.title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", article.excerpt);

    const canonicalUrl = `${BLOG_CONFIG.siteUrl}${articleUrl(article)}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.excerpt,
      datePublished: article.date,
      dateModified: article.updated || article.date,
      author: {
        "@type": "Organization",
        name: "Sessio",
      },
      publisher: {
        "@type": "Organization",
        name: "Sessio",
        logo: {
          "@type": "ImageObject",
          url: `${BLOG_CONFIG.siteUrl}/web-app-manifest-512x512.png`,
        },
      },
      mainEntityOfPage: canonicalUrl,
    });
    document.head.appendChild(schema);
  } catch (error) {
    content.innerHTML = `
      <div class="error-box">
        <strong>Article introuvable.</strong><br />
        Retourne sur <a href="/blog/">la liste des articles</a> ou vérifie le slug dans l'URL.
      </div>
    `;
    console.error(error);
  }
}

function setYear() {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
}

setYear();
renderIndex();
renderArticle();
