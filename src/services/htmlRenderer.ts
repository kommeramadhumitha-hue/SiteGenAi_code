import { WebsiteProject, WebsiteSection } from '../types';

export function generateProjectHtml(project: WebsiteProject): string {
  const { palette, fontFamily, sections } = project;
  const visibleSections = sections.filter((s) => s.isVisible);

  const sectionsHtml = visibleSections
    .map((section) => renderSectionHtml(section, palette))
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(project.name)} — Powered by SiteGen AI</title>
  <meta name="description" content="${escapeHtml(project.prompt || 'Generated responsive website')}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontFamily
  )}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-primary: ${palette.primary};
      --color-secondary: ${palette.secondary};
      --color-accent: ${palette.accent};
      --color-bg: ${palette.background};
      --color-surface: ${palette.surface};
      --color-text: ${palette.text};
      --color-muted: #94a3b8;
      --font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--color-bg);
      color: var(--color-text);
      font-family: var(--font-family);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      padding: 0.75rem 1.6rem;
      border-radius: 0.75rem;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      border: none;
      font-size: 0.925rem;
      letter-spacing: -0.01em;
    }

    .btn-primary {
      background: var(--color-primary);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
    .btn-primary:hover {
      transform: translateY(-1.5px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
      opacity: 0.96;
    }

    .btn-secondary {
      background: var(--color-surface);
      color: var(--color-text);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }
    .btn-secondary:hover {
      background: #f1f5f9;
      transform: translateY(-1.5px);
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      background: rgba(37, 99, 235, 0.08);
      border: 1px solid rgba(37, 99, 235, 0.2);
      border-radius: 9999px;
      font-size: 0.775rem;
      font-weight: 600;
      color: var(--color-primary);
      margin-bottom: 1.25rem;
    }

    /* Cards */
    .card {
      background: var(--color-surface);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 1.25rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .card:hover {
      transform: translateY(-3px);
      border-color: rgba(0, 0, 0, 0.14);
      box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.07);
    }

    /* Section padding */
    .section-spacious { padding: 6.5rem 0; }
    .section-normal { padding: 4.75rem 0; }
    .section-compact { padding: 3.25rem 0; }

    /* Grids */
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }

    /* Custom CSS */
    ${project.customCss || ''}
  </style>
</head>
<body>
  ${sectionsHtml}

  <script>
    // Accordion toggle helper
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isOpen = content.style.display === 'block';
        content.style.display = isOpen ? 'none' : 'block';
        trigger.setAttribute('aria-expanded', !isOpen);
      });
    });

    // Form notification helper
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          const original = btn.textContent;
          btn.textContent = 'Submitted Successfully ✓';
          btn.style.opacity = '0.8';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.opacity = '1';
            form.reset();
          }, 3000);
        }
      });
    });

    ${project.customJs || ''}
  </script>
