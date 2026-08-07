const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-card hover:shadow-elevated p-6 border border-gray-100 hover:-translate-y-1 transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
