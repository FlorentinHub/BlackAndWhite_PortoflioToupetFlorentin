import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState('');
  const fullText = 'Bienvenue sur mon Portfolio';
  
  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Code2 className="w-16 h-16 mx-auto mb-8 text-primary" />
        </motion.div>
        
        <motion.h1 
          className="text-5xl font-bold mb-6 min-h-[4rem]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {text}
          <span className="animate-pulse">|</span>
        </motion.h1>

        <motion.p 
          className="text-xl mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Mon profil GitHub, mais plus beau
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white/5 p-8 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4">Mes Projets</h2>
            <p>Découvrez mes dernières réalisations et projets en cours.</p>
          </div>
          <div className="bg-white/5 p-8 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4">Mon Actualité</h2>
            <p>Suivez mes dernières activités et publications professionnelles.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}