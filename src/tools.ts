/**
 * Tool definitions for Instagram Analytics MCP Server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const INSTAGRAM_TOOLS: Tool[] = [
  {
    name: 'instagram_list_accounts',
    description: 'List all available Instagram Business accounts. Use this first to discover account IDs.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'instagram_get_profile',
    description: 'Get Instagram business account profile information (username, followers, media count, etc.). If account_id is not provided, it will be auto-detected from the environment or discovered automatically.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via INSTAGRAM_ACCOUNT_ID environment variable or if only one account exists.',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_account_insights',
    description: 'Get account-level insights for Instagram. Use period=day for activity metrics, with since/until for a date range. Demographic metrics (follower_demographics, engaged_audience_demographics) need period=lifetime, metric_type=total_value and a timeframe.',
    inputSchema: {
      type: 'object',
      required: ['metrics', 'metric_type', 'period'],
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'accounts_engaged',
              'comments',
              'engaged_audience_demographics',
              'follows_and_unfollows',
              'follower_demographics',
              'likes',
              'profile_links_taps',
              'reach',
              'replies',
              'saved',
              'shares',
              'total_interactions',
              'views',
            ],
          },
          description: 'Array of metrics to retrieve',
        },
        metric_type: {
          type: 'string',
          enum: ['time_series', 'total_value'],
          description: 'How to aggregate results',
        },
        period: {
          type: 'string',
          enum: ['day', 'lifetime'],
          description: 'Use day for activity metrics and lifetime for demographic metrics',
        },
        since: {
          type: 'number',
          description: 'Unix timestamp for start of date range',
        },
        until: {
          type: 'number',
          description: 'Unix timestamp for end of date range',
        },
        timeframe: {
          type: 'string',
          enum: ['this_month', 'this_week'],
          description: 'Required for demographic metrics (engaged_audience_demographics, follower_demographics)',
        },
        breakdown: {
          type: 'string',
          enum: ['contact_button_type', 'follow_type', 'media_product_type', 'age', 'city', 'country', 'gender'],
          description: 'Break down results by dimensions (only with metric_type=total_value)',
        },
      },
    },
  },
  {
    name: 'instagram_list_media',
    description: 'Get a list of recent media posts from Instagram account. Returns posts with basic engagement data.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        limit: {
          type: 'number',
          description: 'Number of media items to retrieve (default: 25, max: 100)',
        },
        after: {
          type: 'string',
          description: 'Cursor from paging.cursors.after in a previous response. Fetch the next page when paging.has_next is true.',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_media_details',
    description: 'Get detailed information about a specific Instagram media post including caption, type, URL, and engagement counts.',
    inputSchema: {
      type: 'object',
      required: ['media_id'],
      properties: {
        media_id: {
          type: 'string',
          description: 'The ID of the media item',
        },
      },
    },
  },
  {
    name: 'instagram_get_media_insights',
    description:
      'Get insights for a specific Instagram media post. Note: Available metrics depend on media type. For Reels: views, likes, comments, shares, reach, saved, total_interactions, ig_reels_avg_watch_time, ig_reels_video_view_total_time, reels_skip_rate. For Images/Carousels: likes, comments, reach, saved, shares, total_interactions. Story-specific metrics (replies, navigation) only work on story media. Always returns lifetime values.',
    inputSchema: {
      type: 'object',
      required: ['media_id', 'metrics'],
      properties: {
        media_id: {
          type: 'string',
          description: 'The ID of the media item',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              'comments',
              'follows',
              'likes',
              'reach',
              'saved',
              'shares',
              'total_interactions',
              'views',
              'profile_visits',
              'profile_activity',
              'navigation',
              'replies',
              'ig_reels_avg_watch_time',
              'ig_reels_video_view_total_time',
              'reels_skip_rate',
              'reposts',
            ],
          },
          description: 'Array of metrics to retrieve. Choose metrics appropriate for the media type.',
        },
      },
    },
  },
  {
    name: 'instagram_get_stories',
    description: 'Get recent Instagram Stories for the account. Stories are only available for 24 hours after posting. Returns story media items with basic fields.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        after: {
          type: 'string',
          description: 'Cursor from paging.cursors.after in a previous response. Fetch the next page when paging.has_next is true.',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_hashtag_search',
    description: 'Search for an Instagram hashtag ID by name. The returned ID can be used with instagram_get_hashtag_media to fetch top/recent media. Limited to 30 unique hashtag searches per 7-day rolling window per account.',
    inputSchema: {
      type: 'object',
      required: ['hashtag'],
      properties: {
        hashtag: {
          type: 'string',
          description: 'Hashtag name to search for (without the # symbol)',
        },
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
      },
    },
  },
  {
    name: 'instagram_get_hashtag_media',
    description: 'Get top or recent media for a hashtag. Use instagram_get_hashtag_search first to get the hashtag ID.',
    inputSchema: {
      type: 'object',
      required: ['hashtag_id'],
      properties: {
        hashtag_id: {
          type: 'string',
          description: 'The hashtag ID from instagram_get_hashtag_search',
        },
        type: {
          type: 'string',
          enum: ['top_media', 'recent_media'],
          description: 'Whether to get top or recent media (default: top_media)',
        },
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        limit: {
          type: 'number',
          description: 'Number of media items to retrieve (default: 25)',
        },
        after: {
          type: 'string',
          description: 'Cursor from paging.cursors.after in a previous response. Fetch the next page when paging.has_next is true.',
        },
      },
    },
  },
  {
    name: 'instagram_get_content_publishing_limit',
    description: 'Check the content publishing rate limit status for the Instagram account. Shows current quota usage and limits.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
      },
      required: [],
    },
  },
  {
    name: 'instagram_get_mentioned_media',
    description: 'Get media where the Instagram account is mentioned or tagged by other users.',
    inputSchema: {
      type: 'object',
      properties: {
        account_id: {
          type: 'string',
          description: 'Instagram account ID. Optional if set via environment variable.',
        },
        limit: {
          type: 'number',
          description: 'Number of media items to retrieve (default: 25)',
        },
        after: {
          type: 'string',
          description: 'Cursor from paging.cursors.after in a previous response. Fetch the next page when paging.has_next is true.',
        },
      },
      required: [],
    },
  },
];

export function getAllTools(): Tool[] {
  return INSTAGRAM_TOOLS;
}
