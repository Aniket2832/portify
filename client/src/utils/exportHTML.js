export function generateHTML(title, data, sections, theme = 'dark', template = 'minimal', accentColor = '#6366f1') {
  switch (template) {
    case 'bold': return generateBold(title, data, sections, theme, accentColor)
    case 'glass': return generateGlass(title, data, sections, theme, accentColor)
    case 'terminal': return generateTerminal(title, data, sections, accentColor)
    default: return generateMinimal(title, data, sections, theme, accentColor)
  }
}

function generateMinimal(title, data, sections, theme, accentColor = '#6366f1') {
  const { hero, skills, projects, experience, contact } = data
  const isDark = theme === 'dark'
  const c = {
    bg: isDark ? '#09090b' : '#ffffff',
    bgCard: isDark ? '#141417' : '#f9f9fb',
    bgCardHover: isDark ? '#1c1c20' : '#f0f0f5',
    border: isDark ? '#27272a' : '#e4e4e7',
    text: isDark ? '#ffffff' : '#09090b',
    textMuted: isDark ? '#71717a' : '#52525b',
    textFaint: isDark ? '#52525b' : '#a1a1aa',
    accentText: accentColor,
    accentBg: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)',
    accentBorder: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.25)',
    skillTrack: isDark ? '#1f1f23' : '#e4e4e7',
    sectionBorder: isDark ? '#1f1f23' : '#f0f0f0',
    timelineLine: isDark ? '#27272a' : '#d4d4d8',
  }

  const sectionHTML = {
    hero: `
      <section class="section hero-section animate">
        <p class="label">Portfolio</p>
        <h1 class="hero-name">${hero.name || 'Your Name'}</h1>
        <p class="hero-tagline">${hero.tagline || ''}</p>
        <p class="hero-bio">${hero.bio || ''}</p>
      </section>`,
    skills: skills?.length ? `
      <section class="section animate">
        <p class="label">Skills</p>
        ${skills.map((s, i) => `
          <div class="skill-row" style="animation-delay:${i * 0.08}s">
            <div class="skill-meta"><span>${s.name}</span><span class="muted">${s.level}%</span></div>
            <div class="skill-track"><div class="skill-fill" style="width:${s.level}%"></div></div>
          </div>`).join('')}
      </section>` : '',
    projects: projects?.length ? `
      <section class="section animate">
        <p class="label">Projects</p>
        ${projects.map((p, i) => `
          <div class="card" style="animation-delay:${i * 0.1}s">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" class="card-img" />` : ''}
            <h3 class="card-title">${p.name}</h3>
            <p class="card-desc">${p.desc}</p>
            ${p.tech ? `<div class="tags">${p.tech.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}</div>` : ''}
            ${p.url ? `<a class="card-link" href="${p.url}" target="_blank">${p.url}</a>` : ''}
          </div>`).join('')}
      </section>` : '',
    experience: experience?.length ? `
      <section class="section animate">
        <p class="label">Experience</p>
        ${experience.map((e, i) => `
          <div class="exp-row" style="animation-delay:${i * 0.1}s">
            <div class="exp-line"></div>
            <div>
              <div class="exp-role">${e.role}</div>
              <div class="exp-company">${e.company} · ${e.period}</div>
              <p class="exp-desc">${e.desc}</p>
            </div>
          </div>`).join('')}
      </section>` : '',
    contact: (contact?.email || contact?.github || contact?.linkedin) ? `
      <section class="section animate">
        <p class="label">Contact</p>
        ${contact.email ? `<a class="contact-link" href="mailto:${contact.email}">✉ ${contact.email}</a>` : ''}
        ${contact.github ? `<a class="contact-link" href="${contact.github}" target="_blank">⌥ ${contact.github}</a>` : ''}
        ${contact.linkedin ? `<a class="contact-link" href="${contact.linkedin}" target="_blank">in ${contact.linkedin}</a>` : ''}
      </section>` : '',
  }

  const body = sections.map(s => sectionHTML[s.id] || '').filter(Boolean).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${c.bg};color:${c.text};font-family:'DM Sans',sans-serif;min-height:100vh;transition:background 0.3s,color 0.3s}
    .container{max-width:720px;margin:0 auto}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    .animate{opacity:0;animation:fadeUp 0.6s ease forwards}
    .skill-row,.card,.exp-row{opacity:0;animation:fadeUp 0.5s ease forwards}
    .section{padding:48px 32px;border-bottom:1px solid ${c.sectionBorder}}
    .hero-section{padding:72px 32px 48px}
    .label{font-size:11px;color:${accentColor};letter-spacing:2px;text-transform:uppercase;margin-bottom:16px}
    .hero-name{font-family:'Syne',sans-serif;font-size:clamp(36px,6vw,56px);font-weight:800;letter-spacing:-2px;line-height:1.05;margin-bottom:10px}
    .hero-tagline{font-size:18px;color:${accentColor};font-weight:500;margin-bottom:18px}
    .hero-bio{font-size:15px;color:${c.textMuted};line-height:1.7;max-width:520px;font-weight:300}
    .muted{color:${c.textFaint}}
    .skill-row{margin-bottom:16px}
    .skill-meta{display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px}
    .skill-track{height:4px;background:${c.skillTrack};border-radius:99px;overflow:hidden}
    .skill-fill{height:100%;background:${accentColor};border-radius:99px}
    .card{background:${c.bgCard};border:1px solid ${c.border};border-radius:12px;padding:20px;margin-bottom:14px;transition:background 0.2s}
    .card:hover{background:${c.bgCardHover}}
    .card-img{width:100%;height:160px;object-fit:cover;border-radius:8px;margin-bottom:14px}
    .card-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;margin-bottom:8px}
    .card-desc{font-size:13px;color:${c.textMuted};line-height:1.6;margin-bottom:12px}
    .card-link{font-size:12px;color:${accentColor};word-break:break-all}
    .tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
    .tag{background:${c.accentBg};border:1px solid ${c.accentBorder};border-radius:6px;padding:3px 8px;font-size:11px;color:${accentColor}}
    .exp-row{display:flex;gap:16px;margin-bottom:24px}
    .exp-line{width:2px;background:${c.timelineLine};border-radius:99px;flex-shrink:0}
    .exp-role{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;margin-bottom:4px}
    .exp-company{font-size:13px;color:${accentColor};margin-bottom:8px}
    .exp-desc{font-size:13px;color:${c.textMuted};line-height:1.6}
    .contact-link{display:block;font-size:14px;color:${c.textMuted};text-decoration:none;margin-bottom:10px;transition:color 0.2s}
    .contact-link:hover{color:${accentColor}}
    @media(max-width:600px){.section{padding:36px 20px}.hero-section{padding:48px 20px 36px}}
  </style>
