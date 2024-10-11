import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";




function MyApp() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );


  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) { 
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          throw new Error("couldn't add user");
        }
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function removeOneCharacter(id) {
    const promise = fetch(`Http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
    .then((response) => {
      if (response.ok) {
        const updated = characters.filter((character) => character.id !== id);
        setCharacters(updated);
      } else {
        console.error("Couldn't delete user")
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }

  // function updateList(person) {
  //   setCharacters([...characters, person]);
  // }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
}

export default MyApp;
