import { Menu, X } from "lucide-react";
import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import logo from '@/assets/logo.svg';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="text-text-inverse
        bg-gray-100 shadow-md sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className=" hover:bg-background-dark-gradient transition-shadow  cursor-pointer rounded-lg mr-3">
              <img src={logo} alt="Logo" className="w-10 h-10" />
              
            </div>
            <a href="/"
            
            >
               <span className="text-2xl font-bold text-gray-900">
              EduPlatform
            </span>
            </a>

          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#Cursos"
              className="text-text-primary hover:text-red-500 font-medium transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("Cursos");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}>
              Cursos
            </a>
            <a
              href="#precios"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("precios");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              >
              Precios
            </a>
            <a
              href="#instructores"
              className="text-gray-700 hover:text-red-500 font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("instructores");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
                setIsMenuOpen(false);
              }}

              >
              Instructores
            </a>
            <div className="flex items-center space-x-4">
              <a
                href="#testimonios"
                className="text-gray-700 hover:text-red-500 font-medium transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("testimonios");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                >
                Testimonios
              </a>
              <Link
                to="/authentication"
                className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-lg hover:shadow-xl">
                Empezar ahora
              </Link>
            </div>
          </div>
          
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#Cursos"
                className="block px-3 py-2 text-gray-700 font-medium cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("Cursos");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}>
                Cursos
              </a>
              <a
                href="#precios"
                className="block px-3 py-2 text-gray-700 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("precios");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}>

                Precios
              </a>
              <a
                href="#instructores"
                className="block px-3 py-2 text-gray-700 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("instructores");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMenuOpen(false);
                }}
                >
                Instructores
              </a>
              <div className="px-3 py-2 space-y-2">
                <a
                  href="#testimonios"
                  className="block text-gray-700 font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("testimonios");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                    setIsMenuOpen(false);
                  }}>
                  Testimonios
                </a>
                <Link
                  to="authentication"
                  className="block bg-red-500 text-white px-4 py-2 rounded-lg text-center font-semibold">
                  Empezar ahora
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