</head>
<body><div class="container">${body}</div></body>
</html>`
}

function generateBold(title, data, sections, theme, accentColor = '#ff4d00') {
  const { hero, skills, projects, experience, contact } = data
  const isDark = theme === 'dark'
  const c = {
    bg: isDark ? '#0a0a0a' : '#f5f5f0',
    text: isDark ? '#ffffff' : '#0a0a0a',
    textMuted: isDark ? '#888' : '#666',
    accentLight: isDark ? 'rgba(255,77,0,0.1)' : 'rgba(255,77,0,0.08)',
    border: isDark ? '#222' : '#ddd',
    card: isDark ? '#111' : '#ffffff',
  }

  const sectionHTML = {
    hero: `
      <section class="hero animate">
        <div class="hero-number">01</div>
        <h1 class="hero-name">${hero.name || 'Your Name'}</h1>
        <p class="hero-tagline">${hero.tagline || ''}</p>
        <p class="hero-bio">${hero.bio || ''}</p>
      </section>`,
    skills: skills?.length ? `
      <section class="sec animate">
        <div class="sec-header"><span class="sec-num">02</span><span class="sec-title">Skills</span></div>
        <div class="skills-grid">
          ${skills.map(s => `
            <div class="skill-chip">
              <span>${s.name}</span>
              <span class="skill-pct">${s.level}%</span>
            </div>`).join('')}
        </div>
      </section>` : '',
    projects: projects?.length ? `
      <section class="sec animate">
        <div class="sec-header"><span class="sec-num">03</span><span class="sec-title">Projects</span></div>
        ${projects.map((p, i) => `
          <div class="bold-card" style="animation-delay:${i * 0.1}s">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" class="bold-img" />` : ''}
            <div class="bold-card-top">
              <h3>${p.name}</h3>
              ${p.url ? `<a href="${p.url}" target="_blank" class="bold-link">↗</a>` : ''}
            </div>
            <p class="bold-desc">${p.desc}</p>
            ${p.tech ? `<div class="bold-tags">${p.tech.split(',').map(t => `<span>${t.trim()}</span>`).join('')}</div>` : ''}
          </div>`).join('')}
      </section>` : '',
    experience: experience?.length ? `
      <section class="sec animate">
        <div class="sec-header"><span class="sec-num">04</span><span class="sec-title">Experience</span></div>
        ${experience.map(e => `
          <div class="bold-exp">
            <div class="bold-exp-left"><div class="bold-exp-period">${e.period}</div></div>
            <div class="bold-exp-right">
              <div class="bold-exp-role">${e.role}</div>
              <div class="bold-exp-company">${e.company}</div>
              <p class="bold-desc">${e.desc}</p>
            </div>
          </div>`).join('')}
      </section>` : '',
    contact: (contact?.email || contact?.github || contact?.linkedin) ? `
      <section class="sec animate">
        <div class="sec-header"><span class="sec-num">05</span><span class="sec-title">Contact</span></div>
        <div class="bold-contact">
          ${contact.email ? `<a href="mailto:${contact.email}">${contact.email}</a>` : ''}
          ${contact.github ? `<a href="${contact.github}" target="_blank">GitHub ↗</a>` : ''}
          ${contact.linkedin ? `<a href="${contact.linkedin}" target="_blank">LinkedIn ↗</a>` : ''}
        </div>
      </section>` : '',
  }

  const body = sections.map(s => sectionHTML[s.id] || '').filter(Boolean).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${c.bg};color:${c.text};font-family:'DM Sans',sans-serif;min-height:100vh}
    .container{max-width:900px;margin:0 auto;padding:0 40px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
    .animate{opacity:0;animation:fadeUp 0.7s ease forwards}
    .hero{padding:100px 0 80px;border-bottom:2px solid ${c.text}}
    .hero-number{font-family:'Syne',sans-serif;font-size:13px;color:${accentColor};letter-spacing:4px;margin-bottom:24px;font-weight:700}
    .hero-name{font-family:'Syne',sans-serif;font-size:clamp(56px,8vw,96px);font-weight:800;letter-spacing:-4px;line-height:0.95;margin-bottom:24px;text-transform:uppercase}
    .hero-tagline{font-size:20px;color:${accentColor};font-weight:500;margin-bottom:16px}
    .hero-bio{font-size:16px;color:${c.textMuted};line-height:1.7;max-width:560px}
    .sec{padding:64px 0;border-bottom:1px solid ${c.border}}
    .sec-header{display:flex;align-items:baseline;gap:16px;margin-bottom:40px}
    .sec-num{font-family:'Syne',sans-serif;font-size:13px;color:${accentColor};letter-spacing:4px;font-weight:700}
    .sec-title{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;letter-spacing:-1px;text-transform:uppercase}
    .skills-grid{display:flex;flex-wrap:wrap;gap:10px}
    .skill-chip{display:flex;align-items:center;gap:8px;background:${c.card};border:1px solid ${c.border};padding:10px 16px;border-radius:4px;font-size:14px;font-weight:500}
    .skill-pct{color:${accentColor};font-weight:700;font-size:12px}
    .bold-card{border-top:1px solid ${c.border};padding:28px 0;opacity:0;animation:fadeUp 0.5s ease forwards}
    .bold-img{width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:16px}
    .bold-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
    .bold-card-top h3{font-family:'Syne',sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.5px}
    .bold-link{color:${accentColor};font-size:24px;text-decoration:none;font-weight:700;line-height:1}
    .bold-desc{font-size:14px;color:${c.textMuted};line-height:1.7;margin-bottom:12px}
    .bold-tags{display:flex;flex-wrap:wrap;gap:6px}
    .bold-tags span{background:${c.accentLight};border:1px solid ${accentColor};border-radius:3px;padding:3px 10px;font-size:11px;color:${accentColor};font-weight:600;letter-spacing:0.5px}
    .bold-exp{display:flex;gap:40px;padding:24px 0;border-top:1px solid ${c.border}}
    .bold-exp-left{width:140px;flex-shrink:0}
    .bold-exp-period{font-size:12px;color:${c.textMuted};margin-top:4px}
    .bold-exp-role{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px}
    .bold-exp-company{font-size:14px;color:${accentColor};margin-bottom:10px;font-weight:500}
    .bold-contact{display:flex;flex-direction:column;gap:12px}
    .bold-contact a{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:${c.text};text-decoration:none;letter-spacing:-0.5px;transition:color 0.2s}
    .bold-contact a:hover{color:${accentColor}}
    @media(max-width:600px){.container{padding:0 24px}.hero{padding:60px 0 48px}.hero-name{font-size:48px}}
  </style>
</head>
<body><div class="container">${body}</div></body>
</html>`
}

function generateGlass(title, data, sections, theme, accentColor = '#a78bfa') {
  const { hero, skills, projects, experience, contact } = data
  const isDark = theme === 'dark'
  const c = {
    bg1: isDark ? '#0f0c29' : '#e8e0ff',
    bg2: isDark ? '#302b63' : '#c4b5fd',
    bg3: isDark ? '#24243e' : '#a78bfa',
    text: isDark ? '#ffffff' : '#1e1b4b',
    textMuted: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(30,27,75,0.6)',
    glass: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
    glassBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)',
    glassHover: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.65)',
    accentLight: isDark ? 'rgba(167,139,250,0.15)' : 'rgba(124,58,237,0.1)',
  }

  const sectionHTML = {
    hero: `
      <section class="hero animate">
        <div class="glass-pill">✦ Portfolio</div>
        <h1 class="hero-name">${hero.name || 'Your Name'}</h1>
        <p class="hero-tagline">${hero.tagline || ''}</p>
        <p class="hero-bio">${hero.bio || ''}</p>
      </section>`,
    skills: skills?.length ? `
      <section class="sec animate">
        <h2 class="sec-title">Skills</h2>
        <div class="glass-card">
          ${skills.map((s, i) => `
            <div class="skill-row" style="animation-delay:${i * 0.08}s">
              <div class="skill-meta"><span>${s.name}</span><span>${s.level}%</span></div>
              <div class="skill-track"><div class="skill-fill" style="width:${s.level}%"></div></div>
            </div>`).join('')}
        </div>
      </section>` : '',
    projects: projects?.length ? `
      <section class="sec animate">
        <h2 class="sec-title">Projects</h2>
        <div class="grid">
          ${projects.map((p, i) => `
            <div class="glass-card project-card" style="animation-delay:${i * 0.1}s">
              ${p.image ? `<img src="${p.image}" alt="${p.name}" class="proj-img" />` : ''}
              <h3 class="proj-name">${p.name}</h3>
              <p class="proj-desc">${p.desc}</p>
              ${p.tech ? `<div class="tags">${p.tech.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}</div>` : ''}
              ${p.url ? `<a class="proj-link" href="${p.url}" target="_blank">View project ↗</a>` : ''}
            </div>`).join('')}
        </div>
      </section>` : '',
    experience: experience?.length ? `
      <section class="sec animate">
        <h2 class="sec-title">Experience</h2>
        ${experience.map((e, i) => `
          <div class="glass-card exp-card" style="animation-delay:${i * 0.1}s">
            <div class="exp-top">
              <div>
                <div class="exp-role">${e.role}</div>
                <div class="exp-company">${e.company}</div>
              </div>
              <div class="exp-period">${e.period}</div>
            </div>
            <p class="exp-desc">${e.desc}</p>
          </div>`).join('')}
      </section>` : '',
    contact: (contact?.email || contact?.github || contact?.linkedin) ? `
      <section class="sec animate">
        <h2 class="sec-title">Contact</h2>
        <div class="glass-card">
          ${contact.email ? `<a class="contact-row" href="mailto:${contact.email}"><span>✉</span><span>${contact.email}</span></a>` : ''}
          ${contact.github ? `<a class="contact-row" href="${contact.github}" target="_blank"><span>⌥</span><span>${contact.github}</span></a>` : ''}
          ${contact.linkedin ? `<a class="contact-row" href="${contact.linkedin}" target="_blank"><span>in</span><span>${contact.linkedin}</span></a>` : ''}
        </div>
      </section>` : '',
  }

  const body = sections.map(s => sectionHTML[s.id] || '').filter(Boolean).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:linear-gradient(135deg,${c.bg1},${c.bg2},${c.bg3});color:${c.text};font-family:'DM Sans',sans-serif;min-height:100vh;background-attachment:fixed}
    .container{max-width:760px;margin:0 auto;padding:0 32px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    .animate{opacity:0;animation:fadeUp 0.7s ease forwards}
    .skill-row,.project-card,.exp-card{opacity:0;animation:fadeUp 0.5s ease forwards}
    .hero{padding:80px 0 60px;text-align:center}
    .glass-pill{display:inline-flex;align-items:center;gap:6px;background:${c.glass};border:1px solid ${c.glassBorder};backdrop-filter:blur(12px);border-radius:99px;padding:6px 16px;font-size:12px;margin-bottom:24px;letter-spacing:1px}
    .hero-name{font-family:'Syne',sans-serif;font-size:clamp(40px,7vw,72px);font-weight:800;letter-spacing:-2px;line-height:1.05;margin-bottom:16px}
    .hero-tagline{font-size:18px;color:${accentColor};font-weight:500;margin-bottom:16px}
    .hero-bio{font-size:15px;color:${c.textMuted};line-height:1.7;max-width:480px;margin:0 auto;font-weight:300}
    .sec{padding:48px 0}
    .sec-title{font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${accentColor};margin-bottom:20px}
    .glass-card{background:${c.glass};backdrop-filter:blur(16px);border:1px solid ${c.glassBorder};border-radius:16px;padding:24px;margin-bottom:12px;transition:background 0.2s}
    .glass-card:hover{background:${c.glassHover}}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}
    .project-card{margin-bottom:0}
    .proj-img{width:100%;height:140px;object-fit:cover;border-radius:10px;margin-bottom:12px}
    .proj-name{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:8px}
    .proj-desc{font-size:13px;color:${c.textMuted};line-height:1.6;margin-bottom:12px}
    .proj-link{font-size:12px;color:${accentColor};text-decoration:none;font-weight:500}
    .tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
    .tag{background:${c.accentLight};border:1px solid ${accentColor};border-radius:99px;padding:3px 10px;font-size:11px;color:${accentColor}}
    .skill-row{margin-bottom:16px}
    .skill-meta{display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px}
    .skill-track{height:6px;background:rgba(255,255,255,0.1);border-radius:99px;overflow:hidden}
    .skill-fill{height:100%;background:${accentColor};border-radius:99px}
    .exp-card{margin-bottom:12px}
    .exp-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
    .exp-role{font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-bottom:4px}
    .exp-company{font-size:13px;color:${accentColor}}
    .exp-period{font-size:12px;color:${c.textMuted};white-space:nowrap}
    .exp-desc{font-size:13px;color:${c.textMuted};line-height:1.6}
    .contact-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid ${c.glassBorder};text-decoration:none;color:${c.text};font-size:14px;transition:color 0.2s}
    .contact-row:last-child{border-bottom:none}
    .contact-row:hover{color:${accentColor}}
    .contact-row span:first-child{width:20px;text-align:center;color:${accentColor}}
    @media(max-width:600px){.container{padding:0 20px}.grid{grid-template-columns:1fr}}
  </style>
</head>
<body><div class="container">${body}</div></body>
</html>`
}

