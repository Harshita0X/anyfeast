import { Banknote, Shield, Truck } from "lucide-react";

const TrustFooter = () => {
  return (
    <footer className="bg-card border-t border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="trust-badge">
            <Banknote className="w-5 h-5" />
            <span>Cash On Delivery</span>
          </div>
          <div className="trust-badge">
            <Shield className="w-5 h-5" />
            <span>100% Secure Payments</span>
          </div>
          <div className="trust-badge">
            <Truck className="w-5 h-5" />
            <span>Free Delivery on First Order</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TrustFooter;
