declare module '@vercel/analytics/react' {
  export interface AnalyticsProps {
    beforeSend?: (event: any) => any | false;
    debug?: boolean;
    mode?: 'production' | 'development';
  }

  export function Analytics(props?: AnalyticsProps): JSX.Element;
}

declare module '@vercel/speed-insights/next' {
  export interface SpeedInsightsProps {
    sampleRate?: number;
    debug?: boolean;
  }

  export function SpeedInsights(props?: SpeedInsightsProps): JSX.Element;
} 