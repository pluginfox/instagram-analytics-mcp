/**
 * Keeps credentials out of anything returned to the MCP client (and so the model).
 * Graph API paging URLs embed the access token, so only cursors are passed through.
 */

const TOKEN_IN_TEXT = /access_token=[^&\s"']+/g;

export function redactText(text: string): string {
  return text.replace(TOKEN_IN_TEXT, 'access_token=[REDACTED]');
}

function replacer(key: string, value: unknown): unknown {
  if (key === 'access_token') return undefined;
  if (typeof value === 'string') return redactText(value);
  if (key === 'paging' && value && typeof value === 'object') {
    const paging = value as { cursors?: unknown; next?: unknown };
    return { cursors: paging.cursors, has_next: Boolean(paging.next) };
  }
  return value;
}

export function serializeForClient(data: unknown): string {
  return JSON.stringify(data, replacer, 2);
}
