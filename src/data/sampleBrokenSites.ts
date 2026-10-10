export interface SampleBrokenSite {
  id: string;
  name: string;
  description: string;
  category: string;
  html: string;
  css: string;
}

export const SAMPLE_BROKEN_SITES: SampleBrokenSite[] = [
  {
    id: 'broken-bistro',
    name: 'Broken Italian Bistro Site',
    description: 'Lacks viewport meta tag, unlabelled reservation form, missing img alt text, and dead href="#" links.',
    category: 'Restaurant & Hospitality',
    html: `<html>
<head>
  <style>
    body { font-family: sans-serif; background: #222; color: #fff; margin: 0; padding: 20px; }
    .container { width: 1200px; margin: 0 auto; background: #333; padding: 20px; }
    .nav { display: flex; gap: 20px; margin-bottom: 20px; }
    .hero { text-align: center; padding: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="nav">
      <h2>Luigi Bistro</h2>
      <a href="#">Menu</a>
      <a href="#">Specials</a>
      <a href="#" target="_blank">Instagram</a>
    </div>
    <div class="hero">
      <h1>Authentic Woodfired Pizza</h1>
      <p>Baked fresh in Naples brick oven.</p>
      <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800">
    </div>
    <div class="booking">
      <h3>Book a Table</h3>
      <input type="text" placeholder="Your Name">
      <input type="text" placeholder="Phone Number">
      <button>Submit</button>
    </div>
  </div>
</body>
</html>`,
    css: `.container { width: 1200px; margin: 0 auto; background: #333; padding: 20px; }`,
  },
  {
    id: 'broken-portfolio',
    name: 'Broken Developer Portfolio',
    description: 'Missing DOCTYPE, missing title, missing description, broken external links, and rigid non-fluid CSS widths.',
    category: 'Personal Portfolio',
    html: `<html>
<head>
  <style>
    body { background: #0f172a; color: #e2e8f0; font-family: monospace; }
    .wrapper { width: 1100px; margin: 40px auto; }
    .btn { background: #3b82f6; color: white; padding: 10px 20px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>Alex Dev — Fullstack Architect</h2>
    <p>Building high-performance distributed microservices.</p>
    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300">
    <div style="margin-top: 20px;">
      <a href="#" class="btn">Download Resume</a>
      <a href="https://github.com" target="_blank">GitHub Profile</a>
    </div>
  </div>
</body>
</html>`,
    css: `.wrapper { width: 1100px; margin: 40px auto; }`,
  },
  {
    id: 'broken-saas',
    name: 'Broken SaaS Landing Page',
    description: 'Missing viewport, 3 unlabelled newsletter inputs, missing alt tags on product mockups, and insecure target="_blank".',
    category: 'SaaS & Startup',
    html: `<html>
<head>
  <title>CloudSync</title>
</head>
<body style="background: #111; color: #eee; font-family: system-ui;">
  <div style="max-width: 1000px; margin: auto; padding: 30px;">
    <h1>Sync Files in Real Time</h1>
    <p>Zero-latency distributed replication for modern engineering orgs.</p>
    <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600">
    <form style="margin-top: 30px;">
      <input type="email" placeholder="Enter work email">
      <button type="submit">Get Early Access</button>
    </form>
    <div style="margin-top: 40px;">
      <a href="https://twitter.com" target="_blank">Follow on X / Twitter</a>
    </div>
  </div>
</body>
</html>`,
    css: ``,
  },
];
