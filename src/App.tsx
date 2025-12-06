import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './styles/App.scss';
import { Game } from './components/Game';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22c55e', // neon green
    },
    secondary: {
      main: '#6366f1', // indigo
    },
    info: {
      main: '#22d3ee', // cyan
    },
    warning: {
      main: '#f97316', // orange
    },
    error: {
      main: '#fb7185', // pink/red
    },
    background: {
      default: '#020617', // page
      paper: 'rgba(15,23,42,0.97)', // cards
    },
    text: {
      primary: '#e5e7eb',
      secondary: '#cbd5f5',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Game />
    </ThemeProvider>
  );
}

export default App;
