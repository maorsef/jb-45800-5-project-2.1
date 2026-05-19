import {
  Routes,
  Route
} from 'react-router-dom'

import MainLayout from './layouts/MainLayout'

import Home from './pages/Home/Home'
import LiveReports from './pages/LiveReports/LiveReports'
import AIRecommendations from './pages/AIRecommendations/AIRecommendations'
import About from './pages/About/About'

function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={<MainLayout />}
      >
        <Route
          index
          element={<Home />}
         />

        <Route
          path='live-reports'
          element={<LiveReports />}
        />

        <Route
          path='ai-recommendations'
          element={<AIRecommendations />}
        />

        <Route
          path='about'
          element={<About />}
        />  </Route>
    </Routes>
  )
}

export default App