import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import BrandSidebar from './components/BrandSidebar';
import HeroScreen from './components/screens/HeroScreen';
import TransportScreen from './components/screens/TransportScreen';
import EnergyScreen from './components/screens/EnergyScreen';
import FoodWasteScreen from './components/screens/FoodWasteScreen';
import ReviewScreen from './components/screens/ReviewScreen';
import DashboardScreen from './components/screens/DashboardScreen';

const initialData = {
  transport: {
    scooter: '',
    bicycle: '',
    carPetrol: '',
    carEv: '',
    truck: '',
    bus: '',
    metro: '',
    railway: '',
    flightShort: '',
    flightLong: '',
  },
  energy: {
    elecKwh: '',
    hasSolar: false,
    solarKw: '',
    solarHours: '5.5',
    lpgCylinders: '',
    acToggle: false,
    dryerToggle: false,
    ledToggle: true,
  },
  foodWaste: {
    diet: 'meat-heavy',
    waste: 'average',
    shoppingSpend: '',
    secondhandToggle: false,
  }
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const updateData = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <HeroScreen goNext={() => setCurrentScreen(1)} />;
      case 1:
        return <TransportScreen 
          data={data.transport} 
          updateData={(field, value) => updateData('transport', field, value)} 
          goBack={() => setCurrentScreen(0)} 
          goNext={() => setCurrentScreen(2)} 
        />;
      case 2:
        return <EnergyScreen 
          data={data.energy} 
          updateData={(field, value) => updateData('energy', field, value)} 
          goBack={() => setCurrentScreen(1)} 
          goNext={() => setCurrentScreen(3)} 
        />;
      case 3:
        return <FoodWasteScreen 
          data={data.foodWaste} 
          updateData={(field, value) => updateData('foodWaste', field, value)} 
          goBack={() => setCurrentScreen(2)} 
          calculate={() => setCurrentScreen(4)} 
        />;
      case 4:
        return <ReviewScreen 
          data={data} 
          goBack={() => setCurrentScreen(3)} 
          calculate={() => setCurrentScreen(5)} 
        />;
      case 5:
        return <DashboardScreen 
          data={data} 
          recalculate={() => setCurrentScreen(1)} 
        />;
      default:
        return <HeroScreen goNext={() => setCurrentScreen(1)} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background transition-colors duration-500">
      
      {/* Global Background Blobs for Dark Theme */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-green/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar setCurrentScreen={setCurrentScreen} />
        
        <main className="flex-1 flex flex-col">
          {currentScreen === 5 ? (
            // Full width layout for Dashboard
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {renderScreen()}
            </motion.div>
          ) : (
            // Split screen layout for questionnaire steps
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-8 flex-1 flex flex-col lg:flex-row items-stretch">
              <BrandSidebar />
              
              <div className="w-full lg:w-[55%] glass-card shadow-2xl p-6 sm:p-10 flex flex-col relative overflow-hidden min-h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScreen}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                    className="flex-1 flex flex-col h-full"
                  >
                    {renderScreen()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
