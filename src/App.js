import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://crio-location-selector.onrender.com/countries");
        if (!res.ok) throw new Error("Failed to fetch countries");
        const data = await res.json();
        setCountries(data);
        console.log("countries",res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country selected
  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        try {
          const res = await fetch(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
          );
          if (!res.ok) throw new Error("Failed to fetch states");
          const data = await res.json();
          setStates(data);
        } catch (err) {
          setError(err.message);
        }
      } else {
        setStates([]);
        setSelectedState("");
      }
    };
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state selected
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedCountry && selectedState) {
        try {
          const res = await fetch(
            `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
          );
          if (!res.ok) throw new Error("Failed to fetch cities");
          const data = await res.json();
          setCities(data);
        } catch (err) {
          setError(err.message);
        }
      } else {
        setCities([]);
        setSelectedCity("");
      }
    };
    fetchCities();
  }, [selectedState]);

  return (
    <div className="App">   

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Country Dropdown */}
      <select
        data-testid="country-dropdown"
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setSelectedState("");
          setSelectedCity("");
        }}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {/* State Dropdown */}
      <select
        data-testid="state-dropdown"
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedCity("");
        }}
        disabled={!selectedCountry}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.id} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>

      {/* City Dropdown */}
      <select
        data-testid="city-dropdown"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedState}
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      {/* Show selection */}
      {selectedCountry && selectedState && selectedCity && (
        <p data-testid="result">{`You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`}</p>
      )}
    </div>
  );
}

export default App;
