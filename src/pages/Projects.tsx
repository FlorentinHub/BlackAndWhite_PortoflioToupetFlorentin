import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';
import { Octokit } from '@octokit/rest';
import { supabase } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';

interface Repository {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

interface ProjectDetails {
  repo_name: string;
  images: string[];
  languages: string[];
}

export default function Projects() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [projectDetails, setProjectDetails] = useState<Record<string, ProjectDetails>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GitHub repos
        const octokit = new Octokit();
        const repoResponse = await octokit.repos.listForUser({
          username: 'FlorentinHub',
          sort: 'updated',
          per_page: 6
        });

        // Fetch project details from Supabase
        const { data: details } = await supabase
          .from('project_details')
          .select('*');

        const detailsMap = (details || []).reduce((acc: Record<string, ProjectDetails>, detail) => {
          acc[detail.repo_name] = detail;
          return acc;
        }, {});

        setRepos(repoResponse.data);
        setProjectDetails(detailsMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="flex items-center justify-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FolderGit2 className="w-10 h-10 mr-4 text-primary" />
          <h1 className="text-4xl font-bold">Mes Projets</h1>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {repos.map((repo) => (
              <motion.div
                key={repo.name}
                variants={item}
              >
                <ProjectCard
                  repo={repo}
                  projectDetails={projectDetails[repo.name]}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}