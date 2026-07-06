import { useState, useMemo } from "react";

// 🔥 debounce helper
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function SubmitRisk() {
  const [form, setForm] = useState({
    description: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  const [image, setImage] = useState(null); // ✅ FIXED
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  /* ---------------- ADDRESS SEARCH ---------------- */
  const fetchSuggestions = async (value) => {
    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      console.log("Searching:", value);
      const url = userLocation
        ? `http://localhost:3000/api/geocode?q=${encodeURIComponent(value)}&lat=${userLocation.lat}&lon=${userLocation.lon}`
        : `http://localhost:3000/api/geocode?q=${encodeURIComponent(value)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSuggestions(data.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce(fetchSuggestions, 400),
    []
  );

  const handleAddressChange = (value) => {
    setForm((prev) => ({ ...prev, address: value }));
    debouncedSearch(value);
  };

  /* ---------------- GEOLOCATION ---------------- */
  const useMyLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      // ✅ store for nearby search
      setUserLocation({
        lat,
        lon
      });

      // ✅ update form
      setForm((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
        address: "Current Location"
      }));

      console.log("Location success:", lat, lon);
    },

    (err) => {
      console.error(err);

      if (err.code === 1) {
        alert("Location permission denied");
      } else {
        alert("Unable to fetch location");
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
};
  /* ---------------- SUBMIT (FIXED) ---------------- */
const handleSubmit = async () => {
  if (loading) return;

  setLoading(true);

  try {
    let { latitude, longitude } = form;

    // fallback geocode
    if (!latitude || !longitude) {
      const res = await fetch(
        `http://localhost:3000/api/geocode?q=${encodeURIComponent(form.address)}`
      );
      const data = await res.json();

      if (data.length > 0) {
        latitude = data[0].lat;
        longitude = data[0].lon;
      } else {
        alert("Location not found");
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("description", form.description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("http://localhost:3000/api/risks", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Submit failed");
      setLoading(false);
      return;
    }

    alert("✅ Risk submitted!");

    setForm({
      description: "",
      address: "",
      latitude: "",
      longitude: ""
    });

    setImage(null);
    setSuggestions([]);

  } catch (err) {
    console.error(err);
    alert("Submit failed"); // ✅ FIXED
  }

  setLoading(false);
};

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Report Risk</h2>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Describe the risk..."
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          style={styles.textarea}
        />

        {/* 🔥 IMAGE INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={styles.input}
        />

        {/* ADDRESS */}
        <input
          placeholder="Search address"
          value={form.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          style={styles.input}
        />

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
          <div style={styles.suggestionsBox}>
            {suggestions.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    address: item.display_name,
                    latitude: item.lat,
                    longitude: item.lon
                  }));
                  setSuggestions([]);
                }}
                style={styles.suggestionItem}
              >
                {item.display_name}
              </div>
            ))}
          </div>
        )}

        {/* LAT LNG */}
        <div style={styles.row}>
          <input
            placeholder="Latitude"
            value={form.latitude}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, latitude: e.target.value }))
            }
            style={styles.input}
          />
          <input
            placeholder="Longitude"
            value={form.longitude}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, longitude: e.target.value }))
            }
            style={styles.input}
          />
        </div>

        <button onClick={useMyLocation} style={styles.secondaryBtn}>
          📍 Use My Location
        </button>

        <button onClick={handleSubmit} style={styles.primaryBtn}>
          {loading ? "Submitting..." : "Submit Risk"}
        </button>
      </div>
    </div>
  );
}

// 🎨 styles
const styles = {
  page: {
    background: "#0b1220",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#e2e8f0"
  },
  card: {
    width: "500px",
    background: "#1e293b",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: "20px"
  },
  textarea: {
    width: "100%",
    height: "120px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    padding: "12px",
    marginBottom: "15px"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    marginBottom: "10px"
  },
  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },
  suggestionsBox: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "10px",
    marginBottom: "15px",
    maxHeight: "150px",
    overflowY: "auto"
  },
  suggestionItem: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #1e293b"
  },
  secondaryBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#94a3b8",
    marginBottom: "10px"
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  }
};