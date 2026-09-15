
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Stack,
    Alert,
    CircularProgress,
    Box,
    Button,
} from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

import { getAllUsers, deleteUser } from '../services/users';
import ConfirmDialog from './ConfirmDialog';

// Export imports
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ROLE_COLORS = {
    admin: 'error',
    manager: 'warning',
    employee: 'default',
};

export default function UserList({ refreshKey, onEdit }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refreshKey]);

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        setDeleting(true);
        try {
            await deleteUser(userToDelete.id);
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            setUserToDelete(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleting(false);
        }
    };

    // =========================
    // EXPORT EXCEL
    // =========================
    const handleExportExcel = () => {
        const exportData = users.map((u) => ({
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Department: u.department || '—',
            Phone: u.phone || '—',
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employees');

        XLSX.writeFile(workbook, 'All-Employees.xlsx');
    };

    // =========================
    // EXPORT PDF
    // =========================
    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text('All Employees', 14, 15);

        autoTable(doc, {
            startY: 25,
            head: [
                ['Name', 'Email', 'Role', 'Department', 'Phone'],
            ],
            body: users.map((u) => [
                u.name,
                u.email,
                u.role,
                u.department || '—',
                u.phone || '—',
            ]),
            styles: {
                fontSize: 9,
            },
            headStyles: {
                fontSize: 9,
            },
        });

        doc.save('All-Employees.pdf');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={28} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <>
            {/* Export Buttons */}
            <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                sx={{ mb: 2 }}
            >
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleExportExcel}
                >
                    Export Excel
                </Button>

                <Button
                    variant="contained"
                    size="small"
                    onClick={handleExportPDF}
                >
                    Export PDF
                </Button>
            </Stack>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell>{u.name}</TableCell>

                                <TableCell>{u.email}</TableCell>

                                <TableCell>
                                    <Chip
                                        label={u.role}
                                        size="small"
                                        color={ROLE_COLORS[u.role] || 'default'}
                                        sx={{ textTransform: 'capitalize' }}
                                    />
                                </TableCell>

                                <TableCell>
                                    {u.department || '—'}
                                </TableCell>

                                <TableCell>
                                    {u.phone || '—'}
                                </TableCell>

                                <TableCell align="right">
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        justifyContent="flex-end"
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(u)}
                                        >
                                            <EditOutlinedIcon fontSize="small" />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => setUserToDelete(u)}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmDialog
                open={Boolean(userToDelete)}
                title="Delete employee"
                message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setUserToDelete(null)}
                loading={deleting}
            />
        </>
    );
}

