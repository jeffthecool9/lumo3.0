# Lumo Landing Page - Netlify Deployment Guide

This guide will help you deploy your Lumo landing page to Netlify.

## Project Overview

This is a modern, high-performance landing page built with:
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling via CDN
- **Lucide React** - Beautiful icons

### Features
- Glass-morphism design effects
- Smooth scroll animations
- Responsive mobile-first design
- Floating chat widget
- Interactive FAQ accordion
- Animated phone demo
- SEO-friendly structure

## Quick Deploy to Netlify

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize
   - Select your repository
   - Netlify will auto-detect the settings from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Done!** Your site will be live in 2-3 minutes

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. Follow the prompts:
   - Create & configure a new site: Yes
   - Publish directory: `dist`

### Option 3: Drag & Drop Deploy

1. **Build locally**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder onto the page
   - Done!

## Configuration

### Custom Domain

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions to update your DNS

### Environment Variables

If you need to add environment variables:
1. Go to "Site settings" → "Environment variables"
2. Add your variables (e.g., API keys)
3. Redeploy the site

### Contact Information

Update the WhatsApp number and email in these files:
- `components/Navbar.tsx`
- `components/Footer.tsx`
- `components/FloatingWidget.tsx`
- `components/FAQ.tsx`
- All other components with contact links

Current placeholder: `https://wa.me/0123456789`
Replace with: `https://wa.me/601XXXXXXXXX` (your actual number)

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Structure

```
project/
├── components/          # React components
│   ├── Navbar.tsx
│   ├── PhoneDemo.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   ├── FloatingWidget.tsx
│   ├── Testimonials.tsx
│   └── Integrations.tsx
├── pages/              # Page components
│   ├── About.tsx
│   └── Terms.tsx
├── App.tsx             # Main app component
├── index.tsx           # React entry point
├── index.html          # HTML template
├── netlify.toml        # Netlify config
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── vite.config.ts      # Vite config
```

## Customization Tips

### Colors
The design uses a blue gradient theme. To change:
- Search for `blue-` classes in all component files
- Update gradient colors in `from-blue-X to-blue-Y`
- Modify glass effects in `index.html` style section

### Content
- Update hero text in `App.tsx`
- Modify features in `components/Features.tsx`
- Change pricing in `components/Pricing.tsx`
- Update testimonials in `components/Testimonials.tsx`

### Animations
Animations are defined in `index.html`:
- `animate-float` - Floating effect
- `animate-slide-up` - Slide up on load
- `animate-fade-in-scale` - Fade and scale

## Performance

This landing page is optimized for performance:
- Lazy loading images
- Minimal JavaScript bundle
- CSS via CDN (Tailwind)
- Fast Vite builds
- Netlify edge network

Expected Lighthouse scores:
- Performance: 95+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 100

## Support

Need help? The code is well-commented and organized. Each component is self-contained and easy to understand.

For Netlify-specific issues, check their [docs](https://docs.netlify.com).

## License

This project is ready for commercial use. Customize and deploy as needed for your business.
