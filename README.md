# PM Copilot

PM Copilot is a lightweight stakeholder-communications workspace for project managers. It helps organize project stakeholders, map engagement, and draft audience-aware communications.

## Features

- Stakeholder register with power, interest, current engagement, and desired engagement.
- Engagement map for visualizing stakeholder strategy.
- Communication-planning tools and saved drafting history.
- Optional AI communication drafting through a Vercel serverless API.

## Run locally

```bash
vercel dev
```

## Configuration

The optional AI drafting API requires these Vercel environment variables:

- `ANTHROPIC_API_KEY`
- `ACCESS_CODE`

Without them, the core local planning interface remains available and the API returns a configuration message for AI requests.
