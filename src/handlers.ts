/**
 * Tool handlers for Instagram Analytics MCP Server
 */

import { InstagramClient } from './platforms/instagram/client.js';

export async function handleInstagramTool(
  toolName: string,
  args: Record<string, unknown>,
  client: InstagramClient | null
): Promise<unknown> {
  if (!client) {
    throw new Error('Instagram client not initialized. Please set INSTAGRAM_ACCESS_TOKEN in your MCP settings.');
  }

  switch (toolName) {
    case 'instagram_list_accounts':
      return await client.getAvailableAccounts();

    case 'instagram_get_profile': {
      const accountId = args.account_id as string | undefined;
      return await client.getUserProfile(accountId);
    }

    case 'instagram_get_account_insights': {
      const accountId = args.account_id as string | undefined;
      const metrics = args.metrics as string[];
      const metricType = args.metric_type as 'time_series' | 'total_value' | undefined;
      const period = args.period as string;
      const since = args.since as number | undefined;
      const until = args.until as number | undefined;
      const timeframe = args.timeframe as string | undefined;
      const breakdown = args.breakdown as string | undefined;

      return await client.getAccountInsights(metrics as any[], period as any, {
        accountId,
        metricType,
        since,
        until,
        timeframe: timeframe as any,
        breakdown: breakdown as any,
      });
    }

    case 'instagram_list_media': {
      const accountId = args.account_id as string | undefined;
      const limit = args.limit as number | undefined;
      const after = args.after as string | undefined;
      return await client.getMedia(limit, accountId, after);
    }

    case 'instagram_get_media_details': {
      const mediaId = args.media_id as string;
      return await client.getMediaById(mediaId);
    }

    case 'instagram_get_media_insights': {
      const mediaId = args.media_id as string;
      const metrics = args.metrics as string[];
      return await client.getMediaInsights(mediaId, metrics as any[]);
    }

    case 'instagram_get_stories': {
      const accountId = args.account_id as string | undefined;
      const after = args.after as string | undefined;
      return await client.getStories(accountId, after);
    }

    case 'instagram_get_hashtag_search': {
      const hashtag = args.hashtag as string;
      const accountId = args.account_id as string | undefined;
      const hashtagId = await client.searchHashtag(hashtag, accountId);
      return { hashtag, hashtag_id: hashtagId };
    }

    case 'instagram_get_hashtag_media': {
      const hashtagId = args.hashtag_id as string;
      const type = (args.type as 'top_media' | 'recent_media') || 'top_media';
      const accountId = args.account_id as string | undefined;
      const limit = args.limit as number | undefined;
      const after = args.after as string | undefined;
      return await client.getHashtagMedia(hashtagId, type, accountId, limit, after);
    }

    case 'instagram_get_content_publishing_limit': {
      const accountId = args.account_id as string | undefined;
      return await client.getContentPublishingLimit(accountId);
    }

    case 'instagram_get_mentioned_media': {
      const accountId = args.account_id as string | undefined;
      const limit = args.limit as number | undefined;
      const after = args.after as string | undefined;
      return await client.getMentionedMedia(accountId, limit, after);
    }

    default:
      throw new Error(`Unknown Instagram tool: ${toolName}`);
  }
}
