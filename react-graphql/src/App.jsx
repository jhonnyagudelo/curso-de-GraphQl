import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { gql, useQuery } from "@apollo/client";
import { Persons } from "./Persons";
const ALL_PERSON = gql`
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
    }
  }
`;

function App() {
  const { data, error, loading } = useQuery(ALL_PERSON);

  if (error) return <span style="color:red">{error}</span>;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loading ? <p>Loading...</p> : <Persons persons={data?.allPersons} />}
      </header>
    </div>
  );
}

export default App;
