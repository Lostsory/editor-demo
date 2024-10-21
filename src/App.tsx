import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from '@/components/Loading'

// 懒加载组件
const Home = lazy(() => import("@/views/Home"));
const Slate = lazy(() => import("@/views/Slate"));

function App() {

  return (
    <Router>
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/slate" element={<Slate />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
