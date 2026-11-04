# Instagram Analytics MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server for reading analytics from your own Instagram accounts through the Meta Graph API. All tools are read-only.

Your Instagram account must be a Business or Creator account connected to a Facebook Page, because the API reaches Instagram through that Page.

## Quick Start

1. **Install and build**

   ```bash
   git clone -b ig-hardening https://github.com/pluginfox/instagram-analytics-mcp.git
   cd instagram-analytics-mcp
   npm ci
   npm run build
   ```

2. **Get an access token** from the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) with these permissions: `instagram_basic`, `instagram_manage_insights`, `pages_read_engagement`, `pages_show_list`. Explorer tokens are short-lived, so generate a long-lived token for regular use. There is no automatic refresh, so replace it when it expires.

3. **Add it to your MCP client** (see below)

## Configuration

| Variable | Required | Default | Description |
|---|---|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | Yes | — | Facebook User Access Token with the permissions above |
| `INSTAGRAM_ACCOUNT_ID` | No | Auto-detected | Instagram Business Account ID |
| `INSTAGRAM_API_VERSION` | No | `v23.0` | Graph API version |
| `DEBUG` | No | — | Set to `instagram-analytics-mcp` for debug logs |

## MCP Client Setup

### Claude Code

```bash
claude mcp add instagram-analytics -e INSTAGRAM_ACCESS_TOKEN=your_token_here -- node /absolute/path/to/instagram-analytics-mcp/dist/index.js
```

### Claude Desktop

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "instagram-analytics": {
      "command": "node",
      "args": ["/absolute/path/to/instagram-analytics-mcp/dist/index.js"],
      "env": {
        "INSTAGRAM_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Tools

| Tool | Description | Required Params |
|---|---|---|
| `instagram_list_accounts` | List available Instagram Business accounts | — |
| `instagram_get_profile` | Get account profile info | — |
| `instagram_get_account_insights` | Get account-level analytics | `metrics`, `metric_type`, `period` |
| `instagram_list_media` | List recent media posts | — |
| `instagram_get_media_details` | Get details for a specific post | `media_id` |
| `instagram_get_media_insights` | Get insights for a specific post | `media_id`, `metrics` |
| `instagram_get_stories` | Get recent stories | — |
| `instagram_get_hashtag_search` | Search for a hashtag ID | `hashtag` |
| `instagram_get_hashtag_media` | Get media for a hashtag | `hashtag_id` |
| `instagram_get_content_publishing_limit` | Check publishing rate limits | — |
| `instagram_get_mentioned_media` | Get media where account is tagged | — |

Most tools accept an optional `account_id`. Without one, the server uses `INSTAGRAM_ACCOUNT_ID`, or the only connected account if there is just one.

List tools return `{ data, paging }`. When `paging.has_next` is true, pass `paging.cursors.after` as the `after` parameter to get the next page.

## Prompts

| Prompt | Description |
|---|---|
| `analyze_instagram_performance` | Comprehensive account analysis |
| `compare_post_performance` | Compare recent posts |
| `get_audience_demographics` | Audience demographic breakdown |
| `setup_instagram` | Interactive setup guide |

## Security

- Access tokens are removed from tool output and error messages.
- The hashtag and tagged-media tools return captions written by other people. Treat them as untrusted, especially when this server runs alongside tools that can write or send data.

## Troubleshooting

### "Access token is invalid" or code 190

- The token has expired or is invalid. Generate a new one.

### "No Instagram Business accounts found"

- The account must be a Business or Creator account connected to a Facebook Page.

### Code 100 or "Unsupported metric"

- Some metrics are media-type specific (e.g., `ig_reels_avg_watch_time` only works for reels).

### Rate limits

- The server retries 429, 5xx and transient Graph API errors with exponential backoff.
- Quota errors (codes 4, 17, 32, 613) are returned immediately, because a short backoff cannot clear them.

## License

MIT

---

**Note**: This is an unofficial tool and is not affiliated with Meta or Instagram.
