import React, { useState, useEffect } from 'react';
import { Search, User, Check, Link, Star } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import image3 from './assets/image3.png';

interface User {
  name: string;
  cashtag: string;
  avatar: string;
  color: string;
  avatarUrl?: string;
}

interface Notification {
  message: string;
  timestamp: string;
  read: boolean;
}

const mockUsers: User[] = [
  { name: 'Kellen Bates', cashtag: '$Voidosu', avatar: 'K', color: '#8e44ad' },
  { name: 'Kate Howard', cashtag: '$LKhowz', avatar: 'K', color: '#b2732b' },
  { name: 'Julia Wilson', cashtag: '$wilson8823', avatar: 'J', color: '#c0398f' },
  { name: 'Joshua Aguilar', cashtag: '$aguilarjoshua18', avatar: 'J', color: '#27ae60' },
  { name: 'Haylee Walls', cashtag: '$HayleeWalls', avatar: 'H', color: '#5dade2' },
  { name: 'Cierra Shepard', cashtag: '$brutallyhonestcc', avatar: 'C', color: '#e74c3c' },
  { name: 'Camron Watkins', cashtag: '$kambam3118', avatar: 'C', color: '#27ae60' },
  { name: 'Morgan Lee', cashtag: '$morganlee', avatar: 'M', color: '#f39c12' },
  { name: 'Ava Patel', cashtag: '$avapatel', avatar: 'A', color: '#16a085' },
  { name: 'Ethan Kim', cashtag: '$ethankim', avatar: 'E', color: '#2980b9' },
  { name: 'Sophia Turner', cashtag: '$sophiaturner', avatar: 'S', color: '#d35400' },
  { name: 'Liam Smith', cashtag: '$liamsmith', avatar: 'L', color: '#34495e' },
  { name: 'Olivia Brown', cashtag: '$oliviabrown', avatar: 'O', color: '#8e44ad' },
  { name: 'Noah Johnson', cashtag: '$noahjohnson', avatar: 'N', color: '#2ecc71' },
  { name: 'Emma Davis', cashtag: '$emmadavis', avatar: 'E', color: '#e67e22' },
  { name: 'Mason Clark', cashtag: '$masonclark', avatar: 'M', color: '#1abc9c' },
  { name: 'Isabella Lewis', cashtag: '$isabellalewis', avatar: 'I', color: '#9b59b6' }
];

// Restore the original CashAppIcon component:
const CashAppIcon = ({ size = "w-10 h-10", color = "#00d54b", dollarColor = "#fff" }) => (
  <div className={`${size} rounded-full flex items-center justify-center`} style={{ backgroundColor: color }}>
    <span className="text-3xl font-bold" style={{fontFamily: 'sans-serif', color: dollarColor}}>$</span>
  </div>
);

