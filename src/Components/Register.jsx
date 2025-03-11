import React, { useEffect, useState } from "react";
import registerdetails from "./registerdetails.json";
import { useContext } from "react";
import { ApiContext } from "../config/baseUrl";
import { useSelector } from "react-redux";

const Registration = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const [provinces, setProvinces] = useState([]);
  const [district, setDistrict] = useState([]);
  const [tempDistrict, setTemptDistrict] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [tempMunicipalities, setTempMunicipalities] = useState([]);
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const loanType = [
    {
      value: "Other Loan",
      name: "Other Loan",
    },
    {
      value: "Pregnancy Loan",
      name: "Pregnancy Loan",
    },
    {
      value: "Home Loan",
      name: "Home Loan",
    },
  ];
  const educationLevel = ["SLC", "+2", "Bachelor", "Master", "PhD"];
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    father_name: "",
    grand_father_name: "",
    mother_name: "",
    username: "",
    password: "",
    email: "",
    perm_state: "",
    perm_district: "",
    perm_municipality: "",
    perm_ward_no: "",
    temp_state: "",
    temp_district: "",
    temp_municipality: "",
    temp_ward_no: "",
    citizenship_id: "",
    citizenship_date_of_issue: "",
    citizenship_district: "",
    home_number: "",
    phone_number: "",
    mobile_number: "",
    date_joined: "",
    recess_date: "",
    position: "",
    position_category: "",
    employee_id: "",
    employee_type: "",
    na_la_kos_no: "",
    accumulation_fund_no: "",
    bank_account_no: "",
    bank_name: "",
    duration: "",
    office: "",
    department: "",
    user_type: "",
    loan_type: "",
    loan_name: "",
    interest_rate: "",
    max_amount: "",
    min_amount: "",
    max_tenure: "",
    min_tenure: "",
    education_level: "",
    institution: "",
    board: "",
    percentage: "",
    year: "",
    award_name: "",
    award_description: "",
    punishment_name: "",
    punishment_description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchProvince();
    fetchOffice();
  }, []);

  useEffect(() => {
    if (formData.office) {
      fetchDepartment(formData.office);
    }
  }, [formData.office]);

  const fetchProvince = async () => {
    try {
      const response = await fetch(`${baseUrl}/provinces/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchDistrict = async (province) => {
    try {
      const response = await fetch(`${baseUrl}/districts/${province}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDistrict(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchTempDistrict = async (province) => {
    try {
      const response = await fetch(`${baseUrl}/districts/${province}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTemptDistrict(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchMunicipality = async (district) => {
    try {
      const response = await fetch(
        `${baseUrl}/municipalities/${selectedProvince}/${district}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchTempMunicipality = async (district) => {
    try {
      const response = await fetch(
        `${baseUrl}/municipalities/${selectedProvince}/${district}/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTempMunicipalities(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchOffice = async () => {
    try {
      const response = await fetch(`${baseUrl}/offices/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchDepartment = async (officeId) => {
    try {
      const response = await fetch(`${baseUrl}/offices/${officeId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched Office Data:", data);

      // Directly set departments from the response
      setDepartments(data.departments || []); // Ensure it's always an array
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]); // Prevents UI crashes
    }
  };

  const handleOfficeChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      office: value,
      department: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      loan: {
        loan_type: formData.loan_type,
        name: formData.loan_name,
        interest_rate: parseFloat(formData.interest_rate),
        max_amount: parseFloat(formData.max_amount),
        min_amount: parseFloat(formData.min_amount),
        max_tenure: parseInt(formData.max_tenure, 10),
        min_tenure: parseInt(formData.min_tenure, 10),
      },
      education: {
        education_level: formData.education_level,
        institution: formData.institution,
        board: formData.board,
        percentage: parseFloat(formData.percentage),
        year: parseInt(formData.year, 10),
      },
      awards: {
        name: formData.award_name,
        description: formData.award_description,
      },
      punishments: {
        name: formData.punishment_name,
        description: formData.punishment_description,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/user/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
      console.log(formattedData);
      if (response.ok) {
        const result = await response.json();
        alert("Form submitted successfully!");
        // window.location.reload();
        console.log(result);
      } else {
        alert("Failed to submit the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "perm_state") {
      setMunicipalities([]);
      fetchDistrict(event.target.value);
    } else {
      setTempMunicipalities([]);
      fetchTempDistrict(value);
    }
  };

  const handleDistrictChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name == "perm_district") {
      fetchMunicipality(event.target.value);
    } else {
      fetchTempMunicipality(value);
    }
  };

  const handleMunicipalityChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form
      className="md:w-[90%] w-full mx-auto p-6 space-y-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-[#E68332]">
        Employee Registration Form
      </h1>

      {/* Account Information */}
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Personal Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              first name
            </span>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">last name</span>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Father name
            </span>
            <input
              type="text"
              name="father_name"
              value={formData.father_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Mother name
            </span>
            <input
              type="text"
              name="mother_name"
              value={formData.mother_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Grand father name
            </span>
            <input
              type="text"
              name="grand_father_name"
              value={formData.grand_father_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Account Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
        </div>
      </fieldset>

      {/* Permanent Address */}
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Permanent Address
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">State</span>

            <select
              name="perm_state"
              value={formData.perm_state}
              onChange={handleProvinceChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a Province</option>{" "}
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">District</span>

            <select
              name="perm_district"
              value={formData.perm_district}
              onChange={handleDistrictChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a district</option>{" "}
              {district.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Municipality
            </span>

            <select
              name="perm_municipality"
              value={formData.perm_municipality}
              onChange={handleMunicipalityChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a municipalities</option>{" "}
              {municipalities.map((municipalities, index) => (
                <option key={index} value={municipalities}>
                  {municipalities}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Ward No.</span>
            <input
              type="text"
              name="perm_ward_no"
              value={formData.perm_ward_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Temporary Address
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">State</span>

            <select
              name="temp_state"
              value={formData.temp_state}
              onChange={handleProvinceChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a Province</option>{" "}
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">District</span>

            <select
              name="temp_district"
              value={formData.temp_district}
              onChange={handleDistrictChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a district</option>{" "}
              {tempDistrict.map((district, index) => (
                <option key={index} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              Municipality
            </span>

            <select
              name="temp_municipality"
              value={formData.temp_municipality}
              onChange={handleMunicipalityChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a municipalities</option>{" "}
              {tempMunicipalities.map((municipalities, index) => (
                <option key={index} value={municipalities}>
                  {municipalities}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">Ward No.</span>
            <input
              type="text"
              name="temp_ward_no"
              value={formData.temp_ward_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Citizenship Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Citizenship ID:
            <input
              type="text"
              name="citizenship_id"
              value={formData.citizenship_id}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Date of Issue:
            <input
              type="date"
              name="citizenship_date_of_issue"
              value={formData.citizenship_date_of_issue}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            District of Issue:
            <input
              type="text"
              name="citizenship_district"
              value={formData.citizenship_district}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Contact Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Home Number:
            <input
              type="text"
              name="home_number"
              value={formData.home_number}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Phone Number:
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Mobile Number:
            <input
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Job Details
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Date Joined:
            <input
              type="date"
              name="date_joined"
              value={formData.date_joined}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Recess Date:
            <input
              type="date"
              name="recess_date"
              value={formData.recess_date}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Position:
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Position Category:
            <select
              onChange={handleChange}
              name="position_category"
              value={formData.position_category}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select position category </option>

              <option value={"Darbandi"}>Darbandi</option>
              <option value={"Kaaj"}>Kaaj</option>
            </select>
          </label>
          <label className="flex flex-col">
            Employee ID:
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Employee Type:
            <select
              onChange={handleChange}
              name="employee_type"
              value={formData.employee_type}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select employee type</option>
              {registerdetails.employment_types.map((types, index) => (
                <option value={types} key={index}>
                  {types}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Duration:
            <input
              type="date"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>

          <label className="flex flex-col">
            Office:
            <select
              name="office"
              value={formData.office}
              onChange={handleOfficeChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select an Office</option>
              {offices.map((office, index) => (
                <option key={index} value={office.id}>
                  {office.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col">
            Department:
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={!formData.office}
            >
              <option value="">Select a Department</option>
              {departments.length > 0 ? (
                departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))
              ) : (
                <option disabled>No departments available</option>
              )}
            </select>
          </label>

          <label className="flex flex-col">
            User level :
            <select
              onChange={handleChange}
              name="user_type"
              value={formData.user_type}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select level </option>

              <option value={1}>Faat</option>
              <option value={2}>Branch Head</option>
              <option value={3}>Branch officer</option>
              <option value={4}>Division Head</option>
              <option value={5}>Admin</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Bank Details
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Na La Kos No:
            <input
              type="text"
              name="na_la_kos_no"
              value={formData.na_la_kos_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Accumulation Fund No:
            <input
              type="text"
              name="accumulation_fund_no"
              value={formData.accumulation_fund_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Bank Account No:
            <input
              type="text"
              name="bank_account_no"
              value={formData.bank_account_no}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Bank Name:
            <select
              onChange={handleChange}
              name="bank_name"
              value={formData.bank_name}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option className="bg-gray-400">select bank</option>
              {registerdetails.banks.map((banks, index) => (
                <option value={banks} key={index}>
                  {banks}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Loan Information
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Loan Type:
            <select
              onChange={handleChange}
              name="loan_type"
              value={formData.loan_type}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select loan type</option>
              {loanType.map((types, index) => (
                <option value={types.value} key={index}>
                  {types.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Loan Name:
            <input
              type="text"
              name="loan_name"
              value={formData.loan_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Interest Rate:
            <input
              type="number"
              name="interest_rate"
              value={formData.interest_rate}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Max Amount:
            <input
              type="number"
              name="max_amount"
              value={formData.max_amount}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Min Amount:
            <input
              type="number"
              name="min_amount"
              value={formData.min_amount}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Max Tenure:
            <input
              type="number"
              name="max_tenure"
              value={formData.max_tenure}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Min Tenure:
            <input
              type="number"
              name="min_tenure"
              value={formData.min_tenure}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Education
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Education Level:
            <select
              onChange={handleChange}
              name="education_level"
              value={formData.education_level}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>select education Level</option>
              {educationLevel.map((types, index) => (
                <option value={types} key={index}>
                  {types}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col">
            Institution:
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Board:
            <input
              type="text"
              name="board"
              value={formData.board}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Percentage:
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Year:
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">Awards</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Award Name:
            <input
              type="text"
              name="award_name"
              value={formData.award_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Description:
            <input
              type="text"
              name="award_description"
              value={formData.award_description}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="border border-orange-400 p-4 rounded">
        <legend className="text-lg font-semibold text-[#E68332]">
          Punishments
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Punishment Name:
            <input
              type="text"
              name="punishment_name"
              value={formData.punishment_name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
          <label className="flex flex-col">
            Description:
            <input
              type="text"
              name="punishment_description"
              value={formData.punishment_description}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full bg-[#E68332] text-white font-semibold py-2 rounded hover:bg-[#c27434] transition"
      >
        Submit
      </button>
    </form>
  );
};

export default Registration;
