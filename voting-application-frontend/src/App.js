import { Container, CssBaseline } from "@mui/material";
import Navbar from "./components/Navbar";
import StickyHeadTable from "./components/StickyHeadTable";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CandidateProfile from "./components/CandidateProfile";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import VoteResultsPage from "./components/VoteResultsPage";
import React, { useEffect, useState } from 'react';
import VotePage from "./components/VotePage";


const theme = createTheme({
  palette: {
    common: {
      black: "#000",
      white: "#fff"
    },
    background: {
      paper: "#2D353D",
      default: "rgba(34, 31, 31, 1)"
    },
    primary: {
      light: "rgba(65, 117, 5, 1)",
      main: "rgba(77, 140, 3, 1)", "dark": "rgba(49, 82, 11, 1)",
      contrastText: "#fff"
    },
    secondary: {
      light: "rgba(245, 166, 35, 1)",
      main: "rgba(233, 126, 10, 1)",
      dark: "rgba(212, 136, 6, 1)",
      contrastText: "rgba(0, 0, 0, 1)"
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    text: {
      primary: "#D9E7DF",
      secondary: "rgba(90, 196, 113, 0.54)",
      disabled: "rgba(158, 148, 148, 0.63)",
      hint: "rgba(22, 21, 21, 0.38)"
    }
  }
});


function App() {
  
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isRegisterPage, setIsRegisterPage] = useState(true);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setIsLoginPage(false);
    setIsRegisterPage(false);
    navigate('/candidates');
  };

  const handleRegister = () => {
    setAuthenticated(false);
    setIsRegisterPage(false);
    setIsLoginPage(true);
  };

  return (
    <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ height: '100vh' }}>
            <Container maxWidth={false} sx={{ backgroundColor: 'background.paper', height: '100%', boxShadow: '3' }}>
              <div>
              <Routes>
                <Route
                  path="/candidates"
                  element={
                    <React.Fragment>
                      <Navbar sx={{ color: 'primary' }} />
                      <h2 align="center">Candidates</h2>
                    </React.Fragment>
                  }
                />
                <Route
                  path="/candidates/:id"
                  element={
                    <React.Fragment>
                      <Navbar sx={{ color: 'primary' }} />
                      <h1 align="center">Candidate's Profile</h1>
                    </React.Fragment>
                  }
                />
                <Route
                  path="/vote"
                  element={
                    <React.Fragment>
                      <Navbar sx={{ color: 'primary' }} />
                      <h2 align="center">Voting</h2>
                    </React.Fragment>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <React.Fragment>
                      <Navbar sx={{ color: 'primary' }} />
                      <h2 align="center">Vote Results</h2>
                    </React.Fragment>
                  }
                />
              </Routes>
              </div>
              <Container>
              <Routes>
              <Route
                  path="/"
                  element={
                    <LoginPage
                      onLoginSuccess={handleLoginSuccess}
                      setIsLoginPage={setIsLoginPage}
                    />}
                />
                <Route
                  path="/register"
                  element={<RegisterPage onRegister={handleRegister} setIsRegisterPage={setIsRegisterPage} />}
                />
                      <Route path="/candidates" element={<StickyHeadTable />} />
                      <Route path="/candidates/:id" element={<CandidateProfile />} />
                      <Route path="/vote" element={<VotePage />} />
                      <Route path="/results" element={<VoteResultsPage />} />
                </Routes>
              </Container>
            </Container>
          </div>
        </ThemeProvider>
    </div>
  );
}

export default App;