function generateTerminal(title, data, sections, accentColor = '#3fb950') {
  const { hero, skills, projects, experience, contact } = data

  const sectionHTML = {
    hero: `
      <section class="sec animate">
        <p class="prompt">$ whoami</p>
        <p class="output name">${hero.name || 'your_name'}</p>
        <p class="prompt mt">$ cat tagline.txt</p>
        <p class="output">${hero.tagline || 'your tagline here'}</p>
        <p class="prompt mt">$ cat bio.txt</p>
        <p class="output bio">${hero.bio || 'your bio here'}</p>
      </section>`,
    skills: skills?.length ? `
      <section class="sec animate">
        <p class="prompt">$ ls skills/</p>
        <div class="term-grid">
          ${skills.map(s => `<span class="term-file">${s.name}<span class="term-pct">[${s.level}%]</span></span>`).join('')}
        </div>
      </section>` : '',
    projects: projects?.length ? `
      <section class="sec animate">
        <p class="prompt">$ ls projects/ -la</p>
        ${projects.map((p, i) => `
          <div class="term-block" style="animation-delay:${i * 0.12}s">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" class="term-img" />` : ''}
            <p class="term-title">drwxr-xr-x  <span style="color:${accentColor}">${p.name}/</span></p>
            <p class="term-detail"># ${p.desc}</p>
            ${p.tech ? `<p class="term-detail">stack: <span class="cyan">${p.tech}</span></p>` : ''}
            ${p.url ? `<p class="term-detail">url: <span class="yellow"><a href="${p.url}" target="_blank" style="color:inherit">${p.url}</a></span></p>` : ''}
          </div>`).join('')}
      </section>` : '',
    experience: experience?.length ? `
      <section class="sec animate">
        <p class="prompt">$ cat experience.log</p>
        ${experience.map(e => `
          <div class="term-block">
            <p class="term-title"><span class="cyan">[${e.period}]</span> <span style="color:${accentColor}">${e.role}</span> @ ${e.company}</p>
            <p class="term-detail">${e.desc}</p>
          </div>`).join('')}
      </section>` : '',
    contact: (contact?.email || contact?.github || contact?.linkedin) ? `
      <section class="sec animate">
        <p class="prompt">$ cat contact.json</p>
        <div class="term-json">
          <p>{</p>
          ${contact.email ? `<p class="json-line">"email": <a href="mailto:${contact.email}" class="yellow">"${contact.email}"</a>,</p>` : ''}
          ${contact.github ? `<p class="json-line">"github": <a href="${contact.github}" target="_blank" class="yellow">"${contact.github}"</a>,</p>` : ''}
          ${contact.linkedin ? `<p class="json-line">"linkedin": <a href="${contact.linkedin}" target="_blank" class="yellow">"${contact.linkedin}"</a></p>` : ''}
          <p>}</p>
        </div>
      </section>` : '',
  }

  const body = sections.map(s => sectionHTML[s.id] || '').filter(Boolean).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#0d1117;color:#c9d1d9;font-family:'JetBrains Mono',monospace;min-height:100vh;font-size:14px;line-height:1.6}
    .container{max-width:800px;margin:0 auto;padding:40px 32px}
    @keyframes fadeIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    .animate,.term-block{opacity:0;animation:fadeIn 0.5s ease forwards}
    .cyan{color:#79c0ff}
    .yellow{color:#e3b341}
    .sec{margin-bottom:40px;padding-bottom:40px;border-bottom:1px solid #21262d}
    .sec:last-child{border-bottom:none}
    .prompt{color:${accentColor};margin-bottom:6px}
    .mt{margin-top:16px}
    .output{color:#c9d1d9;margin-bottom:4px}
    .output.name{font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px}
    .output.bio{color:#8b949e;max-width:560px}
    .term-grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}
    .term-file{color:#79c0ff;background:rgba(121,192,255,0.08);border:1px solid rgba(121,192,255,0.2);padding:4px 10px;border-radius:4px;font-size:13px}
    .term-pct{color:${accentColor};margin-left:6px;font-size:11px}
    .term-block{margin-top:16px;padding:12px 16px;background:#161b22;border:1px solid #21262d;border-left:3px solid ${accentColor};border-radius:0 6px 6px 0}
    .term-img{width:100%;height:140px;object-fit:cover;border-radius:4px;margin-bottom:10px;opacity:0.8}
    .term-title{margin-bottom:6px;color:#8b949e}
    .term-detail{color:#8b949e;font-size:12px;padding-left:4px;margin-top:3px}
    .term-json{padding:12px 16px;background:#161b22;border:1px solid #21262d;border-radius:6px;margin-top:8px}
    .json-line{padding-left:20px}
    .json-line a{text-decoration:none}
    .json-line a:hover{text-decoration:underline}
    .cursor{display:inline-block;width:8px;height:14px;background:${accentColor};animation:blink 1s step-end infinite;vertical-align:middle;margin-left:2px}
    @media(max-width:600px){.container{padding:24px 16px}}
  </style>
</head>
<body>
  <div class="container">
    <div style="margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #21262d">
      <p style="color:#484f58;font-size:12px;margin-bottom:4px">Portify Terminal v1.0.0 — ${title}</p>
      <p style="color:${accentColor};font-size:12px">Ready<span class="cursor"></span></p>
    </div>
    ${body}
  </div>
</body>
</html>`
}

export function downloadHTML(title, data, sections, theme = 'dark', template = 'minimal', accentColor = '#6366f1') {
  const html = generateHTML(title, data, sections, theme, template, accentColor)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = title.toLowerCase().replace(/\s+/g, '-') + '.html'
  a.click()
  URL.revokeObjectURL(url)
}