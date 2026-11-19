import './style/index.css'
import { Outlet } from 'react-router'
import Watermark from './components/ui/Watermark'

const App = () => {
  return (
    <main>
      <Outlet />
      <Watermark />
    </main>
  )
}

export default App
