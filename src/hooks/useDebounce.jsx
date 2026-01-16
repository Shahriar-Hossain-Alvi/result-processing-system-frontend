import { useEffect, useState } from "react";


export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value); // State to store the debounced value
    useEffect(() => {
        // Update the debounced value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value); // the searched string will be added in the state after the delay eg 500ms
        }, delay);

        // Clear the timeout if the value changes before the delay is over
        return () => {
            clearTimeout(handler);
        }
    }, [value, delay])

    return debouncedValue; // returned data searched string after the delay
}