# Exotics Weekly Content Automation Guide

This guide explains how to set up fully automated daily content generation using n8n, Claude AI, and Supabase.

## Architecture Overview

```
┌─────────────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  News Sources   │────▶│    n8n      │────▶│  Claude AI  │────▶│   Supabase   │
│  (RSS Feeds)    │     │  Workflow   │     │  (Rewrite)  │     │   Database   │
└─────────────────┘     └─────────────┘     └─────────────┘     └──────────────┘
                              │                                        │
                              │         ┌─────────────────────────────────┐
                              └────────▶│     Exotics Weekly Website     │
                                        │   (Reads from Supabase)         │
                                        └─────────────────────────────────┘
```

## Step 1: Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the contents of `supabase-schema.sql`
4. Get your credentials from Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The `anon` `public` key
   - `SUPABASE_SERVICE_ROLE_KEY`: The `service_role` key (keep this secret!)

5. Add these to your `.env.local` file (copy from `.env.example`)

## Step 2: Generate API Key

Generate a secure random API key for n8n to authenticate:

```bash
openssl rand -hex 32
```

Add this as `STORIES_API_KEY` in your `.env.local`

## Step 3: Configure n8n Workflow

### RSS Feed Sources for Exotic Car News

Add these RSS feeds to your n8n workflow:

| Source | RSS URL | Focus |
|--------|---------|-------|
| Hagerty | `https://www.hagerty.com/media/feed/` | Market analysis, auctions |
| RM Sotheby's | `https://rmsothebys.com/feed/` | Auction results |
| Bring a Trailer | `https://bringatrailer.com/feed/` | Auction listings |
| Top Gear | `https://www.topgear.com/car-news/rss` | News, reviews |
| Road & Track | `https://www.roadandtrack.com/rss/` | Reviews, motorsport |
| Petrolicious | `https://petrolicious.com/feed` | Heritage stories |
| Classic Driver | `https://www.classicdriver.com/en/feed` | Classic car news |

### n8n Workflow Steps

Create this workflow in n8n:

#### 1. Schedule Trigger
- Type: **Cron**
- Expression: `0 8 * * *` (runs daily at 8 AM)

#### 2. RSS Feed Read (multiple)
- Add one **RSS Feed Read** node per source
- Set "Feed URL" to each RSS feed above
- Set "Max Items" to 10

#### 3. Merge Node
- Type: **Merge**
- Mode: **Append**
- Connect all RSS outputs here

#### 4. Filter Node (Remove Duplicates)
- Filter out stories already published
- HTTP Request to: `GET https://your-site.com/api/stories?limit=100`
- Compare titles/URLs to filter existing content

#### 5. Code Node (Prepare for Claude)
```javascript
// Limit to top 3 most relevant stories per day
const items = $input.all().slice(0, 3);

return items.map(item => ({
  json: {
    sourceTitle: item.json.title,
    sourceContent: item.json.content || item.json.description,
    sourceUrl: item.json.link,
    sourceName: item.json.creator || 'Unknown',
    pubDate: item.json.pubDate
  }
}));
```

#### 6. Claude AI Node (for each story)
- Type: **HTTP Request**
- Method: **POST**
- URL: `https://api.anthropic.com/v1/messages`
- Headers:
  - `x-api-key`: Your Anthropic API key
  - `anthropic-version`: `2023-06-01`
  - `content-type`: `application/json`

Body:
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2000,
  "messages": [
    {
      "role": "user",
      "content": "You are a writer for Exotics Weekly, a prestigious automotive publication covering exotic cars, historic motorsport, and collector car culture. Your writing style is elegant, authoritative, and evokes an early 1900s industrial aesthetic—think understated sophistication with deep automotive expertise.\n\nRewrite this news item as an original Exotics Weekly article:\n\nSource: {{$json.sourceTitle}}\n\n{{$json.sourceContent}}\n\nRequirements:\n1. Write in Exotics Weekly's distinctive voice\n2. Create an original headline (not copied from source)\n3. Add context and analysis that demonstrates expertise\n4. Include a compelling subtitle\n5. Format content as HTML with <p> tags\n6. Length: 300-500 words\n7. Do NOT plagiarize—synthesize and rewrite completely\n\nRespond in this exact JSON format:\n{\n  \"title\": \"Your headline\",\n  \"subtitle\": \"Your subtitle\",\n  \"excerpt\": \"A 1-2 sentence summary\",\n  \"content\": \"<p>Full article HTML...</p>\",\n  \"category\": \"News|Reviews|Auctions|Heritage|Motorsport|Collecting\",\n  \"tags\": [\"tag1\", \"tag2\", \"tag3\"]\n}"
    }
  ]
}
```

#### 7. Code Node (Parse Claude Response)
```javascript
const response = JSON.parse($input.first().json.content[0].text);

