import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-6">Realty Estate</h3>
            <p className="text-neutral-400 mb-6">
              Discover Zambia's most extraordinary properties through our exclusive real estate platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/david.wantula.emert.makungu"
                target="_blank"
                rel="noopener noreferrer"
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
                href="https://instagram.com/david_wantula_emert_makungu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com/in/david-wantula-emert-makungu"
                target="_blank"
                rel="noopener noreferrer"
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
                  <div className="text-neutral-400 hover:text-white transition-all cursor-pointer">Home</div>
                </Link>
              </li>
              <li>
                <Link href="/properties">
                  <div className="text-neutral-400 hover:text-white transition-all cursor-pointer">Properties</div>
                </Link>
              </li>
              <li>
                <Link href="/agents">
                  <div className="text-neutral-400 hover:text-white transition-all cursor-pointer">Agents</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-neutral-400 hover:text-white transition-all cursor-pointer">Contact</div>
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
                  City Apartments
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  Zambezi Riverfront Properties
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  Commercial Properties
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-all">
                  Safari Lodges
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
                  David Wantula Emert Makungu
                  <br />
                  Lusaka, Zambia
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">📞</span>
                <span>+260 964 391774</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span>info@realtyestate.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Realty Estate by David Wantula Emert Makungu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
