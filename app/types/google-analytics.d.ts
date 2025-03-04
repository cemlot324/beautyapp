interface Window {
  gtag: (
    command: 'config' | 'event' | 'js',
    targetId: string,
    config?: {
      page_path?: string;
      page_title?: string;
      [key: string]: any;
    }
  ) => void;
} 