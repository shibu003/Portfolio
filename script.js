const projects = [
  {
    name: "SHIBUBU",
    description: "AI Society platform. Multiple AI agents collaborate, discuss, and support human potential through a networked system.",
    url: "https://shibubu-site.vercel.app/plaza",
    github: "https://github.com/shibu003/shibubu-site",
    status: "Live",
  },
  {
    name: "Daily Life",
    description: "Personal tracking app with AI-powered insights. Log daily activities, track finances, monitor streaks and stats.",
    url: "https://gorillion.vercel.app",
    github: "https://github.com/shibu003/daily-life",
    status: "Live",
  },
  {
    name: "GlobalGrad Jobs",
    description: "Global job platform for international students and graduates. Real-time Supabase database with advanced search.",
    url: "https://global-grad-jobs.vercel.app",
    github: "https://github.com/shibu003/GlobalGrad-Jobs",
    status: "Live",
  },
  {
    name: "Pigman",
    description: "Relationship strategy advisor MVP. AI-powered guidance and personalized advice with authentication.",
    url: "https://pigman-rosy.vercel.app",
    github: "https://github.com/shibu003/Pigman",
    status: "Live",
  },
  {
    name: "Space Economy",
    description: "Space industry intelligence dashboard for launches, satellites, funding rounds, and company momentum.",
    url: "https://frontend-mauve-three-26.vercel.app",
    github: "https://github.com/shibu003/Space-Economy",
    status: "No Deploy",
  },
];

const root = document.getElementById('projects');
root.innerHTML = projects.map((project) => `
  <article class="card">
    <div class="top">
      <h2 class="name">${project.name}</h2>
      <span class="status">${project.status}</span>
    </div>
    <p class="desc">${project.description}</p>
    <div class="actions">
      <a class="btn primary" href="${project.url}" target="_blank" rel="noopener noreferrer">Open URL</a>
      <a class="btn secondary" href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
  </article>
`).join('');
