import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Explore from "../Explore/Explore";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <main className="container py-5 mt-5">
      <Header />
      <Explore category={category} setCategory={setCategory} />
      <FoodDisplay category={category} search={""} />
    </main>
  );
};

export default Home;
