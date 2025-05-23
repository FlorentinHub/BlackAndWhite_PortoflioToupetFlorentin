import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Plus, Trash2, Eye, EyeOff, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Octokit } from '@octokit/rest';

interface ProjectDetails {
  repo_name: string;
  images: string[];
  languages: string[];
  isVisible: boolean;
}

export default function AdminPanel() {
  const [repos, setRepos] = useState<any[]>([]);
  const [projectDetails, setProjectDetails] = useState<Record<string, ProjectDetails>>({});
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [editingDetails, setEditingDetails] = useState<ProjectDetails | null>(null);
  const [capturingScreenshot, setCapturingScreenshot] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GitHub repos
        const octokit = new Octokit();
        const repoResponse = await octokit.repos.listForUser({
          username: 'FlorentinHub',
          sort: 'updated'
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

  const handleRepoSelect = (repoName: string) => {
    setSelectedRepo(repoName);
    setEditingDetails(projectDetails[repoName] || {
      repo_name: repoName,
      images: [],
      languages: [],
      isVisible: true
    });
  };

  const handleSave = async (newProject: ProjectDetails) => {
    const { data: existing, error: existingError } = await supabase
      .from('project_details')
      .select('id')
      .eq('repo_name', newProject.repo_name)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('project_details')
        .update({
          images: newProject.images,
          languages: newProject.languages,
          isVisible: newProject.isVisible
        })
        .eq('repo_name', newProject.repo_name);

      if (error) {
        console.error('Erreur lors de la mise à jour :', error);
      } else {
        console.log('Projet mis à jour :', data);
      }
    } else {
      const { data, error } = await supabase
        .from('project_details')
        .insert(newProject);

      if (error) {
        console.error('Erreur lors de la sauvegarde :', error);
      } else {
        console.log('Nouveau projet ajouté :', data);
      }
    }
  };

  const handleCaptureScreenshot = async () => {
    if (!selectedRepo || !editingDetails) return;

    setCapturingScreenshot(true);
    try {
      const selectedRepoData = repos.find(repo => repo.name === selectedRepo);
      const deployedUrl = selectedRepoData?.homepage || `https://florentinhub.github.io/${selectedRepo}`;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/capture-screenshot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: deployedUrl }),
      });

      const data = await response.json();

      if (data.url) {
        setEditingDetails({
          ...editingDetails,
          images: [...editingDetails.images, data.url],
        });
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      setCapturingScreenshot(false);
    }
  };

  const handleToggleVisibility = () => {
    if (!editingDetails) return;
    setEditingDetails({
      ...editingDetails,
      isVisible: !editingDetails.isVisible
    });
  };

  const handleAddImage = () => {
    if (!editingDetails) return;
    setEditingDetails({
      ...editingDetails,
      images: [...editingDetails.images, '']
    });
  };

  const handleAddLanguage = () => {
    if (!editingDetails) return;
    setEditingDetails({
      ...editingDetails,
      languages: [...editingDetails.languages, '']
    });
  };

  const handleRemoveImage = (index: number) => {
    if (!editingDetails) return;
    const newImages = [...editingDetails.images];
    newImages.splice(index, 1);
    setEditingDetails({
      ...editingDetails,
      images: newImages
    });
  };

  const handleRemoveLanguage = (index: number) => {
    if (!editingDetails) return;
    const newLanguages = [...editingDetails.languages];
    newLanguages.splice(index, 1);
    setEditingDetails({
      ...editingDetails,
      languages: newLanguages
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-12">
          <Settings className="w-10 h-10 mr-4 text-primary" />
          <h1 className="text-4xl font-bold">Admin Panel</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4">Repositories</h2>
            <div className="space-y-2">
              {repos.map((repo) => (
                <button
                  key={repo.name}
                  onClick={() => handleRepoSelect(repo.name)}
                  className={`w-full text-left p-3 rounded ${
                    selectedRepo === repo.name
                      ? 'bg-primary text-white'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{repo.name}</span>
                    {projectDetails[repo.name]?.isVisible === false && (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedRepo && editingDetails && (
            <div className="md:col-span-2 bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit Project Details</h2>
                <div className="flex gap-4">
                  <button
                    onClick={handleToggleVisibility}
                    className={`flex items-center px-4 py-2 rounded ${
                      editingDetails.isVisible
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white`}
                  >
                    {editingDetails.isVisible ? (
                      <>
                        <Eye className="w-5 h-5 mr-2" />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-5 h-5 mr-2" />
                        Hidden
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSave(editingDetails)}
                    className="flex items-center bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Images</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCaptureScreenshot}
                        disabled={capturingScreenshot}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        {capturingScreenshot ? 'Capturing...' : 'Capture Screenshot'}
                      </button>
                      <button
                        onClick={handleAddImage}
                        className="flex items-center text-primary hover:text-primary/90"
                      >
                        <Plus className="w-5 h-5 mr-1" />
                        Add Image
                      </button>
                    </div>
                  </div>
                  {editingDetails.images.map((image, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...editingDetails.images];
                          newImages[index] = e.target.value;
                          setEditingDetails({
                            ...editingDetails,
                            images: newImages
                          });
                        }}
                        className="flex-1 bg-white/10 p-2 rounded mr-2"
                        placeholder="Image URL"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Languages</h3>
                    <button
                      onClick={handleAddLanguage}
                      className="flex items-center text-primary hover:text-primary/90"
                    >
                      <Plus className="w-5 h-5 mr-1" />
                      Add Language
                    </button>
                  </div>
                  {editingDetails.languages.map((language, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={language}
                        onChange={(e) => {
                          const newLanguages = [...editingDetails.languages];
                          newLanguages[index] = e.target.value;
                          setEditingDetails({
                            ...editingDetails,
                            languages: newLanguages
                          });
                        }}
                        className="flex-1 bg-white/10 p-2 rounded mr-2"
                        placeholder="Language name"
                      />
                      <button
                        onClick={() => handleRemoveLanguage(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}