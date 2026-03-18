'use client';

import { useState } from "react";
import CategoryNav from "./CategoryNav";
import BlogGrid from "./BlogGrid";

const JournalClient = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  return (
    <>
      <CategoryNav
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <BlogGrid activeCategory={activeCategory} />
    </>
  );
};

export default JournalClient;