# ATOMi Marketing Website

A modern, production-ready marketing website for ATOMi, Rwanda's leading nuclear energy company.

## Features

- **Responsive Design**: Mobile-first approach with full responsiveness across all devices
- **Interactive Hero**: 3D animated nuclear reactor visualization using Canvas
- **Scrollytelling**: Engaging scroll-reveal animations and parallax effects
- **Blog System**: Full-featured blog with comments, likes, and category filtering
- **Admin Dashboard**: Comprehensive content management system for posts, comments, and team members
- **Team Directory**: Professional team member profiles with contact information
- **Contact Form**: Fully functional contact form with validation
- **SEO Optimized**: Meta tags, sitemap, robots.txt, and structured data
- **Performance**: React Compiler enabled, image optimization, and security headers
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Custom React hooks with Intersection Observer
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/atomi/marketing-website.git

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Resend Email Configuration (for contact form)
RESEND_API_KEY=your-resend-api-key
\`\`\`

**To set up Resend for email notifications:**
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your `.env.local` file
4. Contact forms will send emails to info@atomi.rw

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page with hero and scrollytelling
│   ├── blog/
│   │   ├── page.tsx         # Blog listing with filtering
│   │   └── [slug]/
│   │       └── page.tsx     # Individual blog post
│   ├── team/
│   │   └── page.tsx         # Team directory
│   ├── contact/
│   │   └── page.tsx         # Contact form and info
│   └── admin/
│       ├── layout.tsx       # Admin sidebar layout
│       ├── page.tsx         # Dashboard overview
│       ├── posts/
│       │   └── page.tsx     # Blog post management
│       ├── comments/
│       │   └── page.tsx     # Comment moderation
│       └── team/
│           └── page.tsx     # Team member management
├── components/
│   ├── navigation.tsx       # Main navigation bar
│   ├── footer.tsx           # Footer component
│   ├── hero-3d.tsx          # 3D reactor visualization
│   ├── scroll-reveal.tsx    # Scroll reveal animation
│   ├── parallax-section.tsx # Parallax effect component
│   ├── blog-card.tsx        # Blog post card component
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── mock-data.ts         # Mock data for development
│   └── utils.ts             # Utility functions
├── public/
│   ├── sitemap.xml          # SEO sitemap
│   ├── robots.txt           # Robots file
│   └── images/              # Static images
└── scripts/
    └── database-schema.sql  # Database schema reference
\`\`\`

## Database Integration

The application includes a complete database schema for Supabase integration. To set up:

1. Create a Supabase project
2. Run the SQL script from `scripts/database-schema.sql`
3. Add environment variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_key
   \`\`\`

## Environment Variables

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
\`\`\`

## Deployment

### Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean
- Self-hosted servers

## Performance Optimizations

- React Compiler enabled for automatic optimization
- Image optimization with WebP and AVIF formats
- Lazy loading for images and components
- CSS-in-JS with Tailwind for minimal bundle size
- Intersection Observer for scroll animations
- Canvas rendering for 3D visualization

## Security

- Security headers configured in `next.config.mjs`
- CSRF protection ready for forms
- XSS protection enabled
- Content Security Policy headers
- Robots.txt and sitemap for SEO

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Proprietary - ATOMi

## Support

For support, contact: info@atomi.rw

## Deployment Checklist

- [ ] Update metadata in `app/layout.tsx`
- [ ] Configure environment variables
- [ ] Set up Supabase database
- [ ] Update contact email addresses
- [ ] Add company logo and images
- [ ] Configure analytics
- [x] Set up email notifications
- [ ] Test all forms
- [ ] Verify SEO settings
- [ ] Test on mobile devices
- [ ] Performance audit
- [ ] Security audit
