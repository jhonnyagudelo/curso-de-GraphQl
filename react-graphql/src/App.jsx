import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Persons } from "./Persons";
import { PersonForm } from "./PersonForm";
import { usePersons } from "./hooks/usePerson";
import { Notify } from "./Notify";
import { PhoneForm } from "./PhoneForm";
function App() {
  const { data, error, loading } = usePersons();
  const [errorMessage, setErrorMessage] = useState(false);

  if (error) return <span style="color:red">{error}</span>;

  const notifyError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  return (
    <div className="App">
      <Notify errorMessage={errorMessage} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loading ? <p>Loading...</p> : <Persons persons={data?.allPersons} />}
        <PersonForm notifyError={notifyError} />
        <PhoneForm />
      </header>
    </div>
  );
}

export default App;
