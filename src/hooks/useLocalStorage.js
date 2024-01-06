import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  // Get from local storage then
  // Parse stored json or if none return initialValue
  const item = window.localStorage.getItem(key);
  const initial = item ? JSON.parse(item) : initialValue;
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(initial);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    // Save state
    setStoredValue(value);
    // Save to local storage
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
