import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { BrowserRouter } from "react-router-dom";
import Approutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { NotificationProvider } from "./components/NotificationContext";
import { SearchProvider } from "./components/SearchContext";


function App() {
  const { theme, colorMode } = useMode();

  return (
    <SearchProvider>
    <NotificationProvider>
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/ERMS-CapstoneFrt">
        <Approutes />
         {/* Toast Container */}
         <ToastContainer 
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored" 
          />
      </BrowserRouter>
    </ThemeProvider>
  </ColorModeContext.Provider>
  </NotificationProvider>
  </SearchProvider>
  );
}

export default App;
