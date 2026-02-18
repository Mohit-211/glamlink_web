import Link from "next/link";
import Image from "next/image";
import { FeaturedProjectsProps } from "../config";
import { SectionContainer, SectionHeader, getProjectTechBadgeClass } from "./ui";
import { EmptyState } from "@/lib/components/ui/EmptyState";

export default function FeaturedProjects({ props }: { props: FeaturedProjectsProps }) {
  if (!props) {
    return null;
  }
  
  const { state, handlers } = props;
  const { projects, isLoading } = state;
  
  if (!projects || projects.length === 0) {
    return (
      <SectionContainer className="bg-gray-50 dark:bg-gray-900">
        <SectionHeader 
          title="Featured Projects" 
          subtitle="Discover our latest work"
        />
        <EmptyState message="No featured projects available yet" />
      </SectionContainer>
    );
  }
  
  return (
    <SectionContainer className="bg-gray-50 dark:bg-gray-900">
      <SectionHeader 
        title="Featured Projects" 
        subtitle="Discover how our built applications have solved real-world problems"
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => handlers?.onProjectClick(project.id)}
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
              {project.imageUrl ? (
                <Image 
                  src={project.imageUrl} 
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getProjectTechBadgeClass(tech)}`}
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="flex gap-4">
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Demo →
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:underline text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <button
          onClick={handlers?.onViewAllClick}
          className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300"
        >
          View All Projects
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </SectionContainer>
  );
}