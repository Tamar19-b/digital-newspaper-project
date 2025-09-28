import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Newspaper from './Components/Newspaper/Newspaper';
import LoginComponent from './Components/log-in/log-in'
import ReporterHome from './Components/ReporterHome/ReporterHome';
import EditorHome from './Components/ReporterHome/EditorHome';
import SectionPage from './Components/Newspaper/SectionPage/SectionPage';
import SignUp from './Components/log-in/SignUp';
import GlobalToast from './store/GlobalToast';

// Simple Loader component for Suspense fallback
const Loader = () => <div>Loading...</div>;

function App() {

  return (

    <BrowserRouter>

      <GlobalToast />

      <Routes>
        {/* <Route path="about" element={<Suspense fallback={<Loader/>}>< About/> </Suspense>} /> */}
        <Route path="/log-in" element={<LoginComponent />} /> {/* דף לוגין */}
        <Route path="/" element={<LoginComponent />} /> {/* דף לוגין */}
        <Route path="/signup" element={<SignUp />} /> {/* דף הרשמה */}
        <Route path="/reporterHome/:email" element={<ReporterHome />} /> {/*דף הבית של הכתב */}
        <Route path="/editorHome/:email" element={<EditorHome />} />
        <Route path="/newspaper/:token" element={<Newspaper />} />
        <Route path="/newspaper/:token/:section" element={<SectionPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;


