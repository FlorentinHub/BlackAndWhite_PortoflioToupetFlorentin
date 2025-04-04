import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, GitFork, Code } from 'lucide-react';
import { Octokit } from '@octokit/rest';
import { supabase } from '../lib/supabase';

export default function ProjectDetails() {
  const { name } = useParams<{ name: string }>();
  const [repo, setRepo] = useState<any>(null);
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const octokit = new Octokit();
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
      <div className="max-w-4xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
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
                className="w-full h-full object-cover"
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
                      <i className={`devicon-${lang.toLowerCase()}-plain text-2xl mr-2`}></i>
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
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}