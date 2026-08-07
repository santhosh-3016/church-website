const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-church-gold hover:bg-church-gold-hover text-church-blue font-bold",
        secondary: "bg-white text-church-blue border-2 border-church-blue hover:bg-blue-50",
        outline: "border-2 border-white text-white hover:bg-white hover:text-church-blue",
        ghost: "bg-transparent text-church-blue hover:underline shadow-none"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
