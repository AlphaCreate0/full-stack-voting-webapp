import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
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

const VoteResultsPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(5);
  const [topCandidates, setTopCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:8080/votes', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
        setCandidates(response.data);
      } catch (error) {
        console.error('API error:', error);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    setTopCandidates(candidates.slice(0, 5));
  }, [candidates]);

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const paginatedCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  return (
    <Container maxWidth="md">
      <Box my={4} textAlign="center">
        <Typography variant="h4" color="secondary" mb={2}>
          Top 5 Candidates
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
  {topCandidates.map((candidate) => (
    <Box key={candidate.id} p={2} m={1} borderRadius={5} bgcolor="secondary.main" flexGrow={1}>
      <Typography variant="h5" color="white">
        {`${candidate.firstName} ${candidate.lastName}`}
      </Typography>
      <Typography variant="body1" color="white">
        Vote Count: {candidate.voteCount}
      </Typography>
    </Box>
  ))}
</Box>
      </Box>
      <Paper component="div" elevation={0} sx={{ borderRadius: 5, boxShadow: 15 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Candidate Name</TableCell>
                <TableCell align="center">Vote Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>{`${candidate.firstName} ${candidate.lastName}`}</TableCell>
                  <TableCell align="center">{candidate.voteCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(candidates.length / candidatesPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default VoteResultsPage;
