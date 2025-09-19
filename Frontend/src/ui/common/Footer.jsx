import React from "react";
import {
  GraduationCap,
  MessageCircle,
  Users,
  Star,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="bg-gray-900 p-2 rounded-lg mr-3">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EduPlatform</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              La plataforma de aprendizaje donde pagas solo por lo que
              necesitas. Sin suscripciones, sin compromisos.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="text-gray-400 hover:text-white  transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-lg">Plataforma</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="Cursos"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Explorar cursos
                </Link>
              </li>
              <li>
                <a
                  href="#precios"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("precios")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Precio
                </a>
              </li>
              <li>
                <a
                  href="#instructores"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("instructores")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Instructores
                </a>
              </li>
              <li>
                <a
                  href="#testimonios"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("testimonios")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Testimonios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-6 text-lg">Soporte</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  to="centro-ayuda"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link
                  to="contacto"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  to="terminos-de-uso"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link
                  to="politica-de-privacidad"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block">
                  Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 EduPlatform. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span>Hecho con ❤️ para estudiantes ambiciosos</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
