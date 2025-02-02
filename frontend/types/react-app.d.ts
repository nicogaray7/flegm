import { ReactNode } from 'react';
import { ReactElement, JSXElementConstructor } from 'react';

declare module '@vercel/analytics/react' {
  export interface AnalyticsProps {}
  export function Analytics(props: AnalyticsProps): ReactElement;
}

declare module '@vercel/speed-insights/next' {
  export interface SpeedInsightsProps {}
  export function SpeedInsights(props: SpeedInsightsProps): ReactElement;
}

declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactNode;
  }
}

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface IntrinsicElements {
      'ins': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'className'?: string;
        'style'?: React.CSSProperties;
        'data-ad-client'?: string;
        'data-ad-slot'?: string;
        'data-ad-format'?: string;
        'data-full-width-responsive'?: string;
      };
    }
  }
} 