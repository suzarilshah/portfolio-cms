'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

/**
 * OfflineIndicator Component
 *
 * Shows a notification when the user loses internet connection.
 * Automatically hides when connection is restored.
 */
export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      // Hide the "restored" message after 3 seconds
      setTimeout(() => setShowRestored(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Offline indicator */}
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center"
        >
          <div className="m-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-full shadow-lg shadow-red-500/25 flex items-center gap-3">
            <WifiOff className="w-5 h-5 animate-pulse" />
            <span className="font-medium">You're offline</span>
            <span className="text-white/80 text-sm hidden sm:inline">
              • Check your connection
            </span>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Connection restored indicator */}
      {isOnline && showRestored && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center"
        >
          <div className="m-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full shadow-lg shadow-green-500/25 flex items-center gap-3">
            <Wifi className="w-5 h-5" />
            <span className="font-medium">Back online</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
