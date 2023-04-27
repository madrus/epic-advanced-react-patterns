// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

function Toggle(props) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return React.Children.map(props.children, child =>
    allowedTypes.includes(child.type)
      ? React.cloneElement(child, {on, toggle})
      : child
  )
}

// Accepts `on` and `children` props and returns `children` if `on` is true
const ToggleOn = ({on, children}) => (on ? children : null)

// Accepts `on` and `children` props and returns `children` if `on` is false
const ToggleOff = ({on, children}) => (on ? null : children)

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
const ToggleButton = ({on, toggle}) => <Switch on={on} onClick={toggle} />

//=> this list will cause our MyToggleMessage component to be ignored
const allowedTypes = [ToggleOn, ToggleOff, ToggleButton]
//=> this list will allow our MyToggleMessage to render correctly
// const allowedTypes = [ToggleOn, ToggleOff, ToggleButton, MyToggleMessage]

function MyToggleMessage({on, toggle}) {
  return on ? 'the button is on yo!' : 'the button is off sooooooo...'
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
        <MyToggleMessage />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
