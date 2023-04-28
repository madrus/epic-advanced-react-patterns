// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  // 🐨 Add a property called `togglerProps`. It should be an object that has
  // `aria-pressed` and `onClick` properties.
  // 💰 {'aria-pressed': on, onClick: toggle}
  return {on, toggle, togglerProps: {'aria-pressed': on, onClick: toggle}}
}

function App() {
  const {on, togglerProps} = useToggle()
  return (
    <div>
      <Switch on={on} {...togglerProps} />
      <hr />
      <span {...togglerProps}>{on ? 'ON ' : 'OFF '}</span>
      <button aria-label="custom-button" {...togglerProps}>
        {on ? 'set off' : 'set on'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