</body>
</html>`;
}

function renderSectionHtml(section: WebsiteSection, palette: any): string {
  const c = section.content;
  const paddingClass =
    section.styles?.paddingY === 'spacious'
      ? 'section-spacious'
      : section.styles?.paddingY === 'compact'
      ? 'section-compact'
      : 'section-normal';

  // Check if current palette has a light background (e.g. #fff, #ffffff, #fafafa)
  const isLightBg = palette.background === '#ffffff' || palette.background === '#fff' || palette.background?.toLowerCase().startsWith('#f');
  const cardBorder = isLightBg ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)';
  const cardShadow = isLightBg ? '0 4px 20px -2px rgba(0,0,0,0.06)' : 'none';
  const navBg = isLightBg ? 'rgba(255, 255, 255, 0.92)' : 'rgba(10, 15, 29, 0.85)';
  const navBorder = isLightBg ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)';
  const navLinkColor = isLightBg ? '#475569' : '#cbd5e1';
  const inputBg = isLightBg ? '#ffffff' : 'rgba(0, 0, 0, 0.25)';
  const inputBorder = isLightBg ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.12)';
  const inputTextColor = isLightBg ? '#0f172a' : '#ffffff';

  switch (section.type) {
    case 'navbar': {
      const navLinks = c.links && c.links.length > 0
        ? c.links
        : (c.items && c.items.length > 0
          ? c.items.map((it, i) => ({ label: it.title || 'Link ' + (i + 1), url: `#${it.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'section'}` }))
          : [
              { label: 'Menu', url: '#features' },
              { label: 'About', url: '#about' },
              { label: 'Reviews', url: '#testimonials' },
              { label: 'Reservations', url: '#contact' },
            ]);

      return `
      <header style="background: ${navBg}; backdrop-filter: blur(16px); position: sticky; top: 0; z-index: 100; border-bottom: ${navBorder}; box-shadow: ${isLightBg ? '0 2px 10px rgba(0,0,0,0.04)' : 'none'};">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; height: 4.75rem;">
          <a href="#" style="font-size: 1.45rem; font-weight: 800; background: linear-gradient(135deg, ${palette.primary}, ${palette.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            ${escapeHtml(c.headline || 'Bella Luna')}
          </a>
          <nav style="display: flex; gap: 2rem; align-items: center;">
            ${navLinks
              .map(
                (l) =>
                  `<a href="${escapeHtml(l.url)}" style="font-size: 0.95rem; font-weight: 600; color: ${navLinkColor}; transition: color 0.2s;" onmouseover="this.style.color='${palette.primary}'" onmouseout="this.style.color='${navLinkColor}'">${escapeHtml(
                    l.label
                  )}</a>`
              )
              .join('')}
          </nav>
          <div>
            <a href="${escapeHtml(c.primaryCtaUrl || '#contact')}" class="btn btn-primary" style="padding: 0.65rem 1.35rem; font-size: 0.9rem;">
              ${escapeHtml(c.primaryCtaText || 'Reserve Table')}
            </a>
          </div>
        </div>
      </header>`;
    }

    case 'hero':
      return `
      <section class="${paddingClass}" style="position: relative; overflow: hidden; background: ${isLightBg ? `radial-gradient(circle at 50% 20%, rgba(185, 28, 28, 0.06) 0%, transparent 65%)` : `radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)`};">
        <div class="container" style="text-align: center; max-width: 900px;">
          ${
            c.badge
              ? `<div class="badge" style="${isLightBg ? 'background: rgba(185,28,28,0.08); border-color: rgba(185,28,28,0.2); color: ' + palette.primary : ''}"><span>🍕</span> ${escapeHtml(c.badge)}</div>`
              : ''
          }
          <h1 style="font-size: clamp(2.5rem, 5vw, 4.25rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 1.5rem; color: var(--color-text);">
            ${escapeHtml(c.headline || 'Build Smarter Websites with AI')}
          </h1>
          <p style="font-size: clamp(1.1rem, 2vw, 1.35rem); color: var(--color-muted); margin-bottom: 2.5rem; line-height: 1.6;">
            ${escapeHtml(
              c.subheadline ||
                'Turn ambitious ideas into lightning-fast, beautifully crafted websites using automated intelligence.'
            )}
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3.5rem;">
            <a href="${escapeHtml(c.primaryCtaUrl || '#features')}" class="btn btn-primary" style="font-size: 1.05rem; padding: 0.85rem 2rem;">
              ${escapeHtml(c.primaryCtaText || 'Explore Menu')} →
            </a>
            ${
              c.secondaryCtaText
                ? `<a href="${escapeHtml(
                    c.secondaryCtaUrl || '#contact'
                  )}" class="btn btn-secondary" style="font-size: 1.05rem; padding: 0.85rem 1.85rem; ${isLightBg ? 'background: #f1f5f9; border-color: #e2e8f0; color: #0f172a;' : ''}">
                    ${escapeHtml(c.secondaryCtaText)}
                  </a>`
                : `<a href="#contact" class="btn btn-secondary" style="font-size: 1.05rem; padding: 0.85rem 1.85rem; ${isLightBg ? 'background: #f1f5f9; border-color: #e2e8f0; color: #0f172a;' : ''}">
                    Reserve a Table
                  </a>`
            }
          </div>
          ${
            c.imageUrl
              ? `<div style="border-radius: 1rem; overflow: hidden; border: ${cardBorder}; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);">
                  <img src="${escapeHtml(c.imageUrl)}" alt="${escapeHtml(
                  c.imageAlt || 'Hero visual mockup'
                )}" style="width: 100%; display: block;" loading="lazy" />
                </div>`
              : ''
          }
        </div>
      </section>`;

    case 'features': {
      const items = c.items || [
        {
          title: 'Margherita Classica',
          description: 'San Marzano tomatoes, fresh buffalo mozzarella, aromatic basil, cold-pressed olive oil.',
          icon: '🍕',
          price: '$18',
        },
        {
          title: 'Diavola Piccante',
          description: 'Spicy Calabrian salami, smoked provolone, chili-infused honey, San Marzano sauce.',
          icon: '🌶️',
          price: '$21',
        },
        {
          title: 'Tartufo & Funghi',
          description: 'Black summer truffle cream, wild cremini mushrooms, fior di latte, aged pecorino.',
          icon: '🍄',
          price: '$24',
        },
      ];

      return `
      <section id="features" class="${paddingClass}" style="${isLightBg ? 'background: #fafaf9;' : ''}">
        <div class="container">
          <div style="text-align: center; max-width: 750px; margin: 0 auto 3.5rem;">
            ${c.badge ? `<div class="badge" style="${isLightBg ? 'background: rgba(185,28,28,0.08); border-color: rgba(185,28,28,0.2); color: ' + palette.primary : ''}">${escapeHtml(c.badge)}</div>` : ''}
            <h2 style="font-size: 2.35rem; font-weight: 800; margin-bottom: 1rem; color: var(--color-text);">
              ${escapeHtml(c.headline || 'Our Signature Pizza Menu')}
            </h2>
            <p style="color: var(--color-muted); font-size: 1.15rem; line-height: 1.6;">
              ${escapeHtml(c.subheadline || 'Handcrafted stone-baked pizzas fermented for 48 hours for an airy, crispy crust.')}
            </p>
          </div>
          <div class="grid-3">
            ${items
              .map(
                (item) => `
              <div class="card" style="border: ${cardBorder}; box-shadow: ${cardShadow}; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                    <span style="font-size: 2.25rem;">${item.icon || '🍕'}</span>
                    ${item.price ? `<span style="font-size: 1.25rem; font-weight: 800; color: ${palette.primary}; background: ${isLightBg ? 'rgba(185,28,28,0.08)' : 'rgba(255,255,255,0.08)'}; padding: 0.35rem 0.85rem; border-radius: 9999px;">${escapeHtml(item.price)}</span>` : ''}
                  </div>
                  <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-text);">
                    ${escapeHtml(item.title)}
                  </h3>
                  <p style="color: var(--color-muted); font-size: 0.95rem; line-height: 1.6;">
                    ${escapeHtml(item.description)}
                  </p>
                </div>
                <div style="margin-top: 1.75rem; pt-3; border-top: ${isLightBg ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.06)'}; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.85rem; font-weight: 600; color: ${palette.secondary};">Artisan Prepared</span>
                  <a href="#contact" class="btn btn-primary" style="padding: 0.45rem 1rem; font-size: 0.85rem;">Order / Reserve</a>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;
    }

    case 'about':
      return `
      <section id="about" class="${paddingClass}">
        <div class="container" style="max-width: 950px;">
          <div class="card" style="border: ${cardBorder}; box-shadow: ${cardShadow}; padding: clamp(2rem, 5vw, 3.5rem); text-align: center;">
            <div class="badge" style="${isLightBg ? 'background: rgba(185,28,28,0.08); border-color: rgba(185,28,28,0.2); color: ' + palette.primary : ''}">Our Story</div>
            <h2 style="font-size: clamp(2rem, 4vw, 2.75rem); font-weight: 800; margin-bottom: 1.5rem; color: var(--color-text);">
              ${escapeHtml(c.headline || 'Passione & Tradizione')}
            </h2>
            <p style="font-size: 1.15rem; line-height: 1.8; color: var(--color-muted); max-width: 800px; margin: 0 auto 2rem;">
              ${escapeHtml(c.subheadline || 'Rooted in heritage Italian recipes and guided by contemporary culinary artistry, Bella Luna brings uncompromised flavors directly from Napoli to your table. Every dish is seasoned with love, patience, and the highest grade farm-to-table ingredients.')}
            </p>
            ${c.items && c.items.length > 0 ? `
              <div class="grid-3" style="margin-top: 2.5rem; text-align: left;">
                ${c.items.map(it => `
                  <div style="padding: 1rem; background: ${isLightBg ? '#f8fafc' : 'rgba(255,255,255,0.03)'}; border-radius: 0.75rem; border: ${cardBorder};">
                    <h4 style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--color-text);">${escapeHtml(it.title)}</h4>
                    <p style="color: var(--color-muted); font-size: 0.9rem; line-height: 1.5;">${escapeHtml(it.description)}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </section>`;

    case 'pricing':
      return `
      <section id="pricing" class="${paddingClass}" style="background: rgba(255, 255, 255, 0.015);">
        <div class="container">
          <div style="text-align: center; max-width: 650px; margin: 0 auto 3.5rem;">
            <div class="badge">Flexible Plans</div>
            <h2 style="font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem;">
              ${escapeHtml(c.headline || 'Predictable, Transparent Pricing')}
            </h2>
            <p style="color: var(--color-muted);">${escapeHtml(
              c.subheadline || 'Choose the plan that fits your growth ambitions.'
            )}</p>
          </div>
          <div class="grid-3">
            ${(c.items || [
              {
                title: 'Free Community',
                price: '$0',
                period: '/forever',
                description: 'Full capabilities for all users and builders.',
                features: ['Unlimited Projects', 'HTML/CSS/React Export', 'Standard AI Speed'],
              },
              {
                title: 'Free Professional',
                price: '$0',
                period: '/forever',
                description: 'Complete development kit with zero subscription.',
                features: ['All Core Capabilities', 'Automated Code Repair', 'Custom GitHub Publishing', 'Edge Deployment'],
              },
            ])
              .map(
                (tier, idx) => `
              <div class="card" style="${
                idx === 1
                  ? `border: 2px solid ${palette.primary}; background: rgba(37, 99, 235, 0.05); position: relative;`
                  : ''
              }">
                ${
                  idx === 1
                    ? `<div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: ${palette.primary}; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 9999px; text-transform: uppercase;">Most Popular</div>`
                    : ''
                }
                <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem;">${escapeHtml(
                  tier.title
                )}</h3>
                <p style="color: var(--color-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">${escapeHtml(
                  tier.description
                )}</p>
                <div style="font-size: 2.75rem; font-weight: 800; margin-bottom: 1.5rem;">
                  ${escapeHtml(tier.price)} <span style="font-size: 1rem; color: var(--color-muted); font-weight: 400;">${escapeHtml(
                  tier.period || ''
                )}</span>
                </div>
                <ul style="list-style: none; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem;">
                  ${(tier.features || [])
                    .map(
                      (f) =>
                        `<li style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem; color: #cbd5e1;"><span style="color: #10b981;">✓</span> ${escapeHtml(
                          f
                        )}</li>`
                    )
                    .join('')}
                </ul>
                <a href="#signup" class="btn ${
                  idx === 1 ? 'btn-primary' : 'btn-secondary'
                }" style="width: 100%; text-align: center;">Choose ${escapeHtml(
                  tier.title
                )}</a>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;

    case 'testimonials':
      return `
      <section id="testimonials" class="${paddingClass}">
        <div class="container">
          <div style="text-align: center; max-width: 600px; margin: 0 auto 3.5rem;">
            <div class="badge" style="${isLightBg ? 'background: rgba(185,28,28,0.08); border-color: rgba(185,28,28,0.2); color: ' + palette.primary : ''}">Guest Reviews</div>
            <h2 style="font-size: 2.25rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--color-text);">
              ${escapeHtml(c.headline || 'Loved by Thousands of Guests')}
            </h2>
            <p style="color: var(--color-muted);">${escapeHtml(
              c.subheadline || 'Read what diners are saying about their dining experience.'
            )}</p>
          </div>
          <div class="grid-3">
            ${(c.items || [
              {
                author: 'Elena Rossi',
                role: 'Verified Guest',
                description: 'The Truffle pizza is exceptional. Crispy crust, authentic flavors, and the hospitality makes you feel right at home in Italy.',
              },
              {
                author: 'Marco Bellini',
                role: 'Food & Wine Critic',
                description: 'Unquestionably the best Neapolitan pizza in the city. The 48-hour dough fermentation is evident in every single bite.',
              },
              {
                author: 'Sophia Chen',
                role: 'Regular Patron',
                description: 'Warm ambiance, delicious wine pairings, and friendly staff. A flawless dining experience from appetizer to espresso.',
              },
            ])
              .map(
                (t) => `
              <div class="card" style="border: ${cardBorder}; box-shadow: ${cardShadow};">
                <div style="color: #f59e0b; margin-bottom: 1rem; font-size: 1.1rem;">★★★★★</div>
                <p style="font-style: italic; color: var(--color-muted); margin-bottom: 1.5rem; line-height: 1.6;">"${escapeHtml(
                  t.description
                )}"</p>
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, ${
                    palette.primary
                  }, ${palette.accent}); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff;">
                    ${escapeHtml(t.author?.[0] || t.title?.[0] || 'G')}
                  </div>
                  <div>
                    <h4 style="font-weight: 700; font-size: 0.95rem; color: var(--color-text);">${escapeHtml(t.author || t.title || 'Guest')}</h4>
                    <p style="font-size: 0.8rem; color: var(--color-muted);">${escapeHtml(t.role || t.icon || 'Verified Patron')}</p>
                  </div>
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;

    case 'statistics':
      return `
      <section class="${paddingClass}" style="background: ${isLightBg ? '#f8fafc' : 'rgba(255,255,255,0.02)'}; border-top: ${isLightBg ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)'}; border-bottom: ${isLightBg ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)'};">
        <div class="container">
          <div class="grid-4" style="text-align: center;">
            ${(c.items || [
              { value: '48h', label: 'Slow Dough Fermentation' },
              { value: '450°C', label: 'Stone Oven Temperature' },
              { value: '100%', label: 'Imported San Marzano' },
              { value: '4.9 ★', label: 'Over 1,200 Reviews' },
            ])
              .map(
                (stat) => `
              <div>
                <div style="font-size: clamp(2rem, 3.5vw, 3rem); font-weight: 800; background: linear-gradient(135deg, ${
                  palette.primary
                }, ${palette.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                  ${escapeHtml(stat.value || '')}
                </div>
                <div style="color: var(--color-muted); font-size: 0.95rem; font-weight: 600; margin-top: 0.5rem;">
                  ${escapeHtml(stat.label || '')}
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;

    case 'faq':
      return `
      <section id="faq" class="${paddingClass}">
        <div class="container" style="max-width: 800px;">
          <div style="text-align: center; margin-bottom: 3.5rem;">
            <div class="badge" style="${isLightBg ? 'background: rgba(185,28,28,0.08); border-color: rgba(185,28,28,0.2); color: ' + palette.primary : ''}">FAQ</div>
            <h2 style="font-size: 2.25rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--color-text);">
              ${escapeHtml(c.headline || 'Frequently Asked Questions')}
            </h2>
            <p style="color: var(--color-muted);">${escapeHtml(
              c.subheadline || 'Everything you need to know about dining and reservations.'
            )}</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${(c.items || [
              {
                title: 'Do you offer gluten-free and vegan pizza options?',
                description: 'Yes! We craft dedicated gluten-free crusts and plant-based artisanal cheeses prepared in segregated stations.',
              },
              {
                title: 'Can we book private dining rooms or celebrations?',
                description: 'Absolutely. Use our reservation form or call us directly to book our private wine cellar room accommodating up to 35 guests.',
              },
            ])
              .map(
                (faq) => `
              <div class="accordion-item card" style="border: ${cardBorder}; box-shadow: ${cardShadow}; padding: 1.25rem 1.75rem;">
                <button class="accordion-trigger" aria-expanded="false" style="width: 100%; display: flex; justify-content: space-between; align-items: center; background: none; border: none; color: var(--color-text); font-size: 1.05rem; font-weight: 600; text-align: left; cursor: pointer;">
                  <span>${escapeHtml(faq.title)}</span>
                  <span style="font-size: 1.25rem; color: var(--color-muted);">+</span>
                </button>
                <div class="accordion-content" style="display: none; margin-top: 1rem; color: var(--color-muted); font-size: 0.95rem; line-height: 1.6; border-top: ${isLightBg ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.06)'}; padding-top: 1rem;">
                  ${escapeHtml(faq.description)}
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;

    case 'contact': {
      // Check if contact has specific contact items (like Address, Hours, Phone)
      const contactItems = c.items || [];
      const hoursItem = contactItems.find((it) => (it.title || '').toLowerCase().includes('hour') || (it.description || '').toLowerCase().includes('pm') || (it.description || '').toLowerCase().includes('sunday') || (it.description || '').toLowerCase().includes('monday'));

      return `
      <section id="contact" class="${paddingClass}" style="${isLightBg ? 'background: #fafaf9;' : 'background: rgba(255,255,255,0.015);'}">
        <div class="container" style="max-width: 1050px;">
          <div style="text-align: center; margin-bottom: 3.5rem;">
            <div class="badge" style="${isLightBg ? 'background: rgba(185,28,28,0.08); border-color: rgba(185,28,28,0.2); color: ' + palette.primary : ''}">Table Reservations</div>
            <h2 style="font-size: 2.35rem; font-weight: 800; margin-bottom: 0.75rem; color: var(--color-text);">
              ${escapeHtml(c.headline || 'Reserve Your Table at Bella Luna')}
            </h2>
            <p style="color: var(--color-muted); font-size: 1.1rem;">${escapeHtml(
              c.subheadline || 'Book ahead for lunch or dinner. We look forward to hosting you.'
            )}</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; align-items: start;">
            <!-- Reservation Form -->
            <form class="card" style="border: ${cardBorder}; box-shadow: ${cardShadow}; display: flex; flex-direction: column; gap: 1.25rem;">
              <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin-bottom: 0.25rem;">
                Table Reservation Form
              </h3>
              <div>
                <label for="contact-name" style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--color-text);">Full Name</label>
                <input id="contact-name" type="text" required placeholder="Mario Rossi" style="width: 100%; padding: 0.85rem 1rem; background: ${inputBg}; border: ${inputBorder}; border-radius: 0.5rem; color: ${inputTextColor}; font-size: 0.95rem;" />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label for="contact-phone" style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--color-text);">Phone</label>
                  <input id="contact-phone" type="tel" required placeholder="+39 06 1234 5678" style="width: 100%; padding: 0.85rem 1rem; background: ${inputBg}; border: ${inputBorder}; border-radius: 0.5rem; color: ${inputTextColor}; font-size: 0.95rem;" />
                </div>
                <div>
                  <label for="contact-guests" style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--color-text);">Party Size</label>
                  <select id="contact-guests" style="width: 100%; padding: 0.85rem 1rem; background: ${inputBg}; border: ${inputBorder}; border-radius: 0.5rem; color: ${inputTextColor}; font-size: 0.95rem;">
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label for="contact-date" style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--color-text);">Date</label>
                  <input id="contact-date" type="date" required style="width: 100%; padding: 0.85rem 1rem; background: ${inputBg}; border: ${inputBorder}; border-radius: 0.5rem; color: ${inputTextColor}; font-size: 0.95rem;" />
                </div>
                <div>
                  <label for="contact-time" style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--color-text);">Time</label>
                  <select id="contact-time" style="width: 100%; padding: 0.85rem 1rem; background: ${inputBg}; border: ${inputBorder}; border-radius: 0.5rem; color: ${inputTextColor}; font-size: 0.95rem;">
                    <option>18:00</option>
                    <option>19:00</option>
                    <option>20:00</option>
                    <option>21:00</option>
                    <option>22:00</option>
                  </select>
                </div>
              </div>
              <div>
                <label for="contact-notes" style="display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem; color: var(--color-text);">Special Requests & Dietary Requirements</label>
                <textarea id="contact-notes" rows="3" placeholder="Window seating, outdoor patio, anniversary..." style="width: 100%; padding: 0.85rem 1rem; background: ${inputBg}; border: ${inputBorder}; border-radius: 0.5rem; color: ${inputTextColor}; font-size: 0.95rem;"></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem; width: 100%;">
                ${escapeHtml(c.buttonText || 'Confirm Table Reservation')}
              </button>
            </form>

            <!-- Opening Hours & Location Info Cards -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div class="card" style="border: ${cardBorder}; box-shadow: ${cardShadow};">
                <div style="font-size: 1.75rem; margin-bottom: 0.75rem;">🕒</div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin-bottom: 0.75rem;">
                  Opening Hours
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem; color: var(--color-muted);">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed ${isLightBg ? '#e2e8f0' : 'rgba(255,255,255,0.08)'}; padding-bottom: 0.4rem;">
                    <span style="font-weight: 600; color: var(--color-text);">Tuesday – Friday</span>
                    <span>17:00 – 23:00</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed ${isLightBg ? '#e2e8f0' : 'rgba(255,255,255,0.08)'}; padding-bottom: 0.4rem;">
                    <span style="font-weight: 600; color: var(--color-text);">Saturday & Sunday</span>
                    <span>12:00 – 23:30</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding-top: 0.2rem;">
                    <span style="font-weight: 600; color: ${palette.primary};">Monday</span>
                    <span style="color: ${palette.primary}; font-weight: 600;">Closed (Prep Day)</span>
                  </div>
                </div>
              </div>

              <div class="card" style="border: ${cardBorder}; box-shadow: ${cardShadow};">
                <div style="font-size: 1.75rem; margin-bottom: 0.75rem;">📍</div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin-bottom: 0.75rem;">
                  Location & Contact
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem; color: var(--color-muted);">
                  <div>
                    <span style="font-weight: 600; color: var(--color-text);">Address:</span>
                    <div>${escapeHtml(contactItems.find(it => (it.title || '').toLowerCase().includes('address'))?.description || 'Via della Spiga 18, 00187 Roma, Italy')}</div>
                  </div>
                  <div>
                    <span style="font-weight: 600; color: var(--color-text);">Direct Line:</span>
                    <div>${escapeHtml(contactItems.find(it => (it.title || '').toLowerCase().includes('phone'))?.description || '+39 06 8892 4100')}</div>
                  </div>
                  <div>
                    <span style="font-weight: 600; color: var(--color-text);">Inquiries:</span>
                    <div>${escapeHtml(contactItems.find(it => (it.title || '').toLowerCase().includes('email'))?.description || 'prenotazioni@bellaluna.it')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    }

    case 'cta':
      return `
      <section class="${paddingClass}">
        <div class="container">
          <div style="background: ${isLightBg ? 'linear-gradient(135deg, rgba(185, 28, 28, 0.08), rgba(234, 88, 12, 0.08))' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))'}; border: 1px solid ${isLightBg ? 'rgba(185, 28, 28, 0.2)' : 'rgba(139, 92, 246, 0.3)'}; border-radius: 1.5rem; padding: 4rem 2rem; text-align: center; position: relative; overflow: hidden;">
            <h2 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 1.25rem; color: var(--color-text);">
              ${escapeHtml(c.headline || 'Ready to Experience Real Italian Flavor?')}
            </h2>
            <p style="color: var(--color-muted); font-size: 1.15rem; max-width: 600px; margin: 0 auto 2.5rem;">
              ${escapeHtml(
                c.subheadline ||
                  'Reserve your table today or browse our complete pizza and wine menu online.'
              )}
            </p>
            <a href="${escapeHtml(c.primaryCtaUrl || '#contact')}" class="btn btn-primary" style="font-size: 1.05rem; padding: 0.85rem 2.25rem;">
              ${escapeHtml(c.primaryCtaText || 'Reserve Table Now')} →
            </a>
          </div>
        </div>
      </section>`;

    case 'footer': {
      const footerItems = c.items || [
        { title: 'Privacy Policy' },
        { title: 'Terms of Dining' },
        { title: 'Private Hire' },
        { title: 'Allergen Guide' },
      ];

      return `
      <footer style="background: ${isLightBg ? '#f8fafc' : '#050811'}; border-top: ${isLightBg ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)'}; padding: 4rem 0 2.5rem;">
        <div class="container">
          <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 2rem; margin-bottom: 3rem;">
            <div style="max-width: 340px;">
              <div style="font-size: 1.45rem; font-weight: 800; background: linear-gradient(135deg, ${
                palette.primary
              }, ${palette.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.75rem;">
                ${escapeHtml(c.headline || 'Bella Luna Ristorante')}
              </div>
              <p style="color: var(--color-muted); font-size: 0.95rem; line-height: 1.6;">
                ${escapeHtml(
                  c.subheadline || 'Authentic Neapolitan pizza and Italian dining crafted with passion, patience, and the freshest ingredients.'
                )}
              </p>
            </div>
            <div style="display: flex; gap: 3.5rem; flex-wrap: wrap;">
              <div>
                <h5 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--color-text); margin-bottom: 1rem;">Experience</h5>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--color-muted);">
                  <li><a href="#features" style="transition: color 0.2s;">Pizza Menu</a></li>
                  <li><a href="#about" style="transition: color 0.2s;">Our Story</a></li>
                  <li><a href="#testimonials" style="transition: color 0.2s;">Reviews</a></li>
                  <li><a href="#contact" style="transition: color 0.2s;">Reservations</a></li>
                </ul>
              </div>
              <div>
                <h5 style="font-size: 0.9rem; font-weight: 700; text-transform: uppercase; color: var(--color-text); margin-bottom: 1rem;">Information</h5>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: var(--color-muted);">
                  ${footerItems.map(it => `<li><a href="#contact">${escapeHtml(it.title)}</a></li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
          <div style="border-top: ${isLightBg ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.05)'}; padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--color-muted);">
            <div>${escapeHtml(c.copyright || `© ${new Date().getFullYear()} ${c.headline || 'Bella Luna'}. All rights reserved.`)}</div>
            <div>Built with SiteGen AI • 100% Free Website Builder</div>
          </div>
        </div>
      </footer>`;
    }

    default:
      // Generic fallback section
      return `
      <section class="${paddingClass}">
        <div class="container">
          <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-text);">${escapeHtml(
            section.title
          )}</h2>
          ${c.subheadline ? `<p style="color: var(--color-muted);">${escapeHtml(c.subheadline)}</p>` : ''}
        </div>
      </section>`;
  }
}

function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
