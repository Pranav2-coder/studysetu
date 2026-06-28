import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. SEO files not generated.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = process.env.VITE_BASE_URL || 'https://studysetu.com';

async function generateSEO() {
  console.log('Generating SEO files...');
  try {
    const { data: institutes, error } = await supabase
      .from('institutes')
      .select('slug, published')
      .eq('published', true);

    if (error) {
      throw error;
    }

    const today = new Date().toISOString().split('T')[0];

    const urls = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/browse', changefreq: 'daily', priority: 0.9 },
      { url: '/about', changefreq: 'monthly', priority: 0.7 },
      { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    ];

    if (institutes) {
      institutes.forEach(inst => {
        urls.push({
          url: `/institutes/${inst.slug}`,
          changefreq: 'weekly',
          priority: 0.8
        });
      });
    }

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE_URL}${u.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.resolve(__dirname, 'public/sitemap.xml'), sitemapContent);
    console.log('✅ Generated public/sitemap.xml');

    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml`;

    fs.writeFileSync(path.resolve(__dirname, 'public/robots.txt'), robotsContent);
    console.log('✅ Generated public/robots.txt');

  } catch (err) {
    console.error('Failed to generate SEO files:', err);
  }
}

generateSEO();