function App() {
  const [balance, setBalance] = useState(8854.22);
  const [cashOutModal, setCashOutModal] = useState(false);
  const [addCashModal, setAddCashModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [dollarModal, setDollarModal] = useState(false);
  const [sendToModal, setSendToModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [notificationCenter, setNotificationCenter] = useState(false);
  
  const [cashOutValue, setCashOutValue] = useState('');
  const [addCashValue, setAddCashValue] = useState('');
  const [dollarValue, setDollarValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [sendToValue, setSendToValue] = useState('');
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [successType, setSuccessType] = useState<'cashOut' | 'addCash'>('cashOut');
  const [successAmount, setSuccessAmount] = useState('');
  const [loadingTitle, setLoadingTitle] = useState('');
  const [loadingSubtitle, setLoadingSubtitle] = useState('');
  const [lastDollarAmount, setLastDollarAmount] = useState('');

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      // Screen size detection logic can be added here if needed
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('cashBalance');
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }
    
    const savedNotifications = localStorage.getItem('notificationHistory');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length);
    }
  }, []);

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cashBalance', balance.toString());
  }, [balance]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationHistory', JSON.stringify(notifications));
  }, [notifications]);

  const formatBalance = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatBalanceShort = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${Math.round(amount)}`;
  };

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      message,
      timestamp: new Date().toLocaleString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show in-app notification
    const notificationEl = document.createElement('div');
    notificationEl.className = 'fixed top-10 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg z-50 w-full max-w-sm mx-auto opacity-0 transition-all duration-300';
    notificationEl.innerHTML = `
      <div class="flex items-center gap-3">
        <span id="cash-app-icon"></span>
        <div class="flex-1">
          <div class="font-semibold text-sm">Cash App</div>
          <div class="text-xs text-gray-600">now</div>
        </div>
        <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="mt-2 text-sm text-gray-800">${message}</div>
    `;
    // Insert the icon using React render
    const iconContainer = notificationEl.querySelector('#cash-app-icon');
    if (iconContainer) {
      createRoot(iconContainer).render(
        <CashAppIcon size="w-10 h-10" />
      );
    }
    document.body.appendChild(notificationEl);
    
    setTimeout(() => {
      notificationEl.style.opacity = '1';
      notificationEl.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    setTimeout(() => {
      notificationEl.style.opacity = '0';
      notificationEl.style.transform = 'translateX(-50%) translateY(-100px)';
      setTimeout(() => {
        if (notificationEl.parentNode) {
          notificationEl.parentNode.removeChild(notificationEl);
        }
      }, 300);
    }, 5000);
  };

  const showLoading = (title: string, subtitle: string, callback: () => void) => {
    setLoadingTitle(title);
    setLoadingSubtitle(subtitle);
    setLoadingModal(true);
    
    setTimeout(() => {
      setLoadingModal(false);
      setTimeout(callback, 300);
    }, 2500);
  };

  const processCashOut = () => {
    if (!cashOutValue) return;
    
    const amount = parseInt(cashOutValue);
    if (amount <= 0 || amount > balance) return;
    
    setBalance(prev => prev - amount);
    setCashOutModal(false);
    
    showLoading('Processing Cash Out', 'Transferring to Chase Bank...', () => {
      setSuccessType('cashOut');
      setSuccessAmount(amount.toString());
      setSuccessModal(true);
      
      // Delay notification until after success modal is likely to be seen
      setTimeout(() => {
        const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        addNotification(`You successfully cashed out $${formattedAmount} to Chase Bank. Funds will be available instantly.`);
      }, 3000);
    });
  };

  const processAddCash = () => {
    if (!addCashValue) return;
    
    const amount = parseInt(addCashValue);
    if (amount <= 0) return;
    
    setBalance(prev => prev + amount);
    setAddCashModal(false);
    
    showLoading('Adding Cash', 'Processing your deposit...', () => {
      setSuccessType('addCash');
      setSuccessAmount(amount.toString());
      setSuccessModal(true);
      
      // Delay notification until after success modal is likely to be seen
      setTimeout(() => {
        const formattedAmount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        addNotification(`A deposit of $${formattedAmount} is now available in your Cash App. Open the app to view details.`);
      }, 3000);
    });
  };

  const addDigit = (digit: string, type: 'cashOut' | 'addCash' | 'dollar') => {
    if (type === 'cashOut') {
      if (cashOutValue.length < 10) {
        setCashOutValue(prev => prev + digit);
      }
    } else if (type === 'addCash') {
      if (addCashValue.length < 10) {
        setAddCashValue(prev => prev + digit);
      }
    } else if (type === 'dollar') {
      if (digit === '.' && dollarValue.includes('.')) return;
      if (dollarValue.length >= 9) return;
      if (digit === '.' && dollarValue === '') {
        setDollarValue('0.');
      } else {
        setDollarValue(prev => prev + digit);
      }
    }
  };

  const removeDigit = (type: 'cashOut' | 'addCash' | 'dollar') => {
    if (type === 'cashOut') {
      setCashOutValue(prev => prev.slice(0, -1));
    } else if (type === 'addCash') {
      setAddCashValue(prev => prev.slice(0, -1));
    } else if (type === 'dollar') {
      setDollarValue(prev => prev.slice(0, -1));
    }
  };

  const getDisplayAmount = (value: string, type: 'cashOut' | 'addCash' | 'dollar') => {
    if (!value) return '$0';
    
    if (type === 'dollar') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return '$0';
      return '$' + numValue.toLocaleString();
    } else {
      const numValue = parseInt(value);
      return '$' + numValue.toLocaleString();
    }
  };

  const handleDollarPay = () => {
    setLastDollarAmount(getDisplayAmount(dollarValue, 'dollar'));
    setDollarModal(false);
    setSendToModal(true);
  };

  const handleSendToPay = () => {
    if (!selectedUser || !dollarValue) return;
    const amount = parseFloat(dollarValue);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > balance) {
      addNotification('Insufficient funds. You cannot send more than your available balance.');
      return;
    }
    
    // Reduce balance immediately
    setBalance(prev => prev - amount);
    
    // Set the formatted amount for display
    setLastDollarAmount(formatBalance(amount));
    
    // Reset the dollar value
    setDollarValue('');
    
    // Close the send modal
    setSendToModal(false);
    
    // Show loading and then confirmation
    showLoading('Processing Payment', 'Sending payment...', () => {
      setConfirmationModal(true);
      
      // Delay notification until after confirmation modal is likely to be seen
      setTimeout(() => {
        addNotification(`Successfully sent ${formatBalance(amount)} to ${selectedUser.name}`);
      }, 3000);
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(sendToValue.toLowerCase()) ||
    user.cashtag.toLowerCase().includes(sendToValue.toLowerCase())
  );

  const KeypadButton = ({ digit, onClick }: { digit: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-700 dark:active:bg-gray-600 flex items-center justify-center text-xl sm:text-2xl font-medium transition-colors"
    >
      {digit}
    </button>
  );

  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-screen relative pb-20 sm:pb-24 font-sans overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-3 sm:p-4 pt-4 sm:pt-6">
        <h1 className="text-xl sm:text-2xl font-semibold">Money</h1>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </div>
      </div>

      {/* Balance Section */}
      <div className="px-3 sm:px-4 py-4 sm:py-5">
        <div className="text-gray-600 text-xs sm:text-sm mb-2">Cash balance</div>
        <div className="text-3xl sm:text-4xl font-bold mb-2">{formatBalance(balance)}</div>
        <div className="text-gray-600 text-xs sm:text-sm">Account & Routing</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-2 sm:px-3 mb-3 sm:mb-4">
        <button
          onClick={() => setAddCashModal(true)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-black py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-colors text-sm sm:text-base"
        >
          Add Cash
        </button>
        <button
          onClick={() => setCashOutModal(true)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-black py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-colors text-sm sm:text-base"
        >
          Cash Out
        </button>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 px-3 sm:px-4 mb-4 sm:mb-6">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">$</div>
          <div className="font-semibold text-green-500 text-xs sm:text-sm mb-1">Savings</div>
          <div className="text-lg sm:text-xl font-bold mb-1">$0.00</div>
          <div className="text-xs text-gray-500">Save for a goal</div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">₿</div>
          <div className="font-semibold text-blue-500 text-xs sm:text-sm mb-1">Bitcoin</div>
          <div className="text-lg sm:text-xl font-bold mb-1">$0.00</div>
          <div className="text-xs text-gray-500"><span className="text-green-500">↑</span> 5.80% today</div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">↓</div>
          <div className="font-semibold text-green-500 text-xs sm:text-sm mb-1">Paychecks</div>
          <div className="text-xs text-gray-500">Get paid early</div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">📈</div>
          <div className="font-semibold text-purple-500 text-xs sm:text-sm mb-1">Stocks</div>
          <div className="text-xs text-gray-500">Invest with $1</div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">📝</div>
          <div className="font-semibold text-indigo-500 text-xs sm:text-sm mb-1">Taxes</div>
          <div className="text-xs text-gray-500">Track your filings</div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">💳</div>
          <div className="font-semibold text-red-500 text-xs sm:text-sm mb-1">Cash Card</div>
          <div className="text-xs text-gray-500">Order your card</div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">🎯</div>
          <div className="font-semibold text-teal-500 text-xs sm:text-sm mb-1">Boosts</div>
          <div className="text-xs text-gray-500">Save at stores</div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mx-auto mb-2">🏠</div>
          <div className="font-semibold text-sky-500 text-xs sm:text-sm mb-1">Mortgage</div>
          <div className="text-xs text-gray-500">Home financing</div>
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 flex justify-around py-2 px-2 sm:px-4 safe-area-pb">
        <div className="text-center text-xs sm:text-sm min-w-0 flex-1">
          <div className="font-semibold">{formatBalanceShort(balance)}</div>
        </div>
        <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform">
          <svg className="w-5 h-5 mx-auto text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <path d="M16 11h2a2 2 0 0 1 0 4h-2" />
          </svg>
        </div>
        <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => setDollarModal(true)}>
          <img src={image3} alt="Cash App" className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
        </div>
        <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => setSearchModal(true)}>
          <Search className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
        </div>
        <div className="text-center text-xs sm:text-sm cursor-pointer relative min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
          setNotificationCenter(true);
          markAllNotificationsRead();
        }}>
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto">
            {unreadCount}
          </div>
        </div>
      </div>

      {/* Cash Out Modal */}
      {cashOutModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
          <div className="bg-white/95 backdrop-blur-sm rounded-t-3xl p-6 shadow-lg w-full max-w-sm mx-auto h-3/4 flex flex-col justify-center">
            {/* Modal content starts here */}
            <div className="flex flex-col items-center justify-center flex-1 w-full">
              <div className="text-center mb-2">
                <div className="text-black font-bold text-lg mb-1">Cash Out</div>
                <div className="text-gray-400 text-sm">{`$${balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} AVAILABLE</div>
              </div>
              <div className="text-green-500 font-extrabold text-5xl sm:text-6xl mb-6 flex items-center justify-center w-full">
                ${cashOutValue ? parseInt(cashOutValue).toLocaleString('en-US') : '0'}
              </div>
              {/* Slider */}
              <input
                type="range"
                min={0}
                max={Math.floor(balance)}
                value={cashOutValue ? parseInt(cashOutValue) : 0}
                onChange={e => setCashOutValue(e.target.value)}
                className="w-11/12 max-w-xs mb-8 accent-green-500 h-2"
                style={{ accentColor: '#22c55e' }}
              />
              {/* Cash Out Button */}
              <button
                onClick={processCashOut}
                className={`w-11/12 max-w-xs py-4 rounded-full font-semibold text-lg mb-2 transition-all ${cashOutValue && parseInt(cashOutValue) > 0 ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                disabled={!cashOutValue || parseInt(cashOutValue) <= 0}
              >
                Cash Out
              </button>
            </div>
          </div>
          {/* Footer at the bottom, just like home page */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 flex justify-around py-2 px-2 sm:px-4 safe-area-pb z-50">
            <div className="text-center text-xs sm:text-sm min-w-0 flex-1">
              <div className="font-semibold">{formatBalanceShort(balance)}</div>
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform">
              <svg className="w-5 h-5 mx-auto text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="10" rx="2" />
                <path d="M16 11h2a2 2 0 0 1 0 4h-2" />
              </svg>
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => setDollarModal(true)}>
              <img src={image3} alt="Cash App" className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => setSearchModal(true)}>
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer relative min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
              setNotificationCenter(true);
              markAllNotificationsRead();
            }}>
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto">
                {unreadCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Cash Modal */}
      {addCashModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center p-0">
          <div className="bg-gray-50 rounded-t-3xl w-full h-3/4 sm:max-w-sm sm:mx-auto sm:h-auto sm:max-h-[80vh] p-4 sm:p-6 transform transition-transform duration-300 flex flex-col justify-center items-center overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mb-4 sm:mb-6 flex-shrink-0"></div>
            <div className="text-center mb-6 sm:mb-8 flex-shrink-0">
              <div className="text-lg sm:text-xl font-semibold mb-2">Add Cash</div>
              <div className="text-gray-600 text-sm sm:text-base">From Bank Account</div>
            </div>
            
            <div className="text-4xl sm:text-5xl font-bold text-green-500 mb-6 sm:mb-8 flex-shrink-0">
              {getDisplayAmount(addCashValue, 'addCash')}
            </div>
            
            <div className="w-32 sm:w-48 h-1 bg-green-500 rounded-full mb-6 sm:mb-8 flex-shrink-0"></div>
            
            <button
              onClick={processAddCash}
              className={`w-full max-w-xs py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg mb-6 sm:mb-8 transition-all flex-shrink-0 ${
                addCashValue ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500'
              }`}
              disabled={!addCashValue}
            >
              Add Cash
            </button>
            
            <div className="flex flex-1 items-center justify-center w-full">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''].map((digit, idx) => (
                  <KeypadButton
                    key={idx}
                    digit={digit}
                    onClick={() => {
                      if (digit !== '') {
                        addDigit(digit, 'addCash');
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="flex items-center gap-3 p-3 sm:p-4 border-b">
            <button onClick={() => setSearchModal(false)} className="text-green-500 text-xl sm:text-2xl font-bold active:scale-95 transition-transform">
              ←
            </button>
            <input
              type="text"
              placeholder="Search for people, places, and things"
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 bg-gray-100 rounded-full outline-none text-sm sm:text-base"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-3 mb-4 sm:mb-6">
              <div className="bg-gray-100 rounded-xl p-3 sm:p-4 text-center cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors" onClick={() => {
                setSearchModal(false);
                setAddCashModal(true);
              }}>
                <div className="text-xl sm:text-2xl mb-2">💰</div>
                <div className="text-xs sm:text-sm font-medium">Add Cash</div>
              </div>
              <div className="bg-gray-100 rounded-xl p-3 sm:p-4 text-center cursor-pointer hover:bg-gray-200 active:bg-gray-300 transition-colors" onClick={() => {
                setSearchModal(false);
                setCashOutModal(true);
              }}>
                <div className="text-xl sm:text-2xl mb-2">🏦</div>
                <div className="text-xs sm:text-sm font-medium">Cash Out</div>
              </div>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <div className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent</div>
              <div className="space-y-3">
                {mockUsers.slice(0, 3).map((user, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base" style={{ backgroundColor: user.color }}>
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm sm:text-base">{user.cashtag}</div>
                      <div className="text-xs sm:text-sm text-gray-500">Recent transaction</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dollar Modal */}
      {dollarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#36d24a]">
          <button
            onClick={() => setDollarModal(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
          <div className="w-full max-w-xs flex flex-col items-center justify-center">
            <div className="text-white text-5xl font-extrabold mb-8 mt-8 text-center">
              ${dollarValue || '0'}
            </div>
            <div className="grid grid-cols-3 gap-6 mb-10 w-full">
              {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map((digit, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (digit === '⌫') removeDigit('dollar');
                    else addDigit(digit, 'dollar');
                  }}
                  className="text-white text-3xl font-bold py-4 rounded-full focus:outline-none active:bg-[#2bb03b]"
                >
                  {digit}
                </button>
              ))}
            </div>
            <div className="flex w-full gap-4 px-2">
              <button
                className="flex-1 bg-[#222] text-white text-lg font-semibold py-3 rounded-full"
                disabled={!dollarValue}
              >
                Request
              </button>
              <button
                onClick={handleDollarPay}
                className="flex-1 bg-[#222] text-white text-lg font-semibold py-3 rounded-full"
                disabled={!dollarValue}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send To Modal */}
      {sendToModal && (
        <div className="fixed inset-0 bg-gray-900 text-white z-50 overflow-y-auto">
          <div className="flex items-center gap-3 p-3 sm:p-4">
            <button onClick={() => setSendToModal(false)} className="text-xl sm:text-2xl active:scale-95 transition-transform">
              ←
            </button>
            <div className="flex-1">
              <div className="text-base sm:text-lg font-bold">Send {lastDollarAmount}</div>
              <div className="text-xs sm:text-sm text-gray-400">To someone</div>
            </div>
            <div className="flex gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <Link className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
            {selectedUser && (
              <button
                onClick={handleSendToPay}
                className="bg-green-500 hover:bg-green-600 active:bg-green-700 px-3 sm:px-4 py-2 rounded-2xl font-semibold text-sm sm:text-base transition-all"
              >
                Pay
              </button>
            )}
          </div>
          
          <div className="px-3 sm:px-4 mb-3 sm:mb-4">
            <div className="bg-gray-800 rounded-xl px-3 sm:px-4 py-2 inline-block text-sm sm:text-base">
              Navy Federal <span className="text-xs sm:text-sm">▼</span>
            </div>
          </div>
          
          <div className="px-3 sm:px-4 mb-3 sm:mb-4 relative">
            <input
              type="text"
              placeholder="To   Name, $Cashtag, Phone, Email"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              value={sendToValue}
              onChange={(e) => setSendToValue(e.target.value)}
              onFocus={() => setShowUserDropdown(true)}
            />
            
            {showUserDropdown && sendToValue && (
              <div className="absolute top-full left-3 right-3 sm:left-4 sm:right-4 bg-gray-800 rounded-b-xl shadow-lg z-10 max-h-48 sm:max-h-60 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="p-3 sm:p-4 text-center text-gray-400 text-sm">No results found</div>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 sm:p-3 hover:bg-gray-700 active:bg-gray-600 cursor-pointer transition-colors"
                      onClick={() => {
                        setSendToValue(`${user.name} ${user.cashtag}`);
                        setSelectedUser(user);
                        setShowUserDropdown(false);
                      }}
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ backgroundColor: user.color }}>
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm sm:text-base">{user.name}</div>
                        <div className="text-xs sm:text-sm text-gray-400">{user.cashtag}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
          </div>

          <div className="px-3 sm:px-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-gray-400 text-xs sm:text-sm">Send as</span>
              <div className="flex gap-2">
                <button className="bg-green-500 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold active:scale-95 transition-transform">Cash</button>
                <button className="bg-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold active:scale-95 transition-transform">Gift Card</button>
                <button className="bg-gray-800 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold active:scale-95 transition-transform">Stock</button>
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-4">
            <div className="text-gray-400 text-xs font-bold mb-2 sm:mb-3 tracking-wide">SUGGESTED</div>
            <div className="space-y-1">
              {mockUsers.map((user, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg cursor-pointer hover:bg-gray-800 active:bg-gray-700 transition-colors ${selectedUser?.cashtag === user.cashtag ? 'bg-gray-800 border-l-4 border-green-500' : ''
                    }`}
                  onClick={() => setSelectedUser(selectedUser?.cashtag === user.cashtag ? null : user)}
                >
                  <div className="relative flex items-center cursor-pointer">
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 border-2 rounded-md transition-all duration-200 ease-in-out ${
                      selectedUser?.cashtag === user.cashtag 
                        ? 'bg-[#36d24a] border-[#36d24a] scale-110' 
                        : 'border-gray-400 bg-transparent hover:border-[#36d24a] hover:scale-105'
                    }`}>
                      {selectedUser?.cashtag === user.cashtag && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm" style={{ backgroundColor: user.color }}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm sm:text-base">{user.name}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{user.cashtag}</div>
                  </div>
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Back arrow at top left */}
          <button
            onClick={() => setSuccessModal(false)}
            className="absolute top-4 left-4 z-10 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            aria-label="Back"
          >
            <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Ellipsis at top right */}
          <button
            className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            aria-label="More options"
            type="button"
          >
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="6" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="18" cy="12" r="1.5" />
            </svg>
          </button>
          {/* Main content */}
          <div className="flex flex-col flex-1 items-center px-6 pt-8 pb-0">
            {/* Top icon and titles */}
            <div className="flex flex-col items-center mt-12">
              <div className="w-12 h-12 rounded-full bg-[#36d24a] flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">$</span>
              </div>
              <div className="text-lg font-bold mb-0.5">{successType === 'cashOut' ? 'Cash Out' : 'Add Cash'}</div>
              <div className="text-gray-400 text-sm mb-8">{successType === 'cashOut' ? 'To Chase Bank' : 'From Visa Debit 2549'}</div>
            </div>
            {/* Centered amount and date */}
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="text-5xl font-extrabold text-black mb-2">
                {formatBalance(parseFloat(successAmount))}
              </div>
              <div className="text-gray-500 text-base">
                Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </div>
            </div>
            {/* Button */}
            <div className="w-full mb-4">
              <button
                onClick={() => setSuccessModal(false)}
                className="w-full bg-[#36d24a] hover:bg-[#2bb03b] text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-6 h-6" />
                Completed
              </button>
            </div>
          </div>
          {/* Footer - included inside the modal */}
          <div className="border-t border-gray-200 flex justify-around py-2 px-2 sm:px-4">
            <div className="text-center text-xs sm:text-sm min-w-0 flex-1">
              <div className="font-semibold">{formatBalanceShort(balance)}</div>
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform">
              <svg className="w-5 h-5 mx-auto text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="10" rx="2" />
                <path d="M16 11h2a2 2 0 0 1 0 4h-2" />
              </svg>
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
              setSuccessModal(false);
              setDollarModal(true);
            }}>
              <img src={image3} alt="Cash App" className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
              setSuccessModal(false);
              setSearchModal(true);
            }}>
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer relative min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
              setSuccessModal(false);
              setNotificationCenter(true);
              markAllNotificationsRead();
            }}>
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto">
                {unreadCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {loadingModal && (
        <div className="fixed inset-0 bg-[#10131a] z-50 flex items-center justify-center">
          {/* Green spinner */}
          <div className="w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin mb-8"></div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && selectedUser && (
        <div className="fixed inset-0 bg-[#10131a] z-50 flex flex-col">
          <div className="text-white text-center p-6 sm:p-8 w-full max-w-sm flex flex-col flex-1 min-h-[70vh] justify-between relative mx-auto pb-16">
            {/* Top left back arrow */}
            <button
              onClick={() => setConfirmationModal(false)}
              className="absolute top-6 left-4 z-10 p-2 rounded-full hover:bg-gray-800 active:bg-gray-700"
              aria-label="Back"
            >
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Top right horizontal ellipsis */}
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-800 active:bg-gray-700"
              aria-label="More options"
              type="button"
            >
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="6" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="18" cy="12" r="1.5" />
              </svg>
            </button>
            {/* Top section: avatar, user, payment to */}
            <div className="flex flex-col items-center mb-10 mt-12">
              <div className="w-16 h-16 rounded-full mb-4 mx-auto flex items-center justify-center text-white font-bold text-lg sm:text-xl" style={{ backgroundColor: selectedUser.color }}>
                {selectedUser.avatar}
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1">{selectedUser.name}</div>
              <div className="text-gray-400 text-sm sm:text-base">Payment to {selectedUser.cashtag}</div>
            </div>
            {/* Main content: amount and date centered */}
            <div className="flex flex-col items-center flex-1 justify-center">
              <div className="text-3xl sm:text-4xl font-bold mb-3">
                {lastDollarAmount || '$0.00'}
              </div>
              <div className="text-gray-400 mb-8 sm:mb-10 text-sm sm:text-base">
                Today at {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </div>
            </div>
            {/* Button group */}
            <div className="space-y-3 sm:space-y-4 w-full">
              <button
                onClick={() => setConfirmationModal(false)}
                className="w-full bg-[#36d24a] hover:bg-[#2bb03b] text-white py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2 transition-all"
              >
                <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                Completed
              </button>
              <button className="w-full border-2 border-gray-600 text-white py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg active:scale-95 transition-transform">
                Web Receipt
              </button>
            </div>
          </div>
          {/* Footer */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-[#10131a] border-t border-gray-800 flex justify-around py-2 px-2 sm:px-4">
            <div className="text-center text-xs sm:text-sm min-w-0 flex-1">
              <div className="font-semibold text-white">{formatBalanceShort(balance)}</div>
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform">
              <svg className="w-5 h-5 mx-auto text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="10" rx="2" />
                <path d="M16 11h2a2 2 0 0 1 0 4h-2" />
              </svg>
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
              setConfirmationModal(false);
              setDollarModal(true);
            }}>
              <img src={image3} alt="Cash App" className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
              setConfirmationModal(false);
              setSearchModal(true);
            }}>
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-gray-300" />
            </div>
            <div className="text-center text-xs sm:text-sm cursor-pointer relative min-w-0 flex-1 active:scale-95 transition-transform" onClick={() => {
              setConfirmationModal(false);
              setNotificationCenter(true);
              markAllNotificationsRead();
            }}>
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-black text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mx-auto">
                {unreadCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Center Modal */}
      {notificationCenter && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-end justify-center p-0">
          <div className="bg-white rounded-t-3xl w-full max-w-sm h-3/4 sm:h-auto sm:max-h-[80vh] transform transition-transform duration-300 overflow-hidden flex flex-col">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4 sm:mb-5 flex-shrink-0"></div>
            <div className="flex justify-between items-center px-4 sm:px-5 mb-4 sm:mb-5 flex-shrink-0">
              <div className="text-lg sm:text-xl font-semibold">Notifications</div>
              <button onClick={() => setNotificationCenter(false)} className="text-xl sm:text-2xl text-gray-400 hover:text-gray-600 active:scale-95 transition-all">
                ×
              </button>
            </div>

            <div className="px-4 sm:px-5 pb-4 sm:pb-5 overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="text-center text-gray-500 mt-8 sm:mt-10 text-sm sm:text-base">No notifications</div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {notifications.map((notification, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <CashAppIcon size="w-8 h-8 sm:w-10 sm:h-10" />
                        <div className="flex-1">
                          <div className="font-semibold text-xs sm:text-sm">Cash App</div>
                          <div className="text-xs text-gray-500">{notification.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-800">{notification.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;