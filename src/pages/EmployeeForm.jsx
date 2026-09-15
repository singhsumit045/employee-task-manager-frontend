import { useState, useEffect } from 'react';
import {
    Stack,
    TextField,
    Button,
    MenuItem,
    Alert,
    Grid,
} from '@mui/material';
import { createUser, updateUser } from '../services/users';

const ROLES = [
    { value: 'employee', label: 'Employee' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' },
];

const DEPARTMENTS = [
    { value: 'IT', label: 'IT' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Operations', label: 'Operations' },
];

const EMPTY_FORM = {
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    phone: '',
};

export default function EmployeeForm({ editingEmployee, onSuccess, onCancelEdit }) {
    const isEditMode = Boolean(editingEmployee);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (editingEmployee) {
            setFormData({
                name: editingEmployee.name || '',
                email: editingEmployee.email || '',
                password: '',
                role: editingEmployee.role || 'employee',
                department: editingEmployee.department || '',
                phone: editingEmployee.phone || '',
            });
        } else {
            setFormData(EMPTY_FORM);
        }
        setErrors({});
        setApiError('');
        setSuccess('');
    }, [editingEmployee]);

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!isEditMode && !formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.role) newErrors.role = 'Role is required';

        if (!formData.department) newErrors.department = 'Department is required';

        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        if (!validate()) return;

        setLoading(true);
        try {
            if (isEditMode) {
                await updateUser(editingEmployee.id, formData);
                setSuccess('Employee updated successfully');
            } else {
                await createUser(formData);
                setSuccess('Employee created successfully');
                setFormData(EMPTY_FORM);
            }
            onSuccess?.();
        } catch (err) {
            setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack component="form" onSubmit={handleSubmit} spacing={2.5} noValidate>
            {apiError && <Alert severity="error">{apiError}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Full name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        fullWidth
                        required
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label={isEditMode ? 'New password (leave blank to keep current)' : 'Password'}
                        type="password"
                        value={formData.password}
                        onChange={handleChange('password')}
                        fullWidth
                        required={!isEditMode}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Role"
                        value={formData.role}
                        onChange={handleChange('role')}
                        fullWidth
                        required
                        error={!!errors.role}
                        helperText={errors.role}
                    >
                        {ROLES.map((r) => (
                            <MenuItem key={r.value} value={r.value}>
                                {r.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Department"
                        value={formData.department}
                        onChange={handleChange('department')}
                        fullWidth
                        required
                        error={!!errors.department}
                        helperText={errors.department}
                        sx={{width: "130px"}}  
                    >
                        {DEPARTMENTS.map((d) => (
                            <MenuItem key={d.value} value={d.value}>
                                {d.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Phone (optional)"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                </Grid>
            </Grid>

            <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ px: 4 }}>
                    {loading ? 'Saving…' : isEditMode ? 'Update employee' : 'Create employee'}
                </Button>

                {isEditMode && (
                    <Button variant="outlined" size="large" onClick={onCancelEdit} disabled={loading}>
                        Cancel
                    </Button>
                )}
            </Stack>
        </Stack>
    );
}