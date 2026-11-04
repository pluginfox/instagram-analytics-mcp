/**
 * Prompt definitions for Instagram Analytics MCP Server
 */

import { Prompt } from '@modelcontextprotocol/sdk/types.js';

type PromptContent = {
  messages: Array<{ role: 'user' | 'assistant'; content: { type: 'text'; text: string } }>;
};

const ACCOUNT_ID_ARGUMENT = {
  name: 'account_id',
  description: 'Instagram account ID (optional if configured)',
  required: false,
};

export const PROMPTS: Prompt[] = [
  {
    name: 'analyze_instagram_performance',
    description: 'Analyze Instagram account performance with key metrics and insights',
    arguments: [
      ACCOUNT_ID_ARGUMENT,
      {
        name: 'timeframe',
        description: 'Analysis timeframe: this_week or this_month',
        required: false,
      },
    ],
  },
  {
    name: 'compare_post_performance',
    description: 'Compare performance of recent Instagram posts',
    arguments: [
      ACCOUNT_ID_ARGUMENT,
      {
        name: 'limit',
        description: 'Number of recent posts to compare (default: 10)',
        required: false,
      },
    ],
  },
  {
    name: 'get_audience_demographics',
    description: 'Get detailed Instagram audience demographics',
    arguments: [ACCOUNT_ID_ARGUMENT],
  },
  {
    name: 'setup_instagram',
    description: 'Guide user through setting up Instagram analytics',
  },
];

function userMessage(text: string): PromptContent {
  return { messages: [{ role: 'user', content: { type: 'text', text } }] };
}

export function getPromptContent(name: string, args: Record<string, string>): PromptContent {
  const accountId = args.account_id || 'configured account';

  switch (name) {
    case 'analyze_instagram_performance': {
      const timeframe = args.timeframe || 'this_month';
      return userMessage(`Analyze Instagram performance for ${accountId} over ${timeframe}. Please:

1. First, use instagram_list_accounts to verify the account is accessible
2. Get profile information using instagram_get_profile
3. Fetch account insights with these metrics:
   - accounts_engaged
   - reach
   - profile_links_taps
   - total_interactions
   - Use metric_type: total_value, period: day, and since/until Unix timestamps covering ${timeframe}
4. Get recent media posts using instagram_list_media (limit: 10)
5. For top 3 posts, get detailed insights with metrics: likes, comments, reach, saved

Provide a comprehensive analysis including:
- Overall account health and growth
- Engagement trends
- Top performing content
- Audience interaction patterns
- Actionable recommendations`);
    }

    case 'compare_post_performance': {
      const limit = args.limit || '10';
      return userMessage(`Compare performance of the last ${limit} Instagram posts for ${accountId}:

1. Use instagram_list_media to get recent posts (limit: ${limit})
2. For each post, get insights with metrics: likes, comments, reach, saved, shares
3. Calculate engagement rate for each post as (likes + comments) / reach

Provide a comparison showing:
- Performance ranking of posts
- Best and worst performing content
- Content type analysis (photo vs video vs carousel)
- Engagement patterns
- Recommendations for future content`);
    }

    case 'get_audience_demographics':
      return userMessage(`Get detailed audience demographics for Instagram ${accountId}:

1. Use instagram_get_account_insights with:
   - metrics: ["engaged_audience_demographics", "follower_demographics"]
   - metric_type: total_value
   - period: lifetime
   - timeframe: this_month
   - breakdown: country (then repeat with age, city, gender)

Provide a comprehensive demographic report including:
- Geographic distribution (countries and cities)
- Age and gender breakdown
- Follower vs engaged audience comparison
- Insights about target audience alignment
- Recommendations for content localization`);

    case 'setup_instagram':
      return userMessage(`Let's set up Instagram analytics. Follow these steps:

1. **Get Access Token**
   - Go to Facebook Graph API Explorer: https://developers.facebook.com/tools/explorer/
   - Select your app or create a new one
   - Request permissions: instagram_basic, instagram_manage_insights, pages_read_engagement, pages_show_list
   - Generate User Access Token

2. **Discover Your Account**
   - Use the tool: instagram_list_accounts
   - This will show all Instagram Business accounts you have access to
   - Copy the account_id you want to analyze

3. **Configure MCP Settings**
   - In your MCP client settings (e.g., Claude Desktop config), add:
     {
       "INSTAGRAM_ACCESS_TOKEN": "your_access_token_here"
     }
   - Optionally add INSTAGRAM_ACCOUNT_ID if you want a default account

4. **Verify Setup**
   - Use instagram_get_profile to verify access
   - Try instagram_get_account_insights to test analytics

You're ready to analyze Instagram performance!`);

    default:
      return userMessage(`Unknown prompt: ${name}`);
  }
}
