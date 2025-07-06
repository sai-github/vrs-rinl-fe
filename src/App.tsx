import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './App.css';
import vrsLogo from '/vrs-rinl-logo.svg';

import { Icon } from '@iconify/react';

import { Dialog, DialogPanel } from '@headlessui/react';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import { NavLink, Route, Routes } from 'react-router';
import Summary from './components/Summary';

const navigation = [
  { key: 'home', href: '/' },
  { key: 'vrs_calculator', href: '/calculator' },
];

function Logo() {
  return (
    <a href="/" className="-m-1.5 p-1.5">
      <span className="sr-only">VRS RINL</span>
      <img
        alt="Logo for VRS RINL website"
        src={vrsLogo}
        className="h-16 w-auto"
      />
    </a>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation(); // Initialize translation

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Header"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 print:p-0"
        >
          <div className="flex lg:flex-1">
            <Logo />
          </div>

          {/* Language Switcher */}
          <div
            className="flex items-center gap-1 rounded-full bg-gray-950/5 p-1 print:hidden ml-auto mr-4"
            role="tablist"
            aria-orientation="horizontal"
          >
            <button
              onClick={() => changeLanguage('en')}
              className={`group flex items-center rounded-full px-4 text-sm font-medium ${
                i18n.language === 'en' ? 'bg-white ring ring-gray-950/5' : ''
              }`}
            >
              <span className="block lg:hidden">En</span>
              <span className="hidden lg:block">English</span>
            </button>
            <button
              onClick={() => changeLanguage('te')}
              className={`group flex items-center rounded-full px-4 text-sm font-medium ${
                i18n.language === 'te' ? 'bg-white ring ring-gray-950/5' : ''
              }`}
            >
              <span className="block lg:hidden">తె</span>
              <span className="hidden lg:block">తెలుగు</span>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 print:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <Icon
                className="size-6"
                icon="heroicons:bars-3-bottom-left-solid"
              />
            </button>
          </div>
          
          {/* Navigation Links for Large Screens */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.key}
                to={item.href}
                className={({ isActive }) =>
                  `text-lg font-semibold  ${
                    isActive ? 'text-blue-600' : 'text-gray-900'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>

          <Dialog
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Close menu</span>
                  <Icon
                    aria-hidden="true"
                    className="size-6"
                    icon="heroicons:x-mark-16-solid"
                  />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.key}
                        to={item.href}
                        className={({ isActive }) =>
                          `-mx-3 block rounded-lg px-3 py-2 text-base font-semibold ${
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-900 hover:bg-gray-50'
                          }`
                        }
                      >
                        {t(item.key)}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </div>
  );
}

export default App;
