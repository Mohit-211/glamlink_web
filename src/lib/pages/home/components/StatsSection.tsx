import { StatsSectionProps } from "../config";
import { SectionContainer, getStatCardClass } from "./ui";

export default function StatsSection({ props }: { props: StatsSectionProps }) {
  if (!props) {
    return null;
  }
  
  const { state } = props;
  const { stats } = state;
  
  if (!stats || stats.length === 0) {
    return null;
  }
  
  return (
    <SectionContainer className="bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div 
            key={stat.id} 
            className={`${getStatCardClass(index)} p-6 rounded-xl text-white text-center transform hover:scale-105 transition-transform duration-300`}
          >
            <div className="text-3xl md:text-4xl font-bold mb-2">
              {stat.value}
            </div>
            <div className="text-lg font-semibold mb-1">
              {stat.label}
            </div>
            {stat.description && (
              <div className="text-sm opacity-90">
                {stat.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}