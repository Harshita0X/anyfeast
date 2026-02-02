import { Search, Mic, Camera, Calendar, User, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground text-lg">🍽️</span>
            </div>
            <span className="font-bold text-xl text-foreground">AnyFeast</span>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Recipe
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Shop
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Festivals & Occasions
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Blog
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Our Story
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:block">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:block">
              <Camera className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:block">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <User className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                17
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
