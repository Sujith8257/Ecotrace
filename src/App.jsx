import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroScreen from './components/screens/HeroScreen';
import TransportScreen from './components/screens/TransportScreen';
import EnergyScreen from './components/screens/EnergyScreen';
import FoodWasteScreen from './components/screens/FoodWasteScreen';
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
        return <DashboardScreen 
          data={data} 
          recalculate={() => setCurrentScreen(1)} 
        />;
      default:
        return <HeroScreen goNext={() => setCurrentScreen(1)} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Abstract Animated Background Elements (Aceternity style) */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-green/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
        <main className="flex-1">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

export default App;
