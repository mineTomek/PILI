import { useEffect, useState, useRef } from "react";

export default function SearchBar(props: {
  className?: string;
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const searchTimeout = 500;

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      props.onSearch(query);
    }, searchTimeout);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, props]);

  return (
    <input
      type="search"
      className={props.className}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
