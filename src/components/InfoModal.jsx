"use client";
import React from "react";
import { createPortal } from "react-dom";

export default function InfoModal({ open, onClose, title, icon, children }) {
  const [closing, setClosing] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const dialogRef = React.useRef(null);
  const openerRef = React.useRef(null);
  
  // S'assurer que le composant est monté côté client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Mémoriser l'élément actif à l'ouverture pour retour focus
  React.useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      // focus premier élément focusable ou la boîte
      setTimeout(() => {
        const root = dialogRef.current;
        if (!root) return;
        const focusable = root.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        (focusable || root).focus();
      }, 0);
    } else if (openerRef.current && openerRef.current.focus) {
      openerRef.current.focus();
    }
  }, [open]);
  
  // Bloquer le scroll quand le modal est ouvert
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    // Nettoyer au démontage
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [open]);
  
  // Animation de fermeture fluide
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 320);
  };

  // Fermer via ESC et piéger le focus dans le modal
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); handleClose(); }
      if (e.key === 'Tab') {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // Après déclaration de tous les hooks: on peut court-circuiter le rendu
  if (!mounted || (!open && !closing)) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* Fond blur animé sur toute la page */}
      <div 
        className={`absolute inset-0 w-full h-full transition-all duration-500 ${closing ? 'opacity-0' : 'opacity-100'}`}
        style={{
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)', 
          background: 'rgba(14, 65, 117, 0.15)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }} 
        onClick={handleClose}
      />
      
      {/* Container du modal centré */}
    <div className="relative flex items-center justify-center min-h-screen p-4" style={{zIndex: 1}}>
        <div
      className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 relative ${closing ? 'modalOut' : 'modalIn'}`}
          style={{
            animation: `${closing ? 'modalOut' : 'modalIn'} 0.4s cubic-bezier(.44,.95,.6,1.15) both`,
          }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={dialogRef}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton de fermeture stylé */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-xl font-bold focus:outline-none transition-all duration-200"
            aria-label="Fermer"
          >
            ×
          </button>
          
          {/* Titre avec icône pour cohérence visuelle */}
          <h2 id="modal-title" className="text-3xl font-bold mb-8 text-center leading-tight flex items-center justify-center gap-4 pt-2">
            {icon && <span className="text-4xl">{icon}</span>}
            <span>{title}</span>
          </h2>
          
          {/* Contenu du modal */}
          <div className="text-gray-700 text-lg space-y-6 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
      
      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(0.85) translateY(40px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modalOut {
          0% { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.85) translateY(40px); }
        }
      `}</style>
    </div>
  );

  // Utiliser createPortal pour rendre le modal dans le body
  return createPortal(modalContent, document.body);
}
