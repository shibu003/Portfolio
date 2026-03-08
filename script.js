const projects = [
  {
    id: "shibubu",
    name: "SHIBUBU",
    description: "AI Society platform. Multiple AI agents collaborate, discuss, and support human potential through a networked system.",
    url: "https://shibubu-site.vercel.app/plaza",
    github: "https://github.com/shibu003/shibubu-site",
    status: "Progress",
  },
  {
    id: "daily-life",
    name: "Daily Life",
    description: "Personal tracking app with AI-powered insights. Log daily activities, track finances, monitor streaks and stats.",
    url: "https://gorillion.vercel.app",
    github: "https://github.com/shibu003/daily-life",
    status: "Live",
  },
  {
    id: "globalgrad",
    name: "GlobalGrad Jobs",
    description: "Global job platform for international students and graduates. Real-time Supabase database with advanced search.",
    url: "https://global-grad-jobs.vercel.app",
    github: "https://github.com/shibu003/GlobalGrad-Jobs",
    status: "Progress",
  },
  {
    id: "pigman",
    name: "Pigman",
    description: "Relationship strategy advisor MVP. AI-powered guidance and personalized advice with authentication.",
    url: "https://pigman-rosy.vercel.app",
    github: "https://github.com/shibu003/Pigman",
    status: "Live",
  },
  {
    id: "spaceeconomy",
    name: "Space Economy",
    description: "Space industry intelligence dashboard for launches, satellites, funding rounds, and company momentum.",
    url: "https://frontend-mauve-three-26.vercel.app",
    github: "https://github.com/shibu003/Space-Economy",
    status: "Live",
  },
];

const PROJECT_CLICKS_KEY = "project_clicks_v1";
const COMMENTS_KEY = "portfolio_comments_v1";

const root = document.getElementById("projects");
const commentCountEl = document.getElementById("commentCount");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");

function getStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (_error) {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStatusClass(status) {
  if (status === "Live") return "status-live";
  if (status === "Progress") return "status-progress";
  return "";
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

let clickCounts = getStoredJson(PROJECT_CLICKS_KEY, {});
let comments = getStoredJson(COMMENTS_KEY, []);

function renderProjects() {
  root.innerHTML = projects
    .map((project) => {
      const clickCount = Number(clickCounts[project.id] || 0);
      return `
  <article class="card">
    <div class="top">
      <h2 class="name">${project.name}</h2>
      <span class="status ${getStatusClass(project.status)}">${project.status}</span>
    </div>
    <p class="desc">${project.description}</p>
    <p class="clicks">Clicks: <strong>${clickCount}</strong></p>
    <div class="actions">
      <a class="btn primary project-link" data-project-id="${project.id}" href="${project.url}" target="_blank" rel="noopener noreferrer">Open URL</a>
      <a class="btn secondary" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </article>
`;
    })
    .join("");

  const projectLinks = root.querySelectorAll(".project-link");
  projectLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const projectId = link.getAttribute("data-project-id");
      if (!projectId) return;
      const current = Number(clickCounts[projectId] || 0);
      clickCounts[projectId] = current + 1;
      saveJson(PROJECT_CLICKS_KEY, clickCounts);
      renderProjects();
    });
  });
}

function renderComments() {
  commentCountEl.textContent = String(comments.length);
  if (comments.length === 0) {
    commentList.innerHTML = '<li class="comment-empty">No comments yet.</li>';
    return;
  }

  commentList.innerHTML = comments
    .slice()
    .reverse()
    .map((comment) => `
      <li class="comment-item">
        <p class="comment-author">Anonymous</p>
        <p class="comment-text">${escapeHtml(comment.text)}</p>
        <p class="comment-date">${new Date(comment.createdAt).toLocaleString()}</p>
      </li>
    `)
    .join("");
}

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = commentInput.value.trim();
  if (!text) return;

  comments.push({
    text,
    createdAt: Date.now(),
  });
  saveJson(COMMENTS_KEY, comments);
  commentInput.value = "";
  renderComments();
});

renderProjects();
renderComments();
