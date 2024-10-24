declare module 'aos' {
  interface AosOptions {
    duration?: number;
    delay?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
  }

  export function init(options?: AosOptions): void;
}
