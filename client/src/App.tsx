import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { Home } from './pages/Home';
import { Marketplace } from './pages/Marketplace';
import { ItemDetail } from './pages/ItemDetail';
import { PostItem } from './pages/PostItem';
import { CommunityNeeds } from './pages/CommunityNeeds';
import { ShareGuide } from './pages/ShareGuide';
import { MyActivity } from './pages/MyActivity';
import { Messages } from './pages/Messages';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Impact } from './pages/Impact';
import { Auth } from './pages/Auth';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-rekind-cream text-rekind-dark font-sans selection:bg-rekind-sand selection:text-rekind-dark">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/item/:id" element={<ItemDetail />} />
                <Route path="/post-item" element={<PostItem />} />
                <Route path="/community-needs" element={<CommunityNeeds />} />
                <Route path="/share" element={<ShareGuide />} />
                <Route path="/my-activity" element={<MyActivity />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/impact" element={<Impact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
