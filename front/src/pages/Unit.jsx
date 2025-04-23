import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TablePagination,
    IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import SearchBar from '../components/common/SearchBar';
import { ModernBox, ModernButton, ModernTextField, ModernTableContainer, ModernTableHead, ModernTableRow, ModernPaper } from '../styles/styles';

const API_URL = 'http://localhost:1337/api/units';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function AddUnit({ unitName, setUnitName, unitDescription, setUnitDescription, units, setUnits, fetchUnits }) {
    const handleAddUnit = async () => {
        if (!unitName) {
            alert("Please fill out the unit name.");
            return;
        }

        try {
            const response = await axios.post(
                API_URL,
                { data: { name: unitName, description: unitDescription } },
                { headers: { Authorization: `Bearer ${API_TOKEN}` } }
            );

            const newUnit = {
                id: response.data.data.id,
                name: response.data.data.name || unitName,
                description: response.data.data.description || unitDescription,
            };
            setUnits([newUnit, ...units]);
            setUnitName('');
            setUnitDescription('');
            // fetchUnits(); // Consider if you want to refresh the whole list after adding
        } catch (err) {
            alert(`Error adding unit: ${err.response?.data?.error?.message || err.message}`);
        }
    };

    return (
        <ModernButton variant='outlined' onClick={handleAddUnit} sx={{ width: '160px', borderRadius: '13px', mb: 3, mt: 3 }}>
            Add Unit
        </ModernButton>
    );
}

const Units = () => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [newUnitName, setNewUnitName] = useState('');
    const [newUnitDescription, setNewUnitDescription] = useState('');
    const [error, setError] = useState(null);
    const [units, setUnits] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUnitId, setEditingUnitId] = useState(null);
    const [editUnitName, setEditUnitName] = useState('');
    const [editUnitDescription, setEditUnitDescription] = useState('');

    const fetchUnits = async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
            });
            const data = response.data.data;
            const formattedData = data.map((unit) => ({
                id: unit.id,
                name: unit.name,
                description: unit.description,
            }));
            setUnits(formattedData);
        } catch (err) {
            setError(err.response?.data?.error?.message || err.message);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => setRowsPerPage(parseInt(event.target.value, 10));

    const handleEdit = (unit) => {
        setEditingUnitId(unit.id);
        setEditUnitName(unit.name);
        setEditUnitDescription(unit.description);
    };

    const handleCancelEdit = () => {
        setEditingUnitId(null);
    };

    const handleSaveEdit = async (id) => {
        try {
            await axios.put(
                `${API_URL}/${id}`,
                { data: { name: editUnitName, description: editUnitDescription } },
                { headers: { Authorization: `Bearer ${API_TOKEN}` } }
            );
            // Update the units array locally
            const updatedUnits = units.map((unit) =>
                unit.id === id ? { ...unit, name: editUnitName, description: editUnitDescription } : unit
            );
            setUnits(updatedUnits);
            setEditingUnitId(null);
        } catch (err) {
            alert(`Error updating unit: ${err.response?.data?.error?.message || err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this unit?")) {
            try {
                await axios.delete(`${API_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${API_TOKEN}` },
                });
                // Update the units array locally
                const updatedUnits = units.filter((unit) => unit.id !== id);
                setUnits(updatedUnits);
            } catch (err) {
                alert(`Error deleting unit: ${err.response?.data?.error?.message || err.message}`);
            }
        }
    };

    const filteredUnits = units.filter((unit) =>
        unit.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ModernBox>
            <ModernPaper sx={{ padding: 3, borderRadius: '16px', background: '#fff', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', mb: 3 }}>
                <ModernTextField
                    autoFocus
                    margin="dense"
                    label="Unit Name"
                    fullWidth
                    variant="outlined"
                    value={newUnitName}
                    onChange={(e) => setNewUnitName(e.target.value)}
                />
                <ModernTextField
                    margin="dense"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    value={newUnitDescription}
                    onChange={(e) => setNewUnitDescription(e.target.value)}
                />
                <AddUnit
                    unitName={newUnitName}
                    setUnitName={setNewUnitName}
                    unitDescription={newUnitDescription}
                    setUnitDescription={setNewUnitDescription}
                    units={units}
                    setUnits={setUnits}
                    // fetchUnits={fetchUnits} // Consider if needed here
                />
            </ModernPaper>

            <SearchBar search={searchQuery} setSearch={setSearchQuery} label="Search for Unit" />

            <ModernTableContainer>
                <Table>
                    <ModernTableHead>
                        <ModernTableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </ModernTableRow>
                    </ModernTableHead>
                    <TableBody>
                        {error ? (
                            <ModernTableRow>
                                <TableCell colSpan={4} align='center'>
                                    Error: {error}
                                </TableCell>
                            </ModernTableRow>
                        ) : filteredUnits.length > 0 ? (
                            filteredUnits
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((unit) => (
                                    <ModernTableRow key={unit.id}>
                                        <TableCell>{unit.id}</TableCell>
                                        <TableCell>
                                            {editingUnitId === unit.id ? (
                                                <ModernTextField
                                                    value={editUnitName}
                                                    onChange={(e) => setEditUnitName(e.target.value)}
                                                    size="small"
                                                />
                                            ) : (
                                                unit.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingUnitId === unit.id ? (
                                                <ModernTextField
                                                    value={editUnitDescription}
                                                    onChange={(e) => setEditUnitDescription(e.target.value)}
                                                    size="small"
                                                />
                                            ) : (
                                                unit.description
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {editingUnitId === unit.id ? (
                                                <>
                                                    <IconButton onClick={() => handleSaveEdit(unit.id)} color="primary">
                                                        <SaveIcon />
                                                    </IconButton>
                                                    <IconButton onClick={handleCancelEdit}>
                                                        <CancelIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton onClick={() => handleEdit(unit)} color="secondary">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDelete(unit.id)} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </ModernTableRow>
                                ))
                        ) : (
                            <ModernTableRow>
                                <TableCell colSpan={4} align='center'>
                                    No units found-add some above!
                                </TableCell>
                            </ModernTableRow>
                        )}
                    </TableBody>
                </Table>
            </ModernTableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUnits.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </ModernBox>
    );
};

export default Units;