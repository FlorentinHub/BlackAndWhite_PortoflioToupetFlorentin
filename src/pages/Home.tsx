import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Mail, Briefcase, BookOpen, Award, Coffee, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import 'devicon/devicon.min.css';

interface ProjectDetails {
  id: string;
  repo_name: string;
  images: string[];
  languages: string[];
  isVisible: boolean;
}

const languageIcons: Record<string, string> = {
  JavaScript: 'devicon-javascript-plain colored',
  TypeScript: 'devicon-typescript-plain colored',
  Python: 'devicon-python-plain colored',
  Java: 'devicon-java-plain colored',
  Ruby: 'devicon-ruby-plain colored',
  PHP: 'devicon-php-plain colored',
  'C++': 'devicon-cplusplus-plain colored',
  'C#': 'devicon-csharp-plain colored',
  Go: 'devicon-go-plain colored',
  Rust: 'devicon-rust-plain colored',
  Swift: 'devicon-swift-plain colored',
  Kotlin: 'devicon-kotlin-plain colored',
  React: 'devicon-react-original colored',
  Vue: 'devicon-vuejs-plain colored',
  Angular: 'devicon-angularjs-plain colored',
  Node: 'devicon-nodejs-plain colored',
};

const skillCategories = {
  Frontend: {
    icon: '🎨',
    description: 'Développement d\'interfaces utilisateur modernes et réactives',
  },
  Backend: {
    icon: '⚙️',
    description: 'Construction de serveurs robustes et évolutifs',
  },
  Other: {
    icon: '🛠️',
    description: 'Autres technologies et outils de développement',
  },
};

export default function Home() {
  const [text, setText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [skills, setSkills] = useState<{ name: string; items: string[] }[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const fullText = 'Bienvenue sur mon Portfolio';

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setIsTypingComplete(true);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('project_details')
        .select('*')
        .eq('isVisible', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      if (data) {
        setProjects(data);

        const allLanguages = data.flatMap(project => project.languages);
        const uniqueLanguages = Array.from(new Set(allLanguages));

        const frontendLangs = uniqueLanguages.filter(lang =>
          ['JavaScript', 'TypeScript', 'React', 'Vue', 'Angular'].includes(lang)
        );
        const backendLangs = uniqueLanguages.filter(lang =>
          ['Python', 'Node', 'Java', 'Ruby', 'PHP', 'Go'].includes(lang)
        );
        const otherLangs = uniqueLanguages.filter(lang =>
          !frontendLangs.includes(lang) && !backendLangs.includes(lang)
        );

        setSkills([
          { name: 'Frontend', items: frontendLangs },
          { name: 'Backend', items: backendLangs },
          { name: 'Other', items: otherLangs }
        ]);
      }
    };

    fetchProjects();
  }, []);

  const cursorVariants = {
    blinking: {
      opacity: [0, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse"
      }
    },
    stopped: {
      opacity: 1,
      scale: 1,
      width: "3px",
      height: "24px",
      backgroundColor: "#fff",
      transition: { duration: 0.3 }
    },
    dot: {
      scale: 1,
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#fff",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 0.1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.7 }}
        className="absolute top-20 left-0 w-2/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-40 right-20 w-72 h-72 rounded-full bg-primary blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-40 left-20 w-96 h-96 rounded-full bg-primary blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 relative">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Code2 className="w-16 h-16 mx-auto mb-8 text-primary relative z-10" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full transform scale-150" />
            </motion.div>

            <motion.h1
              className="text-5xl font-bold mb-6 min-h-[4rem] flex items-center justify-center gap-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {text}
              <AnimatePresence>
                <motion.span
                  key="cursor"
                  variants={cursorVariants}
                  initial="blinking"
                  animate={isTypingComplete ? "dot" : "stopped"}
                  exit="dot"
                  className="inline-block"
                />
              </AnimatePresence>
            </motion.h1>

            <motion.p
              className="text-xl mb-8 text-gray-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Développeur Full Stack passionné par la création d'applications web modernes
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex justify-center gap-4 mb-12"
            >
              <Link
                to="/contact"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Me Contacter
              </Link>
            </motion.div>
          </div>

          {/* Featured Projects */}
          <motion.section
            className="mb-16 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Briefcase className="w-8 h-8" />
              Projets à la Une
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Link
                  to={`/projects/${project.repo_name}`}
                  key={project.id}
                  className="group relative overflow-hidden rounded-xl bg-white/5 transform hover:scale-105 transition-all duration-500"
                >
                  {project.images && project.images[0] && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={project.images[0]}
                        alt={project.repo_name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold mb-2 text-white">{project.repo_name}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.languages.map((lang, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md"
                          >
                            {languageIcons[lang] && (
                              <i className={`${languageIcons[lang]} text-white text-sm`}></i>
                            )}
                            <span className="text-xs text-white">{lang}</span>
                          </div>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg group-hover:bg-white/30 transition-all">
                        <Github className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Skills Section */}
          <motion.section
            className="mb-16 relative"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg"
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(0,0,0,0.05) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)',
                    'linear-gradient(45deg, rgba(0,0,0,0.05) 100%, transparent 50%, rgba(0,0,0,0.05) 0%)',
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  Compétences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {skills.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className={`relative group cursor-pointer overflow-hidden rounded-lg backdrop-blur-sm transition-all duration-300 ${
                        selectedSkill === category.name
                          ? 'bg-white/10 ring-2 ring-primary'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedSkill(
                        selectedSkill === category.name ? null : category.name
                      )}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{skillCategories[category.name].icon}</span>
                            <h3 className="text-xl font-semibold">{category.name}</h3>
                          </div>
                          <ChevronRight
                            className={`w-5 h-5 transform transition-transform ${
                              selectedSkill === category.name ? 'rotate-90' : 'group-hover:translate-x-1'
                            }`}
                          />
                        </div>
                        <p className="text-sm text-gray-400 mb-4">
                          {skillCategories[category.name].description}
                        </p>
                        <motion.div
                          initial={false}
                          animate={{
                            height: selectedSkill === category.name ? 'auto' : 0,
                            opacity: selectedSkill === category.name ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                            {category.items.map((skill) => (
                              <div
                                key={skill}
                                className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                {languageIcons[skill] ? (
                                  <i className={`${languageIcons[skill]} text-2xl`}></i>
                                ) : (
                                  <Award className="w-6 h-6 text-primary" />
                                )}
                                <span className="text-sm">{skill}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Call to Action */}
          <motion.div
            className="text-center bg-white/5 rounded-lg p-8 backdrop-blur-sm relative overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
            <Coffee className="w-12 h-12 mx-auto mb-4 text-primary relative z-10" />
            <h2 className="text-2xl font-bold mb-4 relative z-10">Intéressé par une collaboration ?</h2>
            <p className="mb-6 text-gray-400 relative z-10">
              Je suis toujours ouvert aux nouvelles opportunités et projets passionnants.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 relative z-10"
            >
              <Mail className="w-5 h-5" />
              Discutons de votre projet
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}