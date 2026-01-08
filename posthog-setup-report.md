# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js DevEvent project. PostHog has been configured with client-side analytics using the modern `instrumentation-client.ts` approach for Next.js 15.3+, a reverse proxy for reliable event delivery, and custom event tracking across key user interaction points. Error tracking and session replay are enabled by default.

## Integration Summary

### Files Created
- **`.env`** - Environment variables for PostHog API key and host
- **`instrumentation-client.ts`** - Client-side PostHog initialization with error tracking enabled

### Files Modified
- **`next.config.ts`** - Added reverse proxy rewrites for `/ingest/*` routes to improve tracking reliability
- **`components/ExploreBtn.tsx`** - Added `explore_events_clicked` event capture
- **`components/EventCard.tsx`** - Added `event_card_clicked` event capture with event properties
- **`components/Navbar.tsx`** - Added navigation click tracking for all nav items

## Events Tracked

| Event Name | Description | File |
|------------|-------------|------|
| `explore_events_clicked` | User clicked the 'Explore Events' button on the homepage to browse events | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details (includes event title, slug, location, date, time) | `components/EventCard.tsx` |
| `logo_clicked` | User clicked on the DevEvent logo to navigate home | `components/Navbar.tsx` |
| `nav_home_clicked` | User clicked on the Home link in the navigation bar | `components/Navbar.tsx` |
| `nav_events_clicked` | User clicked on the Events link in the navigation bar | `components/Navbar.tsx` |
| `nav_create_event_clicked` | User clicked on the Create Event link in the navigation bar | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/281189/dashboard/1001077) - Core analytics dashboard tracking user engagement

### Insights
- [Event Card Clicks Over Time](https://us.posthog.com/project/281189/insights/R1FuHNd1) - Daily trend of event card clicks
- [Explore Events Conversion Funnel](https://us.posthog.com/project/281189/insights/9aBgDaSl) - Conversion from explore button to event card click
- [Navigation Usage](https://us.posthog.com/project/281189/insights/yWSJoxLG) - Which navigation items users click most
- [Most Clicked Events](https://us.posthog.com/project/281189/insights/fDpj7T9N) - Breakdown of clicks by event title
- [User Engagement Summary](https://us.posthog.com/project/281189/insights/JbWagMYN) - Weekly overview of key engagement metrics

## Configuration Details

- **PostHog Host**: https://us.i.posthog.com (via `/ingest` reverse proxy)
- **Error Tracking**: Enabled (`capture_exceptions: true`)
- **Debug Mode**: Enabled in development environment
- **Pageview Capture**: Automatic (using `defaults: '2025-05-24'`)
