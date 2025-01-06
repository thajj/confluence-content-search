import React, { useState, useCallback } from "react";
import {
  TextField,
  Box,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import debounce from "lodash/debounce";
import { searchConfluence } from "../services/searchService";
import { SearchResult } from "../types/search";
import { SearchResultItem } from "./SearchResultItem";

const getErrorMessage = (error: Error) => {
  switch (error.message) {
    case "CONFIGURATION_ERROR":
      return "The search service is not properly configured. Please contact your administrator to set up the Confluence API.";
    case "INVALID_ENDPOINT":
      return "The Confluence API endpoint is incorrect. The URL should be: https://cwpenergy.atlassian.net/wiki/rest/api\n";
    case "INVALID_RESPONSE":
      return "Received an unexpected response from Confluence. Please contact your administrator.";
    case "CONNECTION_ERROR":
      return "Unable to connect to the Confluence server. Please check your internet connection or contact your administrator.";
    case "AUTHENTICATION_ERROR":
      return "Unable to authenticate with Confluence. Please contact your administrator to verify the API token.";
    default:
      return "An unexpected error occurred. Please try again later or contact support if the problem persists.";
  }
};

// Create debounced function outside component
const debouncedFn = debounce(
  (fn: (value: string) => void, value: string) => fn(value),
  300
);

export const KnowledgeSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchKnowledge = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const confluenceResults = await searchConfluence(searchQuery);
      setResults(confluenceResults.results);
    } catch (error) {
      setError(getErrorMessage(error as Error));
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (value: string) => {
      debouncedFn(searchKnowledge, value);
    },
    [searchKnowledge]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleResultClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <TextField
        fullWidth
        label="Search knowledge base"
        value={query}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && !error && results.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {results.map((result) => (
            <SearchResultItem
              key={result.id}
              result={result}
              onClick={handleResultClick}
            />
          ))}
        </Box>
      )}

      {!loading && !error && query && results.length === 0 && (
        <Typography variant="body1" textAlign="center" color="text.secondary">
          No results found
        </Typography>
      )}
    </Box>
  );
};
