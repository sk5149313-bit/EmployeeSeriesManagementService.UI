
import { useEffect, useState } from "react";
import axios from "axios";

function EmployeeAddress() {

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1: Get all work cities
    useEffect(() => {
    const getCities = async () => {
        try {
            const response = await axios.get(
                "https://localhost:44333/api/employees/WorkCity"
            );

            console.log("City API response:", response.data);

            setCities(Array.isArray(response.data) ? response.data : []);
        }
        catch (error) {
            setError("Unable to load work cities");
            console.error("City API error:", error);
        }
    };

    getCities();
}, []);
    // Step 2: Get employees whenever selected city changes
    useEffect(() => {

        if (!selectedCity) {
            setEmployees([]);
            return;
        }

        const getEmployees = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    "https://localhost:44333/api/employees/work-address",
                    {
                        params: {
                            workCity: selectedCity
                        }
                    }
                );

                setEmployees(response.data);
            }
            catch (error) {
                setError("Unable to load employees");
                console.error(error);
            }
            finally {
                setLoading(false);
            }
        };

        getEmployees();

    }, [selectedCity]);

    return (
        <div>
            <h2>Employee Address Management</h2>

            {/* City Dropdown */}
            <label>Select Work City: </label>

            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
            >
                <option value="">-- Select City --</option>

                {cities.map((city) => (
    <option key={city.cityName} value={city.cityName}>
        {city.cityName}
    </option>
))}
            </select>

            {/* Employee List */}
            <h3>Employees</h3>

            {loading && <p>Loading employees...</p>}

            {error && <p>{error}</p>}

            {!loading && selectedCity && employees.length === 0 && !error && (
                <p>No employees found.</p>
            )}
{employees.map((emp) => (
    <div key={emp.employeeId}>
        <hr />

        <table>

        <tr>
            <th>Employee Name</th>
            <th>Permanent Address</th>
        </tr>
        <tr>
<td>
        
            {emp.firstName} {emp.lastName}
        
</td>
<td>
        

        {emp.personalAddress && (
            <>      
{emp.personalAddress.floor}, {emp.personalAddress.building}, {emp.personalAddress.street}, {emp.personalAddress.city}, <p>{emp.personalAddress.country}, {emp.personalAddress.zipCode} </p>
                
            </>
        )}
        </td>
</tr>
        </table>
    </div>
))}
        </div>
    );
}

export default EmployeeAddress;
