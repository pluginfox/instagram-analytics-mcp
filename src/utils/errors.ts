/**
 * Error type for Instagram Graph API failures
 */

export class InstagramApiError extends Error {
  public readonly apiCode?: number;
  public readonly apiType?: string;
  public readonly fbtrace_id?: string;

  constructor(opts: {
    message: string;
    code?: number;
    type?: string;
    fbtrace_id?: string;
  }) {
    const parts = [opts.message];
    if (opts.code) parts.push(`(Code: ${opts.code})`);
    if (opts.fbtrace_id) parts.push(`[Trace: ${opts.fbtrace_id}]`);

    super(parts.join(' '));
    this.name = 'InstagramApiError';
    this.apiCode = opts.code;
    this.apiType = opts.type;
    this.fbtrace_id = opts.fbtrace_id;
  }
}
