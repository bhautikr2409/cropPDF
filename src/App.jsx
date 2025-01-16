import React from 'react';
// import { Toaster } from 'react-hot-toast'; // Import Toaster
// import Header from './componants/Header';
// import UploadComponent from './componants/UploadComponent ';
import LandingPage from './componants/cropingPage/LandingPage';
import { BrowserRouter, Route, Router, Routes } from 'react-router';
import CropPDF from './componants/cropingPage/CropPDF';
import { HeaderM } from './componants/cropingPage/Header';
import CropPage from './componants/cropingPage/CropPage';



function App() {

  return (  
    <>
      <BrowserRouter>
        <HeaderM />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/crop" element={<CropPDF />} />
            <Route path="/cropPage" element={<CropPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
