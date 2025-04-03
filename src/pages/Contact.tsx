import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-12"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-center">
              <Mail className="w-6 h-6 mr-4 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Email</h2>
                <p>contact@example.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-6 h-6 mr-4 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Phone</h2>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-6 h-6 mr-4 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Address</h2>
                <p>123 Main Street, City, Country</p>
              </div>
            </div>
          </div>
          <form className="space-y-6">
            <div>
              <label className="block mb-2">Name</label>
              <input 
                type="text" 
                className="w-full p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20"
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input 
                type="email" 
                className="w-full p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20"
              />
            </div>
            <div>
              <label className="block mb-2">Message</label>
              <textarea 
                className="w-full p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20" 
                rows={4}
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}