import { useState } from 'react'
import EmployeeAddress from "./Components/EmployeeAddress";

function App() {
  const [count, setCount] = useState(0)

  return (
  
     <div>
            <EmployeeAddress />
        </div>
  )
}

export default App
