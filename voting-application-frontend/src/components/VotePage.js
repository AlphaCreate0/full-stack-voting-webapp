import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Pagination,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VotePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:8080/candidates', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        });
        setCandidates(response.data);
      } catch (error) {
        console.error('API error:', error);
      }
    };

    fetchCandidates();
  }, []);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddCandidate = (candidate) => {
    if (selectedCandidates.length >= 5) {
      setErrorMessage('You can choose a maximum of 5 candidates.');
      setShowErrorDialog(true);
      return;
    }

    if (selectedCandidates.find((c) => c.id === candidate.id)) {
      setErrorMessage('Candidate is already selected.');
      setShowErrorDialog(true);
      return;
    }

    setSelectedCandidates((prevSelectedCandidates) => [...prevSelectedCandidates, candidate]);
  };

  const handleRemoveCandidate = (candidate) => {
    setSelectedCandidates((prevSelectedCandidates) =>
      prevSelectedCandidates.filter((c) => c.id !== candidate.id)
    );
  };

  const handleSubmitVote = async () => {
    console.log('Authorization token:', localStorage.getItem('jwtToken'));
    console.log('Submitting vote...');
    try {
      const candidateIds = selectedCandidates.map((candidate) => Number(candidate.id));
      const response = await axios.post(
        'http://localhost:8080/votes',
        candidateIds,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        }
      );
      if (response.status === 201) {
        navigate('/vote-results');
      } else {
        console.error('Vote submission failed:', response.data);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };
  
  

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  };

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const paginatedCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  return (
    <Container maxWidth="md" sx={{ height: '100%', borderRadius: 5}}>
      <Paper component="div" elevation={0} sx={{ height: '100%', borderRadius: 5, boxShadow: 15 }}>
        <TextField
          label="Search Candidates"
          variant="outlined"
          InputLabelProps={{
            sx: { color: "secondary", "&.Mui-focused": { color: "secondary" } },
          }}
          InputProps={{
            sx: { borderRadius: 5},
          }}
          fullWidth
          margin="medium"
          color="secondary"
          text-color="secondary"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          borderRadius="5"
        />
        <TableContainer sx={{ maxHeight: 'calc(100% - 400px)' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Candidate Name</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{`${candidate.firstName} ${candidate.lastName}`}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddCandidate(candidate)}
                      disabled={selectedCandidates.some((c) => c.id === candidate.id)}
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(filteredCandidates.length / candidatesPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
        {selectedCandidates.length > 0 && (
          <Box mt={4} sx={{ maxHeight: '300px', overflow: 'auto' }}>
            <Typography variant="h5" align="center">
              Selected Candidates
            </Typography>
            <Box mt={2} display="flex" flexWrap="wrap" justifyContent="center">
              {selectedCandidates.map((candidate) => (
                <Box key={candidate.id} m={1} p={1} border={1} borderRadius={5}>
                  <Typography variant="subtitle1">{`${candidate.firstName} ${candidate.lastName}`}</Typography>
                  <Button color="secondary" onClick={() => handleRemoveCandidate(candidate)}>
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        <Box mt={4} display="flex" justifyContent="center" className="bottomContainer">
          <Button variant="contained" color="primary" onClick={handleSubmitVote} sx={{ marginBottom: "10px" }}>
            Submit Vote
          </Button>
        </Box>
        <Dialog open={showErrorDialog} onClose={handleCloseErrorDialog}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog}>OK</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default VotePage;
