import { SectionConfig } from "../types";
import { Professional } from "@/lib/pages/for-professionals/types/professional";

interface SectionRendererProps {
  sections: SectionConfig[];
  professional: Professional;
}

export default function SectionRenderer({ sections, professional }: SectionRendererProps) {
  const getGridClasses = (nestedSections: SectionConfig[]) => {
    const columnCount = nestedSections.length;
    const firstSection = nestedSections[0];
    const breakPoint = firstSection?.break || 'md'; // Use first section's break or default to md

    return `grid-cols-1 ${breakPoint}:grid-cols-${columnCount}`;
  };

  const shouldRenderSection = (section: SectionConfig) => {
    return !section.condition || section.condition(professional);
  };

  const renderSingleSection = (section: SectionConfig) => {
    if (!shouldRenderSection(section) || !section.component) {
      return null;
    }

    const Component = section.component;
    const className = section.containerClassName || '';

    // Process props - call functions if they are functions
    const processedProps = section.props ?
      Object.fromEntries(
        Object.entries(section.props).map(([key, value]) => [
          key,
          typeof value === 'function' ? value(professional) : value
        ])
      ) : {};

    return (
      <div key={section.id} className={className}>
        <Component professional={professional} {...processedProps} />
      </div>
    );
  };

  const renderNestedSections = (nestedSections: SectionConfig[]) => {
    const filteredSections = nestedSections.filter(shouldRenderSection);

    if (filteredSections.length === 0) {
      return null;
    }

    const gridClasses = getGridClasses(filteredSections);
    const containerClassName = nestedSections.find(s => s.containerClassName)?.containerClassName || '';

    return (
      <div key={`nested-${filteredSections[0]?.id}`} className={containerClassName}>
        <div className={`grid gap-6 ${gridClasses}`}>
          {filteredSections.map((section) => {
            if (!section.component) return null;
            const Component = section.component;

            // Process props - call functions if they are functions
            const processedProps = section.props ?
              Object.fromEntries(
                Object.entries(section.props).map(([key, value]) => [
                  key,
                  typeof value === 'function' ? value(professional) : value
                ])
              ) : {};

            return (
              <div key={section.id}>
                <Component professional={professional} {...processedProps} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {sections.map((sectionItem) => {
        if (sectionItem.nested) {
          return renderNestedSections(sectionItem.nested);
        } else {
          return renderSingleSection(sectionItem);
        }
      })}
    </div>
  );
}