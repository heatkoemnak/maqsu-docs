import React, { useEffect, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

const compiledCache = new Map();

function MdxStringBrowser({ source, components }) {
  const [Content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!source) {
      setContent(null);
      setError(null);
      return;
    }

    let cancelled = false;
    async function compile() {
      try {
        setError(null);

        const cached = compiledCache.get(source);
        if (cached) {
          setContent(() => cached);
          return;
        }

        const mod = await evaluate(source, {
          ...runtime,
          useMDXComponents: () => components ?? {},
        });

        const Component = mod.default;
        compiledCache.set(source, Component);
        if (!cancelled) {
          setContent(() => Component);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setContent(null);
        }
      }
    }

    compile();
    return () => {
      cancelled = true;
    };
  }, [source, components]);

  if (error) {
    return (
      <pre style={{ whiteSpace: "pre-wrap", color: "#b42318" }}>
        {error.message}
      </pre>
    );
  }

  if (!Content) return null;
  return <Content />;
}

export default function MdxString({ source, components }) {
  return (
    <BrowserOnly fallback={null}>
      {() => <MdxStringBrowser source={source} components={components} />}
    </BrowserOnly>
  );
}

