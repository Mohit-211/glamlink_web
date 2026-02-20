"use client";

interface Tip {
  number?: string | number;
  title: string;
  content: string;
  // Typography for tip title
  titleFontSize?: string;
  titleFontFamily?: string;
  titleFontWeight?: string;
  titleColor?: string;
}

interface NumberedTipsProps {
  tips?: Tip[];
  title?: string;
  displayNumbers?: boolean;
  className?: string;
  // Typography for section title
  titleFontSize?: string;
  titleFontFamily?: string;
  titleFontWeight?: string;
  titleColor?: string;
  titleAlignment?: 'left' | 'center' | 'right';
}

export default function NumberedTips({
  tips,
  title,
  displayNumbers = true,
  className = "",
  // Section title typography
  titleFontSize,
  titleFontFamily,
  titleFontWeight,
  titleColor,
  titleAlignment
}: NumberedTipsProps) {
  if (!tips || tips.length === 0) return null;

  const tipsTitle = title ?
    title.replace("{count}", tips.length.toString()) :
    `${tips.length} THINGS YOU SHOULD KNOW`;

  return (
    <div className={`rounded-lg p-6 ${className}`}>
      <h3 className={`
        ${titleFontSize || 'text-xl'}
        ${titleFontFamily || 'font-sans'}
        ${titleFontWeight || 'font-bold'}
        ${titleColor || 'text-gray-900'}
        ${titleAlignment === 'center' ? 'text-center' : titleAlignment === 'right' ? 'text-right' : 'text-left'}
        mb-4
      `}>{tipsTitle}</h3>
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-3 items-start">
            {displayNumbers && (
              <span className="hidden sm:block text-2xl font-bold text-glamlink-purple flex-shrink-0">
                {tip.number || index + 1}
              </span>
            )}
            <div>
              <h4 className={`
                ${tip.titleFontSize || 'text-base'}
                ${tip.titleFontFamily || 'font-sans'}
                ${tip.titleFontWeight || 'font-semibold'}
                ${tip.titleColor || 'text-gray-900'}
                mb-1
              `}>{tip.title}</h4>
              <p className="text-base text-gray-900">{tip.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}