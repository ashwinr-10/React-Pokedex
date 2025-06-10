import { useEffect, useState } from "react";

import { PokemonCards } from "./PokemonCards";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");




  const API = "https://pokeapi.co/api/v2/pokemon?limit=124";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        const data = await res.json();
        return data;
      });
      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);



  

  if (loading) {
    return <div className="loader-container"><h1>Loading....</h1></div>;
  }

  if (error) {
    return <div><h1>{error.message}</h1></div>;
  }

  return (
    <>
      <section className="container">

        <div className="pokemon-search">
          <input
            type="text"
            placeholder="search Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              backgroundImage: "url('/pokeball.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "10px center",
              backgroundSize: "20px",
              paddingLeft: "40px", 
              width: "100%",
              maxWidth: "400px",
              padding: "12px 15px 12px 40px",
              borderRadius: "24px",
              border: "2px solid #ff0000",
              fontSize: "16px",
              outline: "none"
        }}
          />
          
        </div>
       
        <div>
          <ul className="cards">
            {filteredPokemon.map((curPokemon) => (
              <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

