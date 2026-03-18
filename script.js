// ============================================================
// Supabase config — replace with your project values
// ============================================================
const SUPABASE_URL = "https://pyvfxoyzeicfwpnxnnjb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dmZ4b3l6ZWljZndwbnhubmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjE3MTYsImV4cCI6MjA4OTM5NzcxNn0.kylKrMPgngKDMblMZrhdwtfGxPvaEdzebXy2ePz7jbI";
// ============================================================

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const root = document.getElementById("projects");
const commentCountEl = document.getElementById("commentCount");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");

let clickCounts = {};
let comments = [];

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

  root.querySelectorAll(".project-link").forEach((link) => {
    link.addEventListener("click", () => {
      const projectId = link.getAttribute("data-project-id");
      if (!projectId) return;
      incrementClick(projectId);
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
    .map(
      (comment) => `
      <li class="comment-item">
        <p class="comment-author">Anonymous</p>
        <p class="comment-text">${escapeHtml(comment.text)}</p>
        <p class="comment-date">${new Date(comment.created_at).toLocaleString()}</p>
      </li>
    `
    )
    .join("");
}

async function incrementClick(projectId) {
  // Optimistic UI update
  clickCounts[projectId] = (clickCounts[projectId] || 0) + 1;
  renderProjects();

  const { error } = await supabaseClient.rpc("increment_click", {
    p_project_id: projectId,
  });
  if (error) {
    console.error("Failed to save click:", error.message);
    // Revert on failure
    clickCounts[projectId] = Math.max(0, (clickCounts[projectId] || 1) - 1);
    renderProjects();
  }
}

async function loadClickCounts() {
  const { data, error } = await supabaseClient.from("click_counts").select("project_id, count");
  if (error) {
    console.error("Failed to load click counts:", error.message);
    return;
  }
  clickCounts = {};
  for (const row of data) {
    clickCounts[row.project_id] = row.count;
  }
  renderProjects();
}

async function loadComments() {
  const { data, error } = await supabaseClient
    .from("comments")
    .select("id, text, created_at")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Failed to load comments:", error.message);
    return;
  }
  comments = data;
  renderComments();
}

commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = commentInput.value.trim();
  if (!text) return;

  const submitBtn = commentForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  const { data, error } = await supabaseClient
    .from("comments")
    .insert({ text })
    .select()
    .single();

  submitBtn.disabled = false;

  if (error) {
    console.error("Failed to post comment:", error.message);
    alert("コメントの投稿に失敗しました。しばらく経ってから再試行してください。");
    return;
  }

  comments.push(data);
  commentInput.value = "";
  renderComments();
});

// Initial render with empty data, then load from DB
renderProjects();
renderComments();
loadClickCounts();
loadComments();
