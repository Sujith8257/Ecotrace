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
          goHome={() => setCurrentScreen(0)}
          recalculate={() => setCurrentScreen(1)} 
        />;
      default:
        return <HeroScreen goNext={() => setCurrentScreen(1)} />;
    }
  };

  const loadHistoryItem = (item) => {
    setData(item.answers);
    setCurrentScreen(5);
  };

  return (
    <div className="app-shell min-h-screen relative overflow-hidden bg-background transition-colors duration-500">
      <div className="absolute left-1/2 top-0 h-px w-[min(960px,90vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-green/50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} loadHistoryItem={loadHistoryItem} />
        
        <main className="flex-1 flex flex-col">
          {currentScreen === 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          ) : currentScreen === 5 ? (
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
            <div className="section-container py-8 sm:py-12 lg:py-16 flex-1 flex flex-col lg:flex-row items-stretch gap-8 2xl:gap-16">
              <BrandSidebar />
              
              <div className="w-full lg:flex-1 glass-card p-6 sm:p-8 lg:p-10 2xl:p-12 flex flex-col relative overflow-hidden min-h-[600px]">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-green/30 to-transparent" />
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
