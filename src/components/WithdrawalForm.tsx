import  { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitWithdrawal } from '../api/gameApi';
import { DollarSign, AlertCircle, Loader2, Check } from 'lucide-react';

export default function WithdrawalForm() {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [cashAppTag, setCashAppTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  
  const quickAmounts = [10, 25, 50, 100];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate amount
    if (amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amount > (user.balance || 0)) {
      setError('Withdrawal amount exceeds your balance');
      return;
    }
    
    if (amount < 10) {
      setError('Minimum withdrawal amount is $10');
      return;
    }
    
    // Validate CashApp tag
    if (!cashAppTag) {
      setError('Please enter your CashApp tag');
      return;
    }
    
    if (!cashAppTag.startsWith('$')) {
      setError('CashApp tag must start with $ symbol');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In development, simulate API call
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setStep(2);
      } else {
        await submitWithdrawal(user.id, amount, cashAppTag);
        setSuccess(true);
        setStep(2);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError((error as Error).message || 'Failed to process withdrawal');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStepOne = () => (
    <form onSubmit={handleSubmit}>
      {user && (
        <div className="mb-6 bg-gray-700/50 rounded-lg p-3">
          <div className="text-sm text-gray-400">Available Balance</div>
          <div className="text-2xl font-semibold">${user.balance || 0}</div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-300 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Quick Amount</label>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              className={`py-2 rounded-md transition-colors ${
                amount === quickAmount 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setAmount(quickAmount)}
              disabled={quickAmount > (user?.balance || 0)}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-300 mb-2">
          Withdrawal Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">$</span>
          <input
            type="number"
            id="amount"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-gray-700 w-full py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            min="10"
            max={user?.balance || 0}
            required
          />
        </div>
        <div className="mt-1 flex justify-between items-center text-xs">
          <span className="text-gray-400">Min: $10</span>
          <span className="text-gray-400">Max: ${user?.balance || 0}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="cashAppTag" className="block text-gray-300 mb-2">
          Your CashApp Tag
        </label>
        <input
          type="text"
          id="cashAppTag"
          value={cashAppTag}
          onChange={(e) => setCashAppTag(e.target.value)}
          placeholder="$YourCashAppTag"
          className="bg-gray-700 w-full py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          We'll send your withdrawal to this CashApp tag
        </p>
      </div>
      
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading || !amount || amount > (user?.balance || 0) || !cashAppTag}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Processing...
          </span>
        ) : (
          'Submit Withdrawal Request'
        )}
      </button>
      
      <div className="mt-4 text-sm text-gray-400 text-center">
        Withdrawals are processed within 1 hour during operating hours
      </div>
      
      <div className="mt-6 bg-gray-700/30 rounded-lg p-4">
        <div className="flex items-start">
          <DollarSign className="w-5 h-5 text-primary-400 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-300">Withdrawal Information</h4>
            <ul className="list-disc ml-5 mt-2 text-sm text-gray-400 space-y-1">
              <li>Minimum withdrawal amount: $10</li>
              <li>Maximum withdrawal: Your current balance</li>
              <li>Withdrawals are sent via CashApp only</li>
              <li>Funds are typically processed within 1 hour</li>
              <li>For urgent withdrawals, please contact support</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
  
  const renderStepTwo = () => (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-green-400" />
      </div>
      
      <h3 className="font-semibold text-green-400 text-xl mb-2">Withdrawal Request Submitted!</h3>
      
      <div className="bg-gray-700/30 rounded-lg p-4 mb-6 text-left">
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="text-gray-400">Amount:</div>
          <div className="text-white font-medium">${amount}</div>
          
          <div className="text-gray-400">CashApp Tag:</div>
          <div className="text-white font-medium">{cashAppTag}</div>
          
          <div className="text-gray-400">Request ID:</div>
          <div className="text-white font-medium">WD-{Date.now().toString().substring(5)}</div>
          
          <div className="text-gray-400">Status:</div>
          <div className="text-yellow-400 font-medium">Pending</div>
        </div>
        
        <div className="border-t border-gray-600 pt-4 text-gray-300">
          <p className="mb-2">
            Your withdrawal request for ${amount} to {cashAppTag} has been submitted and is pending approval.
          </p>
          <p className="text-sm text-gray-400">
            Our team will process your request within 1 hour. You'll receive a notification when the funds are sent to your CashApp.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSuccess(false);
            setAmount(0);
            setCashAppTag('');
            setStep(1);
          }}
        >
          Make Another Withdrawal
        </button>
        
        <button 
          className="btn bg-gray-700 hover:bg-gray-600 text-white"
          onClick={() => window.location.href = '/profile?tab=history'}
        >
          View History
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1743824521065-48d394eafcda?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYmx1ZSUyMGNhc2lubyUyMGdhbWluZyUyMHByb2ZpbGUlMjBpbnRlcmZhY2V8ZW58MHx8fHwxNzQ5ODIzNzYzfDA&ixlib=rb-4.1.0&fit=fillmax&h=500&w=800')" }}></div>
        <div className="relative flex items-center gap-4 p-4">
          <div className="text-3xl text-white font-bold font-display">Withdraw Funds</div>
        </div>
      </div>
      
      {step === 1 ? renderStepOne() : renderStepTwo()}
    </div>
  );
}
 