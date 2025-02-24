// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useControlledSwitchWarning(
  controlledPropValue,
  controlledPropName,
  componentName,
) {
  const isControlled = controlledPropValue != null
  const {current: wasControlled} = React.useRef(isControlled)
  const un = !wasControlled && isControlled
  const WARN_SWITCH = React.useMemo(
    () =>
      `\`${controlledPropName}\` is changing from ${
        un ? 'un' : ''
      }controlled to be ${
        un ? '' : 'un'
      }controlled. Components should not switch from ${
        un ? 'un' : ''
      }controlled to ${
        un ? '' : 'un'
      }controlled (or vice versa). Decide between using a controlled or uncontrolled \`${componentName}\` for the lifetime of the component. Check the \`on\` prop.`,
    [componentName, controlledPropName, un],
  )

  React.useEffect(() => {
		const noWarning = isControlled === wasControlled
    warning(noWarning, WARN_SWITCH)
  }, [isControlled, wasControlled, WARN_SWITCH])
}

function useOnChangeReadOnlyWarning(
  controlledPropValue,
  controlledPropName,
  componentName,
	hasOnChange,
	readOnly,
  readOnlyProp,
  initialValueProp,
  onChangeProp,
) {
  const WARN_READ_ONLY = React.useMemo(
    () =>
      `A \`${controlledPropName}\` prop was provided to a form field of  \`${componentName}\` without an \`${onChangeProp}\` handler. This will render a read-only field. If the field should be mutable use \`${initialValueProp}\`. Otherwise, set either \`${onChangeProp}\` or \`${readOnlyProp}\`.`,
    [
      componentName,
      controlledPropName,
      initialValueProp,
      onChangeProp,
      readOnlyProp,
    ],
  )
  const isControlled = controlledPropValue != null

	React.useEffect(() => {
    const noWarning =
      !isControlled ||
      hasOnChange ||
      readOnly
    // warning is visible if the condition is false
    warning(noWarning, WARN_READ_ONLY)
  }, [hasOnChange, readOnly, isControlled, WARN_READ_ONLY])
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // "!= null" is not null or undefined
  const onIsControlled = controlledOn != null
  const on = onIsControlled ? controlledOn : state.on

	if (process.env.NODE_ENV !== 'production') {
		// ! KCD finds it fine to break this rule of hooks here
		// ! as `process.env.NODE_ENV` will never ever change
		// ! for the whole lifetime of the application
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useControlledSwitchWarning(controlledOn, 'on', 'useToggle')
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useOnChangeReadOnlyWarning(
			controlledOn,
			'on',
			'useToggle',
			Boolean(onChange),
			readOnly,
		'readOnly',
		'initialOn',
		'onChange',
		)
	}

  function dispatchWithOnChange(action) {
    !onIsControlled && dispatch(action)
    onChange?.(reducer({...state, on}, action), action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, initialOn, reducer, readOnly}) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    initialOn,
    reducer,
    readOnly,
  })
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  // handleToggleChange looks a bit like a reducer except that
  // it does not return a new state
  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
