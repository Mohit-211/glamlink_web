declare module 'write-good' {
  interface WritegoodSuggestion {
    index: number;
    offset: number;
    reason: string;
  }

  function writeGood(text: string, options?: any): WritegoodSuggestion[];
  
  export = writeGood;
}