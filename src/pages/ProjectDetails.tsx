import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, GitFork, Code } from 'lucide-react';
import { Octokit } from '@octokit/rest';
import { supabase } from '../lib/supabase';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes

export default function ProjectDetails() {
  const { name } = useParams<{ name: string }>();
  const [repo, setRepo] = useState<any>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const octokit = new Octokit({
          auth: import.meta.env.VITE_GITHUB_TOKEN,
        });
        const [repoResponse, { data: details }] = await Promise.all([
          octokit.repos.get({
            owner: 'FlorentinHub',
            repo: name!
          }),
          supabase
            .from('project_details')
            .select('*')
            .eq('repo_name', name)
            .maybeSingle()
        ]);

        setRepo(repoResponse.data);
        setProjectDetails(details);
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchData();
    }
  }, [name]);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const showNextImage = () => {
    if (currentImageIndex < projectDetails?.images?.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const showPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/projects" className="text-primary hover:underline">
            Return to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto hover:text-black">
        <Link
          to="/projects"
          className="inline-flex items-center text-gray-400 hover:text-black mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to projects
        </Link>

        <div className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm">
          {projectDetails?.images && projectDetails.images.length > 0 && (
            <div className="relative h-96">
              <img
                src={projectDetails.images[0]}
                alt={repo.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => openModal(0)}
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center">
              <Code className="w-8 h-8 mr-3" />
              {repo.name}
            </h1>

            <p className="text-xl text-gray-300 mb-8">{repo.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-4">
                  {projectDetails?.languages?.map((lang: string) => (
                    <div
                      key={lang}
                      className="flex items-center bg-white/10 px-4 py-2 rounded"
                    >
                      {languageIcons[lang] ? (
                        <i
                          className={`${languageIcons[lang]} text-2xl mr-2`}
                        ></i>
                      ) : (
                        <i
                          className={`devicon-${lang.toLowerCase()}-plain text-2xl mr-2`}
                        ></i>
                      )}
                      {lang}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Statistics</h2>
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <Star className="w-6 h-6 mr-2" />
                    <span className="text-xl">{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center">
                    <GitFork className="w-6 h-6 mr-2" />
                    <span className="text-xl">{repo.forks_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {projectDetails?.images && projectDetails.images.length > 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {projectDetails.images.slice(1).map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${repo.name} screenshot ${index + 2}`}
                      className="rounded-lg w-full h-48 object-cover cursor-pointer"
                      onClick={() => openModal(index + 1)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div
              className="relative bg-white p-4 rounded-lg max-w-3xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="relative">
                {currentImageIndex > 0 && (
                  <button
                    onClick={showPrevImage}
                    className="absolute left-[-3rem] top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {currentImageIndex < projectDetails.images.length - 1 && (
                  <button
                    onClick={showNextImage}
                    className="absolute right-[-3rem] top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                <img
                  src={projectDetails.images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="mx-auto max-h-[80vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
