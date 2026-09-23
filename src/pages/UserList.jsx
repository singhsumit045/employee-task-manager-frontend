import { useState, useEffect, useMemo } from 'react';
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
    Tabs,   
    Tab,   
} from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'; 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';   
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';   
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';    

import { getAllUsers, deleteUser, updateUser } from '../services/users';  
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
    const [tab, setTab] = useState('all'); // all | active | inactive 
    const [togglingId, setTogglingId] = useState(null);

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
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userToDelete.id ? { ...u, isActive: false } : u
                )
            );
            setUserToDelete(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setDeleting(false);
        }
    };

    const handleToggleStatus = async (user) => {
        setTogglingId(user.id);
        try {
            if (user.isActive) {
                await deleteUser(user.id); // soft delete = deactivate   
            } else {
                await updateUser(user.id, { isActive: true }); // reactivate   
            }
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, isActive: !u.isActive } : u
                )
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user status');
        } finally {
            setTogglingId(null);
        }
    };

    const counts = useMemo(
        () => ({
            all: users.length,
            active: users.filter((u) => u.isActive).length,
            inactive: users.filter((u) => !u.isActive).length,
        }),
        [users]
    );

    const filteredUsers = useMemo(() => {
        if (tab === 'active') return users.filter((u) => u.isActive);
        if (tab === 'inactive') return users.filter((u) => !u.isActive);
        return users;
    }, [users, tab]);

    // =========================
    // EXPORT EXCEL
    // =========================
    const handleExportExcel = () => {
        const exportData = filteredUsers.map((u) => ({
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Department: u.department || '—',
            Phone: u.phone || '—',
            Status: u.isActive ? 'Active' : 'Inactive',
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
                ['Name', 'Email', 'Role', 'Department', 'Phone', 'Status'],
            ],
            body: filteredUsers.map((u) => [
                u.name,
                u.email,
                u.role,
                u.department || '—',
                u.phone || '—',
                u.isActive ? 'Active' : 'Inactive',
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
            <Stack
                direction="row"
                spacing={1}

                sx={{ mb: 2, justifyContent: "row  " }}
            >

                {/* Status filter tabs */}
                <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
                    <Tab label={`All (${counts.all})`} value="all" />
                    <Tab label={`Active (${counts.active})`} value="active" />
                    <Tab label={`Inactive (${counts.inactive})`} value="inactive" />
                </Tabs>

                {/* Export buttons — right aligned, own row */} 

                <Button
                    sx={{ mb: 2, justifyContent: "right" }}
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
                            <TableCell>Status</TableCell>
                            <TableCell ml="auto">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((u) => (
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

                                    <TableCell>
                                        <Chip
                                            label={u.isActive ? 'Active' : 'Inactive'}
                                            size="small"
                                            color={u.isActive ? 'success' : 'default'}
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            justifyContent="flex-end"
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() => handleToggleStatus(u)}
                                                disabled={togglingId === u.id}
                                                title={u.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {u.isActive ? (
                                                    <ToggleOnOutlinedIcon fontSize="small" color="success" />
                                                ) : (
                                                    <ToggleOffOutlinedIcon fontSize="small" color="disabled" />
                                                )}
                                            </IconButton>

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
                            ))
                        )}
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