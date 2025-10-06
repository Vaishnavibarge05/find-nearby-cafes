# Find Nearby Cafes ☕

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.9-lightgrey?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

**Find Nearby Cafes** is an interactive web application built with **React** and **Leaflet.js** that helps users easily discover cafes near their current location. The app combines real-time geolocation, an interactive map, and a sidebar list for a smooth and intuitive experience.

---

Find nearby cafes on an interactive map with React and Leaflet.js.

---

## Features

- **User location detection:** Map centers automatically on the user’s current position.  
- **Dynamic cafe markers:** Interactive markers display cafe name, address, and distance.  
- **Sidebar cafe list:** Click any cafe to pan the map to its location.  
- **Distance filtering:** Filter cafes within a selected radius using a slider.  
- **Visual enhancements:** Gradient sidebar, hover effects, distance badges, and radius circle for nearby cafes.  
- **Responsive and intuitive UI** for desktop and mobile users.

---

## Setup & Run Locally

1. **Clone the repository:**  
```bash
git clone https://github.com/vaishnavibarge05/find-nearby-cafes.git
cd find-nearby-cafes
````

2. **Install dependencies and run the project:**

```bash
npm install
npm run dev
```

3. **Open in browser:**
   Visit `http://localhost:5173/` to see the app running.

---

## Test Cases

* Test the distance calculation function:

```js
const distance = getDistanceFromLatLonInKm(18.5204, 73.8567, 18.5196, 73.8553);
console.log(distance.toFixed(2)); // ~0.14 km
```

* Manual testing:

  * Click cafe markers on the map.
  * Click cafes in the sidebar to pan the map.
  * Adjust the distance slider to filter cafes.

---

## Assumptions & Design Choices

* Cafes are stored in a **local JSON file**; no backend is required.
* **Leaflet.js** with OpenStreetMap tiles is used for mapping.
* **React useReducer** manages state for UI interactions.
* Fully client-side, visually appealing, and user-friendly interface.

---

## Future Enhancements

* Fetch cafes dynamically from an API.
* Make the sidebar fully mobile-responsive.
* Add a search feature to quickly find cafes.
* Display walking/driving routes using a routing API.

---

**Author:** Vaishnavi Barge
**GitHub:** [Vaishnavibarge05](https://github.com/Vaishnavibarge05)

```


