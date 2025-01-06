import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { KnowledgeSearch } from "./components/KnowledgeSearch";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <KnowledgeSearch />
    </ThemeProvider>
  );
}

export default App;
