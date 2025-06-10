import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";
import styled from 'styled-components';

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

const filterButtons = [
    { name: "All", type: "all" },
    { name: "Fire", type: "fire" },
    { name: "Water", type: "water" },
    { name: "Grass", type: "grass" },
    { name: "Electric", type: "electric" },
    { name: "Poison", type: "poison" },
  ];


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

  const filterPokemon = (type) => {
    setSelectedType(type);
  };

  const filteredPokemon = pokemon.filter((curPokemon) => {
    const matchesSearch = curPokemon.name.toLowerCase().includes(search.toLowerCase());
    
    if (selectedType === "all") {
      return matchesSearch;
    }
    
    return matchesSearch && 
      curPokemon.types.some(typeInfo => typeInfo.type.name === selectedType);
  });

  if (loading) {
    return <div className="loader-container"><h1>Loading....</h1></div>;
  }

  if (error) {
    return <div><h1>{error.message}</h1></div>;
  }

  return (
    <>
      <section className="container">
        <header>
  <HeaderContainer>
    {/* Left corner image */}
    <CornerImage 
      src="/pokeball.png" 
      alt="Left decoration" 
      className="left" 
    />
    
    {/* Centered title */}
    <ImageTitle>
      <img  src="/fontbolt.png" alt="Pokémon Title" />
    </ImageTitle>
    
    {/* Right corner image */}
    <CornerImage 
      src="/pokeball.png" 
      alt="Right decoration" 
      className="right" 
    />
  </HeaderContainer>
</header>
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
        
        <div className="filter-buttons">
          {filterButtons.map((btn) => (
            <button
              key={btn.type}
              className={selectedType === btn.type ? "active" : ""}
              onClick={() => filterPokemon(btn.type)}
            >
              {btn.name}
            </button>
          ))}
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

const ImageTitle = styled.div`
  text-align: center;
  margin: 20px 0;
  
  img {
    height: auto; 
    width: auto;  
    max-width: 100%; 
    max-height: 100px; 
    object-fit: contain;
    filter: drop-shadow(2px 2px 4px rgb(59, 165, 172));
  }
`;

const HeaderContainer = styled.header`
  position: relative; 
  text-align: center;
  padding: 20px 60px; 
`;

const CornerImage = styled.img`
  position: absolute;
  top:4rem;
  height: 90px; 
  width: auto;
  filter: drop-shadow(2px 2px 4px rgb(59, 165, 172));

  &.left {
    left: 2rem;
  }
 
  &.right {
    right: 2rem;
  }
    @media (max-width: 900px) {
    display: none;
  }
`;