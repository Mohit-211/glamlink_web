interface ViewButtonRendererProps {
  row: any;
  column: {
    key: string;
    buttonText?: string;
    [key: string]: any;
  };
  onMagazineView?: (row: any) => void;
  onDigitalView?: (row: any) => void;
  onEditThumbnails?: (row: any) => void;
}

export default function ViewButtonRenderer({ row, column, onMagazineView, onDigitalView, onEditThumbnails }: ViewButtonRendererProps) {
  const buttonText = column.buttonText || 'View';

  const handleClick = () => {
    if (column.key === 'magazineView' && onMagazineView) {
      onMagazineView(row);
    } else if (column.key === 'digitalView' && onDigitalView) {
      onDigitalView(row);
    } else if (column.key === 'thumbnails' && onEditThumbnails) {
      onEditThumbnails(row);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      {buttonText}
    </button>
  );
}