return [{
  json: {
    ...response,
    author: "Exotics Weekly Editorial",
    source_url: $('Prepare for Claude').item.json.sourceUrl,
    source_name: $('Prepare for Claude').item.json.sourceName,
    status: "published",
    featured: false
  }
}];
```

#### 8. HTTP Request (Publish to Website)
- Method: **POST**
- URL: `https://your-site.com/api/stories`
- Headers:
  - `Authorization`: `Bearer YOUR_STORIES_API_KEY`
  - `Content-Type`: `application/json`
- Body: `{{ $json }}`

#### 9. Error Handling
Add error handling to notify you of failures:
- Connect error outputs to a **Slack** or **Email** node

### Complete Workflow JSON

Import this into n8n (Workflows → Import from File):

```json
{
  "name": "Exotics Weekly Auto Publisher",
  "nodes": [
    {
      "name": "Daily Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300],
      "parameters": {
        "rule": {
          "interval": [{"field": "cronExpression", "expression": "0 8 * * *"}]
        }
      }
    }
  ],
  "connections": {}
}
```

## Step 4: Test the Integration

### Test API Endpoint
```bash
curl -X POST https://your-site.com/api/stories \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Story",
    "excerpt": "This is a test.",
    "content": "<p>Test content.</p>",
    "author": "Test Author",
    "category": "News"
  }'
```

### Test n8n Workflow
1. Open your workflow in n8n
2. Click "Execute Workflow"
3. Check each node's output for errors
4. Verify the story appears on your website

## Step 5: Fine-Tuning

### Content Quality
- Adjust the Claude prompt to match your exact voice
- Add specific instructions for different categories
- Include examples of your best articles in the prompt

### Scheduling
- Adjust cron expression for your timezone
- Consider publishing at different times for different categories
- Add multiple schedules for breaking news vs. features

### Source Management
- Regularly review RSS feeds for quality
- Add/remove sources based on content relevance
- Weight certain sources higher for different categories

## API Reference

### POST /api/stories
Create a new story.

**Headers:**
- `Authorization: Bearer YOUR_API_KEY`
- `Content-Type: application/json`

**Body:**
```json
{
  "title": "Required - Story headline",
  "excerpt": "Required - Short summary",
  "content": "Required - Full HTML content",
  "author": "Required - Author name",
  "category": "Required - News|Reviews|Auctions|Heritage|Motorsport|Collecting",
  "subtitle": "Optional - Subtitle",
  "tags": ["Optional", "array", "of tags"],
  "featured": false,
  "status": "published",
  "source_url": "Optional - Original source URL",
  "source_name": "Optional - Source publication name"
}
```

### GET /api/stories
List all stories.

**Query Parameters:**
- `status`: Filter by status (published, draft, archived)
- `category`: Filter by category
- `limit`: Number of stories (default: 50)

### PATCH /api/stories/[id]
Update a story.

### DELETE /api/stories/[id]
Delete a story.

## Monitoring

### Recommended Alerts
1. **Failed workflow runs** - Email notification
2. **No stories published in 24h** - Check sources
3. **High error rate from Claude** - Review prompts

### Metrics to Track
- Stories published per day
- Source diversity
- Category distribution
- Reader engagement (add analytics)

## Cost Estimates

| Service | Free Tier | Estimated Monthly |
|---------|-----------|-------------------|
| Supabase | 500MB database | $0 |
| n8n Cloud | 5 workflows | $0-20 |
| Claude API | — | ~$5-15 (3 stories/day) |
| Vercel | 100GB bandwidth | $0 |

**Total: ~$5-35/month** for a fully automated news site.

## Troubleshooting

### Stories not appearing
1. Check Supabase dashboard for new rows
2. Verify API key is correct
3. Check n8n execution logs
4. Ensure `status` is set to `published`

### Claude returning errors
1. Check API key validity
2. Review rate limits
3. Simplify prompt if hitting token limits

### RSS feeds empty
1. Some feeds require user-agent headers
2. Check if feed URL changed
3. Try alternative RSS source

---

For questions, check the [n8n documentation](https://docs.n8n.io/) or [Supabase docs](https://supabase.com/docs).
