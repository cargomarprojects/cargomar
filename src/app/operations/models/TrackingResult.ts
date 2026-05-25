
export interface TrackingResult {
  Carrier: string | null;   // Carrier name, or null if unrecognised
  Url: string;              // Fully resolved tracking URL — open this in browser
  IsFallback: boolean;      // true → carrier not matched, track-trace.com returned
}
