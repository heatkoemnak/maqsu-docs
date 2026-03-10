import React, { useMemo } from "react";
import { useLocation } from "@docusaurus/router";
import useGlobalData from "@docusaurus/useGlobalData";
import Topics from "../components/Topics";

export default function DynamicPage({ slug: slugProp }) {
  const location = useLocation();
  const globalData = useGlobalData();

  const pageSlug = useMemo(() => {
    if (slugProp) return slugProp;
    const cleaned = location.pathname.replace(/\/$/, "");
    const segments = cleaned.split("/").filter(Boolean);
    return segments[0] || "";
  }, [location.pathname, slugProp]);

  const category =
    globalData?.["categories-data"]?.default?.bySlug?.[pageSlug] ?? null;

  return <Topics topics={category} />;
}
