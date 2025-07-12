/* ///////////////
    Local Storage Function
/////////////// */


// Save item to Local Storage
export const saveToLocalStorage = (key, value) => {
    try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
    } catch (error) {
        console.error("Error saving to local storage:", error);
    }
};

// Get item to Local Storage
export const getFromLocalStorage = (key) => {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
        console.error("Error retrieving from local storage:", error);
        return null;
    }
};

// Remove item from Local Storage
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from local storage:", error);
    }
};

// Clear all Local Storage
export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error("Error clearing local storage:", error);
    }
};



/* ///////////////
    Cookie Functions
/////////////// */

// Set a cookie with an optional expiration (in days)
export const setCookie = (name, value, days = 7) => {
    try {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    } catch (error) {
        console.error("Error setting cookie:", error);
    }
};

// Get a cookie value by name
export const getCookie = (name) => {
    try {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split("=");
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    } catch (error) {
        console.error("Error getting cookie:", error);
        return null;
    }
};

// Remove a cookie by setting its expiration to the past
export const removeCookie = (name) => {
    try {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    } catch (error) {
        console.error("Error removing cookie:", error);
    }
};
