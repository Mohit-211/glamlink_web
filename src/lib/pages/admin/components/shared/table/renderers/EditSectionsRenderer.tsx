interface EditSectionsRendererProps {
  row: any;
  column: any;
  value: any;
  onEditSections?: (row: any) => void;
}

export default function EditSectionsRenderer({ row, onEditSections }: EditSectionsRendererProps) {
  return (
    <button
      onClick={() => onEditSections?.(row)}
      className="inline-flex items-center px-3 py-1.5 border border-glamlink-teal text-glamlink-teal rounded-md text-sm font-medium hover:bg-glamlink-teal hover:text-white transition-colors"
    >
      Edit Sections
    </button>
  );
}
