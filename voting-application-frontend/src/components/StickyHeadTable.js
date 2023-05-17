import * as React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, CssBaseline, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { TextField, Checkbox } from '@mui/material';
import { ElectricScooterSharp } from '@mui/icons-material';
import { Link, Router } from 'react-router-dom';
import './StickyHeadTable.css';


export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState([]);
  const [formInitialValues, setFormInitialValues] = useState({});
  const [formMode, setFormMode] = useState('edit');



  const columns = [
    {
      id: "checkbox",
      label: "",
      minWidth: 30,
      align: "center",
      checkbox: true,
      format: (value, row) => (
        <Checkbox
          color="primary"
          checked={row.highlighted}
          onClick={() => handleHighlightCandidate(row.id)}
        />
      )
    },
    { id: "id", label: "ID", align: 'center', maxWidth: 80 },
    ,
    {
      id: "name",
      label: "Name",
      minWidth: 150,
      align: "center",
      format: (value, row) => (
        <Link to={`/candidates/${row.id}`} className="custom-link">
          {`${row.firstName} ${row.lastName}`}
        </Link>
      )
    },
    {
      id: 'dob',
      label: 'Date of birth',
      minWidth: 100,
      align: 'center'
    },
    {
      id: 'state',
      label: 'State of residency',
      minWidth: 100,
      align: 'center'
    },
    {
      id: 'description',
      label: 'Description',
      maxWidth: 200,
      align: 'center'
    },
  ];

  const handleHighlightCandidate = (id) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return {
          ...row,
          highlighted: !row.highlighted
        }
      } else {
        return row;
      }
    }));

    setSelected(rows.filter(row => row.id === id && !row.highlighted));
  };

  useEffect(() => {
    fetch('http://localhost:8080/candidates', {
      headers : {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRows(data.map(row => ({
          ...row,
          highlighted: false
        })));
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelectRow = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isSingleRowSelected = selected.length === 1;

  const handleEditCandidate = () => {
    if (selected.length !== 1) {
      alert("Please select one row to edit.");
      return;
    }

    const selectedId = selected[0];
    const selectedRow = rows.find((row) => row.id === selectedId);

    setShowForm(true);
    setFormInitialValues(selectedRow);
    setFormMode('edit');
  };

  const handleAddCandidate = () => {
    setShowForm(true);
    setFormInitialValues({});
    setFormMode('add');
  };

  const handleAddCandidateSuccess = (newCandidate) => {
    setShowForm(false);
    setRows((prevRows) => [...prevRows, newCandidate]);
  };

  const handleFormSubmit = (formData) => {
    if (formMode === 'add') {
      // API call pakurt naują kandidatą
      axios
        .post('http://localhost:8080/candidates', formData, {
          headers : {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        })
        .then((response) => {
          console.log('New candidate created:', response.data);
          handleCloseForm();
  
          // GET call kad paimt naują updated listą po kandidato sukūrimo
          axios
            .get('http://localhost:8080/candidates', {
              headers : {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
              }
            })
            .then((res) => {
              setRows(res.data.map((row) => ({ ...row, highlighted: false })));
            })
            .catch((error) => {
              console.error('Error fetching candidates:', error);
            });
        })
        .catch((error) => {
          console.error('Error creating new candidate:', error);
        });
    } else if (formMode === 'edit') {
      const updatedRows = rows.map((row) =>
        row.id === selected[0] ? { ...row, ...formData } : row
      );
      setRows(updatedRows);
  
      axios
        .put(`http://localhost:8080/candidates/${selected[0]}`, formData, {
          headers : {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
          }
        })
        .then((response) => {
          console.log('Candidate updated:', response.data);
          handleCloseForm();
        })
        .catch((error) => {
          console.error('Error updating candidate:', error);
        });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormInitialValues({});
    setFormMode('');
  };

  const handleDeleteCandidates = () => {
    if (selected.length === 0) {
      alert('Please select candidates to delete.');
      return;
    }
  
    if (window.confirm(`Are you sure you want to delete ${selected.length} candidate(s)?`)) {
      // API call ištrint candidates
      const deletePromises = selected.map((id) =>
      axios.delete(`http://localhost:8080/candidates/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
    );
  
      Promise.all(deletePromises)
        .then((responses) => {
          console.log('Candidates deleted:', responses);
          const updatedRows = rows.filter((row) => !selected.includes(row.id));
          setRows(updatedRows);
          setSelected([]);
        })
        .catch((error) => {
          console.error('Error deleting candidates:', error);
        });
    }
  };

  return (
    <Paper sx={{ height: '100%', overflow: 'hidden', borderRadius:'10', boxShadow:'15' }}>
      <TableContainer sx={{ maxHeight: 680 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  //enableStickyHeader
                  style={{
                    minWidth: column.minWidth, maxWidth: column.maxWidth
                  }
                  }
                >
                  {column.checkbox ? (
                    <input type="checkbox" />
                  ) : (column.label)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const isRowSelected = isSelected(row.id);
                return (
                  <TableRow hover role="checkbox" tabIndex={-1}
                    key={row.id}
                    selected={isRowSelected}
                    onClick={(event) => handleSelectRow(event, row.id)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{
                            minWidth: column.minWidth, maxWidth: column.maxWidth, maxHeight: 100,
                            align: column.align
                          }}
                        >
                          {column.id === "checkbox" ? (
                            <Checkbox checked={isRowSelected} />
                          ) : column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : column.format ? (
                            column.format(value, row)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Container sx={{ position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '200px', bottom: '8px', zIndex: 1 }}
          variant="contained"
          color="secondary"
          onClick={() =>
            handleEditCandidate(selected[0])}
          disabled={!isSingleRowSelected}
        >
          Edit
        </Button>
        <Button sx={{ position: 'absolute', bottom: '8px', left: '10px', zIndex: 1 }}
          variant="contained" color="primary" onClick={handleAddCandidate}>
          Add new candidate
        </Button>
        <Button
          sx={{ position: 'absolute', left: '275px', bottom: '8px', zIndex: 1 }}
          variant="contained"
          color="error"
          onClick={handleDeleteCandidates}
          disabled={selected.length === 0}
        >
          Delete
        </Button>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <AddCandidateForm open={showForm}
        handleClose={handleCloseForm}
        initialValues={formInitialValues}
        onSubmit={handleFormSubmit} />
      </Container>
    </Paper>
  );

  function AddCandidateForm({ open, handleClose, initialValues, onSubmit }) {
    const [formData, setFormData] = useState(initialValues || {});

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      onSubmit(formData);
    };


    return (
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="dob"
              label="Date of Birth"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={formData.dob}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="state"
              label="State of Residency"
              type="text"
              fullWidth
              value={formData.state}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    );


  }
}
