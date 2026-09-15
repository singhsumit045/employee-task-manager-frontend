import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Stack,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    MailOutlined,
    LockOutlined,
    TrendingUp,
    GroupsOutlined,
    CheckCircleOutlined,
} from '@mui/icons-material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/EmailOutlined';      
import { SiGmail } from 'react-icons/si';

// Two logo variants — put both files at src/assets/
import taskflowLogoWhite from '../assets/taskflow-logo-white-text.png';
import taskflowLogoDark from '../assets/taskflow-logo-dark-text.png';

// Admin contact details — move to .env for production
const ADMIN_WHATSAPP_NUMBER = '919934933658'; // country code + number, no + or spaces
const ADMIN_EMAIL = 'samratsumit2024@gmail.com';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Contact admin menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const contactMenuOpen = Boolean(anchorEl);

    const handleContactClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleContactMenuClose = () => {
        setAnchorEl(null);
    };

    const contactAdminOnWhatsApp = () => {
        const message = 'Hello Admin, I need help logging into TaskFlow.';
        window.open(
            `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            '_blank'
        );
        handleContactMenuClose();
    };

    const contactAdminByEmail = () => {
        const subject = 'Help with Login';
        const body = 'Hello Admin, I need help logging into TaskFlow.';
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${ADMIN_EMAIL}&su=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
        handleContactMenuClose();
    };

    const validate = () => {
        let valid = true;
        setEmailError('');
        setPasswordError('');

        if (!email.trim()) {
            setEmailError('Email is required');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Enter a valid email address');
            valid = false;
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password, remember);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            {/* Left branding panel — desktop only */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(160deg, #111827 0%, #1F2937 100%)',
                    color: '#fff',
                    p: 6,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: 320,
                        height: 320,
                        borderRadius: '50%',
                        bgcolor: 'rgba(13,148,136,0.15)',
                        top: -120,
                        right: -120,
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        width: 200,
                        height: 200,
                        borderRadius: '50%',
                        bgcolor: 'rgba(13,148,136,0.10)',
                        bottom: -60,
                        left: -60,
                    }}
                />

                <Stack direction="row" spacing={1} sx={{ zIndex: 1, alignItems: 'center' }}>
                    <Box
                        component="img"
                        src={taskflowLogoWhite}
                        alt="TaskFlow"
                        sx={{ height: 50, width: 'auto' }}
                    />
                </Stack>

                <Box sx={{ zIndex: 1 }}>
                    <Chip
                        label="Employee workspace"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.85)',
                            mb: 2.5,
                            fontWeight: 500,
                        }}
                    />
                    <Typography variant="h4" sx={{ color: '#fff', mb: 2, maxWidth: 420, lineHeight: 1.3 }}>
                        Manage your team's work, all in one place
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 380, mb: 4 }}>
                        Track tasks, deadlines, and progress across your organization with
                        a single, streamlined dashboard.
                    </Typography>

                    <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <CheckCircleOutlined sx={{ color: 'primary.light', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                Real-time task tracking across teams
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <GroupsOutlined sx={{ color: 'primary.light', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                Built for teams of every size
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                            <TrendingUp sx={{ color: 'primary.light', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                                Insights that keep projects on track
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', zIndex: 1 }}>
                    © {new Date().getFullYear()} TaskFlow. All rights reserved.
                </Typography>
            </Box>

            {/* Right form panel — always visible */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    px: { xs: 3, sm: 6 },
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 400 }}>
                    {/* Mobile-only brand mark */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 4, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}
                    >
                        <Box
                            component="img"
                            src={taskflowLogoDark}
                            alt="TaskFlow"
                            sx={{ height: 32, width: 'auto' }}
                        />
                    </Stack>

                    <Stack spacing={0.5} sx={{ mb: 4 }}>
                        <Typography variant="h5">Sign in</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter your credentials to access your account
                        </Typography>
                    </Stack>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                autoFocus
                                placeholder="name@gmail.com"
                                error={!!emailError}
                                helperText={emailError}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlined
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                placeholder="xxxxxx"
                                error={!!passwordError}
                                helperText={passwordError}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlined
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword((v) => !v)}
                                                    edge="end"
                                                    size="small"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? "🙈" : "👁️"}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={remember}
                                            onChange={(e) => setRemember(e.target.checked)}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" color="text.secondary">
                                            Remember me
                                        </Typography>
                                    }
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 500 }}
                                >
                                    Forgot password?
                                </Typography>
                            </Stack>

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{ py: 1.2 }}
                            >
                                {loading ? 'Signing in…' : 'Sign in'}
                            </Button>
                        </Stack>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                        Don't have an account?{' '}
                        <Box
                            component="span"
                            onClick={handleContactClick}
                            sx={{ color: 'primary.main', fontWeight: 500, cursor: 'pointer' }}
                        >
                            Contact your admin
                        </Box>
                    </Typography>

                    <Menu
                        anchorEl={anchorEl}
                        open={contactMenuOpen}
                        onClose={handleContactMenuClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <MenuItem onClick={contactAdminOnWhatsApp}>
                            <ListItemIcon>
                                <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
                            </ListItemIcon>
                            <ListItemText>WhatsApp</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={contactAdminByEmail}>
                            <ListItemIcon>
                                <EmailIcon fontSize="small" sx={{ color: '#EA4335' }} />
                            </ListItemIcon>
                            <ListItemText>Email</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
        </Box>
    );
}

