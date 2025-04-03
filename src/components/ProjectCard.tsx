import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Code, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  repo: {
    name: string;
    description: string;
    languages: string[];
    stargazers_count: number;
    forks_count: number;
    html_url: string;
  };
  projectDetails?: {
    images: string[];
    languages: string[];
  };
}

const languageIcons: Record<string, string> = {
  JavaScript: 'devicon-javascript-plain',
  TypeScript: 'devicon-typescript-plain',
  Python: 'devicon-python-plain',
  Java: 'devicon-java-plain',
  Ruby: 'devicon-ruby-plain',
  PHP: 'devicon-php-plain',
  'C++': 'devicon-cplusplus-plain',
  'C#': 'devicon-csharp-plain',
  Go: 'devicon-go-plain',
  Rust: 'devicon-rust-plain',
  Swift: 'devicon-swift-plain',
  Kotlin: 'devicon-kotlin-plain',
  React: 'devicon-react-original',
  Vue: 'devicon-vuejs-plain',
  Angular: 'devicon-angularjs-plain',
  Node: 'devicon-nodejs-plain',
};

export default function ProjectCard({ repo, projectDetails }: ProjectCardProps) {
  const hasImages = projectDetails?.images && projectDetails.images.length > 0;
  const languages = projectDetails?.languages || [];

  return (
    <motion.div
      className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
    >
      <Link to={`/projects/${repo.name}`} className="block">
        {hasImages && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={projectDetails.images[0]}
              alt={repo.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            {repo.name}
          </h2>
          <p className="mb-4 text-gray-300">{repo.description || 'No description available'}</p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            {languages.map((lang) => (
              <i
                key={lang}
                className={`${languageIcons[lang]} text-2xl text-gray-400 hover:text-white transition-colors`}
                title={lang}
              ></i>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                {repo.stargazers_count}
              </span>
              <span className="flex items-center">
                <GitFork className="w-4 h-4 mr-1" />
                {repo.forks_count}
              </span>
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}