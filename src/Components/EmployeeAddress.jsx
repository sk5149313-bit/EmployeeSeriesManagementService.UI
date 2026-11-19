
import { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeAddress.css";

function EmployeeAddress() {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [error, setError] = useState("");
    const [cityError, setCityError] = useState("");

    // Load work cities
    useEffect(() => {
        const controller = new AbortController();

        const getCities = async () => {
            try {
                setLoadingCities(true);
                setCityError("");

                const response = await axios.get(
                    "https://localhost:44333/api/employees/WorkCity",
                    { signal: controller.signal }
                );

                setCities(
                    Array.isArray(response.data) ? response.data : []
                );
            }
            catch (err) {
                if (!axios.isCancel(err)) {
                    setCityError("Unable to load work cities.");
                    console.error(err);
                }
            }
            finally {
                if (!controller.signal.aborted) {
                    setLoadingCities(false);
                }
            }
        };

        getCities();

        return () => controller.abort();
    }, []);

    // Load employees whenever city changes
    useEffect(() => {
        if (!selectedCity) {
            setEmployees([]);
            setError("");
            return;
        }

        const controller = new AbortController();

        const getEmployees = async () => {
            try {
                setLoading(true);
                setError("");
                setEmployees([]);

                const response = await axios.get(
                    "https://localhost:44333/api/employees/work-address",
                    {
                        params: {
                            workCity: selectedCity
                        },
                        signal: controller.signal
                    }
                );

                setEmployees(
                    Array.isArray(response.data) ? response.data : []
                );
            }
            catch (err) {
                if (!axios.isCancel(err)) {
                    setError("Unable to load employee information.");
                    console.error(err);
                }
            }
            finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        getEmployees();

        return () => controller.abort();

    }, [selectedCity]);

    const formatAddress = (address) => {
        if (!address) return "Address not available";

        const parts = [
            address.floor,
            address.building,
            address.street,
            address.city,
            address.country,
            address.zipCode
        ];

        return parts
            .filter(value => value !== null &&
                value !== undefined &&
                String(value).trim() !== "")
            .join(", ") || "Address not available";
    };

    return (
        <div className="employee-dashboard">
            <div className="stats-container">

                <div className="stat-card">
                    <div className="stat-icon employee-icon">
                        👤
                    </div>

                    <div>
                        <span>Total Employees</span>
                        <h2>{employees.length}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon city-icon">
                        📍
                    </div>

                    <div>
                        <span>Selected Work City</span>
                        <h2 className="city-stat">
                            {selectedCity || "Not Selected"}
                        </h2>
                    </div>
                </div>

            </div>

            {/* City Selection */}
            <div className="filter-card">

                <div className="filter-heading">
                    <div>
                        <h3>Filter Employees</h3>
                        <p>Select a work city to view employees.</p>
                    </div>

                    <span className="filter-icon">⌕</span>
                </div>

                <div className="city-filter">
                    <label htmlFor="workCity">
                        Work Location
                    </label>

                    <select
                        id="workCity"
                        value={selectedCity}
                        onChange={(e) =>
                            setSelectedCity(e.target.value)
                        }
                        disabled={loadingCities}
                    >
                        <option value="">
                            {loadingCities
                                ? "Loading cities..."
                                : "-- Select Work City --"}
                        </option>

                        {cities.map((city) => (
                            <option
                                key={city.cityName}
                                value={city.cityName}
                            >
                                {city.cityName}
                            </option>
                        ))}
                    </select>

                    {cityError && (
                        <p className="error-message">
                            {cityError}
                        </p>
                    )}
                </div>

            </div>

            {/* Employee List */}
            <div className="employee-section">

                <div className="section-heading">
                    <div>
                        <h3>Employee Directory</h3>
                        <p>
                            {selectedCity
                                ? `Employees working in ${selectedCity}`
                                : "Select a city to see employee details"}
                        </p>
                    </div>

                    {selectedCity && !loading && !error && (
                        <span className="employee-count">
                            {employees.length} Employees
                        </span>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="status-card">
                        <div className="loader"></div>
                        <p>Loading employee information...</p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="status-card error-card">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Initial State */}
                {!selectedCity && !loading && (
                    <div className="empty-state">
                        <div className="empty-icon">📍</div>
                        <h3>Select a Work City</h3>
                        <p>
                            Choose a city above to view the
                            employee directory.
                        </p>
                    </div>
                )}

                {/* No Employees */}
                {!loading &&
                    selectedCity &&
                    !error &&
                    employees.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <h3>No Employees Found</h3>
                            <p>
                                There are no employees available
                                for {selectedCity}.
                            </p>
                        </div>
                    )}

                {/* Employee Cards */}
                {!loading && !error && employees.length > 0 && (
                    <div className="employee-grid">

                        {employees.map((emp) => {
                            const fullName = [
                                emp.firstName,
                                emp.lastName
                            ].filter(Boolean).join(" ");

                            return (
                                <div
                                    className="employee-card"
                                    key={emp.employeeId}
                                >
                                    <div className="employee-card-header">

                                        <div className="employee-avatar">
                                            {(
                                                emp.firstName?.charAt(0) ||
                                                "E"
                                            ).toUpperCase()}
                                        </div>

                                        <div className="employee-info">
                                            <h4>
                                                {fullName || "Unnamed Employee"}
                                            </h4>

                                            <span>
                                                Employee ID: {emp.employeeId}
                                            </span>
                                        </div>

                                        <span className="address-badge">
                                            Permanent
                                        </span>

                                    </div>

                                    <div className="address-divider"></div>

                                    <div className="address-heading">
                                        <span>📍</span>
                                        <h5>Permanent Address</h5>
                                    </div>

                                    <p className="address-text">
                                        {formatAddress(emp.personalAddress)}
                                    </p>

                                </div>
                            );
                        })}

                    </div>
                )}

            </div>

        </div>
    );
}

export default EmployeeAddress;
