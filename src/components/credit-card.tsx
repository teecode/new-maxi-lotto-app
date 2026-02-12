interface BankCardProps {
  holderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  bankName?: string;
  className?: string;
}

const CreditCard = ({
  holderName = "Anabel Smith",
  cardNumber = "3417 **** **** 2115",
  expiryDate = "12/14",
  bankName = "Bank Card",
  className = ""
}: BankCardProps) => {
  return (
    <div className={`relative w-80 h-48 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 p-6 text-white shadow-xl ${className}`}>
      {/* Card chip */}
      <div className="w-10 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md mb-4 relative">
        <div className="absolute inset-1 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm"></div>
        <div className="absolute top-1 left-1 w-2 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute top-1 right-1 w-2 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute bottom-1 left-1 w-2 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute bottom-1 right-1 w-2 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Bank name */}
      <div className="absolute top-6 right-6">
        <h3 className="text-lg font-medium text-white/90">{bankName}</h3>
      </div>

      {/* Card number */}
      <div className="mt-8 mb-6">
        <p className="text-xl font-mono tracking-wider font-medium">
          {cardNumber}
        </p>
      </div>

      {/* Bottom row with name and expiry */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-white/80 mb-1">Card Holder</p>
          <p className="text-lg font-medium">{holderName}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/80 mb-1">Expires</p>
          <p className="text-lg font-medium">{expiryDate}</p>
        </div>
      </div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none"></div>
    </div>
  );
};


export default CreditCard;