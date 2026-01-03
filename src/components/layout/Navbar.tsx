import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HardDrive, BookOpen, Play, BarChart3 } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: HardDrive },
    { path: '/simulator', label: 'Simulator', icon: Play },
    { path: '/theory', label: 'Theory', icon: BookOpen },
    { path: '/compare', label: 'Compare', icon: BarChart3 },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <HardDrive className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg hidden sm:block">
              <span className="text-foreground">Disk</span>
              <span className="text-primary">Scheduler</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
