import { useEffect, useMemo, useState } from "react";
import { BookContext } from "./BookContext";
import globalData from "@generated/globalData";
import { useLocation } from "@docusaurus/router";

export function BookProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [allGroups, setAllGroups] = useState([]);
  const [posts, setPosts] = useState([]);
  const [active, setActive] = useState(null);
  const location = useLocation();

  const toggleMenuOpen = () => {
    setMenuOpen((prev) => !prev);   
  };


  const { pageSlug, endPath } = useMemo(() => {
      const cleaned = location.pathname.replace(/\/$/, '');
      const segments = cleaned.split('/').filter(Boolean);
      return {
        pageSlug: segments[0],
        endPath: segments[1] || null,
      };
    }, [location.pathname]);

   
  useEffect(() => {
      if (!pageSlug) return;
  
      const bySlug = globalData?.['categories-data']?.default?.bySlug ?? {};
      const category = bySlug[pageSlug] ?? null;
      const sections = category?.groupSections || [];
  
      setAllGroups(sections);
  
      if (endPath) {
        const matchedGroup = sections.find((group) => group.uid === endPath);
        setPosts(matchedGroup ? [matchedGroup] : sections);
      } else {
        setPosts(sections);
      }
  
      setActive(null);
    }, [pageSlug, endPath, globalData]);

     const hasSubcategories = useMemo(
        () => posts.some((group) => (group.sections?.length || 0) > 0),
        [posts],
    );

   
  return (
    <BookContext.Provider value={{ menuOpen, toggleMenuOpen,posts, hasSubcategories , allGroups, active, setActive,pageSlug,endPath  }}>
      {children}
    </BookContext.Provider>
  );
}