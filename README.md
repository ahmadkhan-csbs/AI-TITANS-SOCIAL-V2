# AI TITANS SOCIAL

AI-powered social-media management dashboard with Firebase authentication, content generation, scheduling, and analytics.

## Features

- Email/password and Google sign-in through Firebase Authentication
- AI post generator backed by the Groq API
- Browser-based content scheduling with validation and deletion
- Analytics dashboard with follower-growth chart and CSV export
- Responsive landing page and dashboard experience

## Local development

Serve the project from its root with a local web server. Firebase modules do not work when pages are opened directly with `file://`.

The AI generator calls `/api/generate`, so use Vercel development for the complete flow:

```bash
vercel dev
```

Create a local environment file with your key:

```env
GROQ_API_KEY=your_groq_api_key
```

## Before production

The scheduler currently stores posts in the browser. Real publishing requires OAuth credentials and approved API access for each social platform. Protect `/api/generate` with Firebase Admin token verification before exposing it publicly.
