"use client";
import ThemeSelector from '../components/themeSelector';
import WelcomeSection from '../components/welcomeSection';


const HomePage = () => {

  return (
    <div className="min-h-screen w-full">
      <div>
        <div className="flex justify-center">
          <ThemeSelector />
        </div>
        <div className="p-6 text-center">
          <h1 className='text-4xl font-semibold'>Quiz Games</h1>
          <WelcomeSection />
        </div>
      </div>
    </div>
  );

};


export default HomePage;
