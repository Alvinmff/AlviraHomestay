declare global {
  interface Window {
    tiktokEmbed?: {
      render: () => void;
    };
  }
}

export {};
