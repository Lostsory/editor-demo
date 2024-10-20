import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from '@/components/Loading'

// 懒加载组件
const Home = lazy(() => import("@/views/Home"));
const Home2 = lazy(() => import("@/views/Home/index2"));

function App() {

  return (
    <Router>
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path="/slate" element={<Home />} />
          <Route path="/own" element={<Home2 />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
