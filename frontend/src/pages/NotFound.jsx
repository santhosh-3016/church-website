
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 relative overflow-hidden">
            {/* Decorative bg */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-church-lightblue/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-church-gold/5 rounded-full blur-3xl"></div>

            <div className="text-center space-y-6 relative z-10">
                {/* Big 404 */}
                <div className="relative">
                    <h1 className="text-[10rem] md:text-[14rem] font-heading font-bold leading-none bg-gradient-to-b from-primary/15 to-transparent bg-clip-text text-transparent select-none">
                        404
                    </h1>
                </div>

                <div className="-mt-16 relative z-10 space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading">
                        Page Not Found
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        The page you are looking for might have been removed, had its name changed,
                        or is temporarily unavailable.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <Button asChild size="lg" className="rounded-full px-8 bg-gradient-to-r from-church-navy to-church-blue hover:from-church-blue hover:to-church-navy shadow-md">
                            <Link to="/">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Link>
                        </Button>
                        <Button variant="outline" asChild size="lg" className="rounded-full px-8">
                            <Link to="/contact">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Contact Us
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
