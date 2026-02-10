import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = () => {
  return (
    <div className="flex items-center justify-center gap-4 py-16 border-t border-border/50 mt-16">
      <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled>
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-primary bg-primary/5 rounded-full">
          1
        </span>
        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors cursor-pointer">
          2
        </span>
        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors cursor-pointer">
          3
        </span>
        <span className="text-muted-foreground">...</span>
        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors cursor-pointer">
          12
        </span>
      </div>
      
      <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground transition-colors">
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
