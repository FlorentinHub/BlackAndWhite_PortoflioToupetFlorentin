import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';

export default function News() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <Newspaper className="w-10 h-10 mr-4 text-primary" />
          <h1 className="text-4xl font-bold">Latest News</h1>
        </div>
        <div className="space-y-8">
          <article className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4">Latest Announcement</h2>
            <p className="mb-4">Content of the latest news article goes here.</p>
            <div className="text-sm text-gray-400">Posted on January 1, 2025</div>
          </article>
          <article className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4">Previous Update</h2>
            <p className="mb-4">Content of the previous news article goes here.</p>
            <div className="text-sm text-gray-400">Posted on December 31, 2024</div>
          </article>
        </div>
      </div>
    </motion.div>
  );
}