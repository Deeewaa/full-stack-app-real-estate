import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-6">EstateElite</h3>
            <p className="text-neutral-400 mb-6">
              Discover the world's most extraordinary properties through our exclusive platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/">
                  <a className="text-neutral-400 hover:text-white transition-all">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/properties">
                  <a className="text-neutral-400 hover:text-white transition-all">Properties</a>
                </Link>
              </li>
              <li>
                <Link href="/agents">
                  <a className="text-neutral-400 hover:text-white transition-all">Agents</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-400 hover:text-white transition-all">Contact</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Property Types</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  Luxury Homes
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  Penthouses
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  Waterfront Properties
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  Historic Estates
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  International Villas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Us</h4>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-start">
                <span className="mr-3 mt-1">📍</span>
                <span>
                  1234 Luxury Lane, Suite 500
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">📞</span>
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span>info@estateelite.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>&copy; {new Date().getFullYear()} EstateElite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
