
import { Link } from "react-router-dom";
import { Github, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-muted mt-auto py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-racing-red">CarPassionHub</h3>
            <p className="text-muted-foreground">
              La piattaforma definitiva per gli appassionati di auto.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-racing-red transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-racing-red transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-racing-red transition"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Esplora</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/garage"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Garage Virtuale
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Eventi Track Day
                </Link>
              </li>
              <li>
                <Link
                  to="/roads"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Strade Panoramiche
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/auth"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Accedi
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Profilo
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Registrati
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legali</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Termini di Servizio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-racing-red transition"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CarPassionHub. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
