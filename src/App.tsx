import { useState } from 'react';

import './App.css';

import vrsLogo from '/vrs-rinl-logo.svg';

import { Icon } from '@iconify/react';

import { Dialog, DialogPanel } from '@headlessui/react';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import { NavLink, Route, Routes } from 'react-router';
import Summary from './components/Summary';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'VRS Calculator', href: '/calculator' }
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

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 print:p-0"
        >
          <div className="flex lg:flex-1">
            <Logo />
          </div>
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
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `text-lg font-semibold  ${
                    isActive ? 'text-blue-600' : 'text-gray-900'
                  }`
                }
              >
                {item.name}
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
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-900 hover:bg-gray-50'
                          }`
                        }
                      >
                        {item.name}
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
