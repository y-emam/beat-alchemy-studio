
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Dashboard should not be visible in the nav menu
  const isAdmin = localStorage.getItem('adminAuthenticated') === 'true';
  const showDashboard = isAdmin;

  return (
    <motion.header 
      className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <motion.span 
            className="text-primary text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            BEAT ALCHEMY
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-foreground hover:text-primary transition-colors ${
              location.pathname === '/' ? 'text-primary font-medium' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            to="/browse" 
            className={`text-foreground hover:text-primary transition-colors ${
              location.pathname === '/browse' ? 'text-primary font-medium' : ''
            }`}
          >
            Browse Beats
          </Link>
          {showDashboard && (
            <Link 
              to="/dashboard" 
              className={`text-foreground hover:text-primary transition-colors ${
                location.pathname === '/dashboard' ? 'text-primary font-medium' : ''
              }`}
            >
              Dashboard
            </Link>
          )}
          <Button variant="default" asChild>
            <Link to="/contact">
              <Mail className="mr-2" size={16} />
              Contact
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-background border-t border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-foreground hover:text-primary transition-colors py-2 ${
                location.pathname === '/' ? 'text-primary font-medium' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/browse" 
              className={`text-foreground hover:text-primary transition-colors py-2 ${
                location.pathname === '/browse' ? 'text-primary font-medium' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Beats
            </Link>
            {showDashboard && (
              <Link 
                to="/dashboard" 
                className={`text-foreground hover:text-primary transition-colors py-2 ${
                  location.pathname === '/dashboard' ? 'text-primary font-medium' : ''
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <Button variant="default" className="w-full" asChild>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Mail className="mr-2" size={16} />
                Contact
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
