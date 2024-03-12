import "./App.css";
import React, { useState, useEffect } from "react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pastSearchTerms, setPastSearchTerms] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const API_KEY = "https://jsonplaceholder.typicode.com/users";

  useEffect(() => {
    fetchData();
    loadPastSearchTerms();
  }, []); // Load past search terms after the initial render

  useEffect(() => {
    savePastSearchTerms();
  }, [pastSearchTerms]); // Save past search terms whenever they change

  async function fetchData() {
    try {
      const response = await fetch(API_KEY);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      console.log(data);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim() !== "") {
      setPastSearchTerms((prevTerms) => [...prevTerms, searchTerm]);
    }
  };

  const loadPastSearchTerms = () => {
    const storedTerms = localStorage.getItem("pastSearchTerms");
    if (storedTerms) {
      setPastSearchTerms(JSON.parse(storedTerms));
    }
  };

  const savePastSearchTerms = () => {
    localStorage.setItem("pastSearchTerms", JSON.stringify(pastSearchTerms));
  };

  const sortedUsers = [...data].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  const filteredAndSortedUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <div className="App" style={{ textAlign: "left",  marginLeft: "30px"  }}>
      <h1>User List</h1>
      <div>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={() => handleSearchSubmit()}>Search</button>
        <div style={{ padding: "10px" }}>
          <button onClick={handleSortClick}>
            Sort by Name {sortOrder === "asc" ? "desc" : "asc"}
          </button>
        </div>
      </div>
      <div>
      <div>
        <h3>Past Search Terms:</h3>
        <ul>
          {pastSearchTerms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>
      </div>
      <ul>
        {filteredAndSortedUsers.map((user) => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Address: {`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}</p>
            <p>Company: {user.company.name}</p>
            <p>Website: {user.website}</p>
          </li>
        ))}
      </ul>
     </div>
  );
}
