import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { SearchResult } from "../types/search";

interface Props {
  result: SearchResult;
  onClick: (url: string) => void;
}

export const SearchResultItem: React.FC<Props> = ({ result, onClick }) => {
  return (
    <Paper
      sx={{
        p: 2,
        cursor: "pointer",
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
      }}
      onClick={() => onClick(result.url)}
    >
      <Typography variant="h6" component="h3">
        {result.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {result.project} • {result.source} • Modified by {result.author}
      </Typography>
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: result.excerpt }}
      />
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Last modified: {new Date(result.lastModified).toLocaleDateString()}
        </Typography>
      </Box>
    </Paper>
  );
};
