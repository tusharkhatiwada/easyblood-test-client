import * as React from "react";

import { initializeApp } from "firebase/app";
import {
  httpsCallable,
  getFunctions,
  connectFunctionsEmulator,
} from "@firebase/functions";
import { getFirestore, connectFirestoreEmulator } from "@firebase/firestore";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
} from "@firebase/auth";
import "./App.css";

import { firebaseConfig } from "./firebaseConfig";

initializeApp(firebaseConfig);

const auth = getAuth();
const functions = getFunctions();
const db = getFirestore();

if (window.location.hostname === "localhost") {
  connectFunctionsEmulator(getFunctions(), "127.0.0.1", 5001);
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

function App() {
  const [input, setInput] = React.useState({
    email: "",
    password: "",
  });
  const handleClick = async () => {
    try {
      const getDonors = httpsCallable(functions, "getDonors");
      getDonors()
        .then((result) => {
          console.log("====Result====", result);
        })
        .catch((error) => {
          console.log("====Error get donors====", error);
        });
    } catch (error) {
      console.log("===Error====", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = input;
      const createUser = httpsCallable(functions, "createUser");
      createUser({ email, password })
        .then((result) => {
          console.log("====Create User result====", result);
        })
        .catch((error) => {
          console.log("====Error create user===", error);
        });
    } catch (error) {
      console.log("===Error creating user====", error);
    }
  };
  const handleCreateAdminUser = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = input;
      const createAdminUser = httpsCallable(functions, "createAdminUser");
      createAdminUser({ email, password })
        .then((result) => {
          console.log("====Create Admin User result====", result);
        })
        .catch((error) => {
          console.log("====Error create admin user===", error);
        });
    } catch (error) {
      console.log("===Error creating user====", error);
    }
  };

  const handleAddDonor = async () => {
    const setDonor = httpsCallable(functions, "setDonor");
    const data = {
      name: "John Doe",
      email: "john@gmail.com",
      phone: "08123456789",
      sex: "Male",
      bloodType: "A",
    };
    setDonor(data)
      .then((result) => {
        console.log("====Result====", result);
      })
      .catch((error) => {
        console.log("====Error get donors====", error);
      });
  };
  const handleAddEvent = async () => {
    const setEvent = httpsCallable(functions, "setEvent");
    const data = {
      name: "John Doe",
      email: "john@gmail.com",
      phone: "08123456789",
      sex: "Male",
      bloodType: "A",
    };
    setEvent(data)
      .then((result) => {
        console.log("====Resul eventt====", result);
      })
      .catch((error) => {
        console.log("====Error get donors====", error);
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = input;
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          console.log("====Login result====", result);
        })
        .catch((error) => {
          console.log("====Error login===", error);
        });
    } catch (error) {
      console.log("===Error login====", error);
    }
  };

  return (
    <>
      <div></div>
      <h1>Easyblood Client test</h1>
      <div>
        <form onSubmit={handleCreateUser}>
          <input type='text' name='email' onChange={handleInputChange} />
          <input type='text' name='password' onChange={handleInputChange} />
          <button type='submit'>Create User</button>
        </form>
        <div>
          <form onSubmit={handleCreateAdminUser}>
            <input type='text' name='email' onChange={handleInputChange} />
            <input type='text' name='password' onChange={handleInputChange} />
            <button type='submit'>Create Admin User</button>
          </form>
        </div>
        <form onSubmit={handleLogin}>
          <input type='text' name='email' onChange={handleInputChange} />
          <input type='text' name='password' onChange={handleInputChange} />
          <button type='submit'>Login</button>
        </form>
      </div>
      <div className='card'>
        <button onClick={handleAddDonor}>Add Donors</button>
        <button onClick={handleAddEvent}>Add Event</button>
        <button onClick={handleClick}>Click Here</button>
      </div>
    </>
  );
}

export default App;
