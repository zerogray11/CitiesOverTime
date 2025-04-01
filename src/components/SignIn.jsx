import * as React from 'react';
import { useState, useContext } from 'react'; // Import useState and useContext
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ForgotPassword from './ForgotPassword';
import { GoogleIcon, FacebookIcon } from './CustomIcons';
import { ThemeContext } from '../components/ThemeContext'; // Import ThemeContext
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const CardStyled = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: '64px auto', // Added margin for vertical centering
  background: '#000000', // Jet black background
  borderRadius: '16px',
  border: '1px solid transparent',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(45deg, #1e3a8a, #6d28d9, #1e3a8a, #4c1d95)',
    backgroundSize: '400% 400%',
    borderRadius: '18px',
    zIndex: -1,
    animation: 'borderAnimation 6s ease infinite',
  },
  boxShadow: `
    0 0 20px rgba(37, 99, 235, 0.3),
    0 0 40px rgba(124, 58, 237, 0.2)
  `,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh', // Ensure the container takes at least the full height
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2), // Adjust padding to provide some space around content
  flexDirection: 'column', // Stack the elements vertically
  gap: theme.spacing(3), // Add space between elements
  '& > *': {
    width: '100%',
    maxWidth: '500px', // Max width for the content inside
    padding: theme.spacing(3), // Adjust padding for the inner content (like the card)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1), // Less padding on smaller screens
    gap: theme.spacing(2), // Reduce space between elements on small screens
  },
}));

const formControlStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.5)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.8)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7c3aed',
      boxShadow: '0 0 10px rgba(124, 58, 237, 0.3)',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff',
  },
};

export default function SignIn(props) {
  const { theme } = React.useContext(ThemeContext); // Access the current theme
  const { login } = useContext(AuthContext); // Access the login function from AuthContext
  const navigate = useNavigate(); // For redirection
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [error, setError] = useState(''); // State for login errors

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateInputs()) {
      return;
    }
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
      const { token, user } = data; // Extract user object
      const role = user.role; // Extract role from user object
  
      // Debugging: Log the role to ensure it's correct
      console.log('Role from backend:', role);
  
      // Save token, user, and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store the full user object
      localStorage.setItem('role', role);
  
      // Update AuthContext
      login(user, token, role);
  
      // Redirect based on role
      if (role === 'user') {
        navigate('/user-profile');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };
  return (
    <>
      <SignInContainer
        direction="column"
        justifyContent="space-between"
        sx={{
          background:
            theme === 'dark'
              ? 'linear-gradient(135deg, #1e3a8a, #6d28d9)' // Dark mode gradient
              : 'imageUrl: LightModeGradient', // Light mode background image
          backgroundSize: 'cover', // Ensure the image covers the entire container
          backgroundColor: theme === 'dark' ? '#000000' : '#ffffff', // Fallback background color
        }}
      >
        <CardStyled variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: '100%',
              fontSize: 'clamp(2rem, 10vw, 2.15rem)',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60a5fa, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              mb: 3,
              filter: 'drop-shadow(0 0 8px rgba(124, 58, 237, 0.3))',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            Sign in
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel sx={{ color: '#a5b4fc', mb: 1 }}>Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                sx={formControlStyle}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: '#a5b4fc', mb: 1 }}>Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                sx={formControlStyle}
              />
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  value="showPassword"
                  onClick={togglePasswordVisibility} // Toggle password visibility
                  sx={{
                    color: '#7c3aed',
                    '&.Mui-checked': { color: '#7c3aed' },
                  }}
                />
              }
              label="Show password"
              sx={{ color: '#a5b4fc' }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  sx={{
                    color: '#7c3aed',
                    '&.Mui-checked': { color: '#7c3aed' },
                  }}
                />
              }
              label="Remember me"
              sx={{ color: '#a5b4fc' }}
            />

            {error && (
              <Typography color="error" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
              sx={{
                background: 'linear-gradient(45deg, #1d4ed8, #6d28d9)',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8, #4c1d95)',
                  boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign in
            </Button>

            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              sx={{
                color: '#8b5cf6',
                textAlign: 'center',
                textDecoration: 'none',
                '&:hover': {
                  color: '#7c3aed',
                  textShadow: '0 0 8px rgba(124, 58, 237, 0.5)',
                },
              }}
            >
              Forgot your password?
            </Link>
          </Box>

          <Divider
            sx={{
              my: 3,
              color: '#a5b4fc',
              '&::before, &::after': {
                borderColor: 'rgba(124, 58, 237, 0.3)',
              },
            }}
          >
            or
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                borderColor: '#000000',
                backgroundColor: '#000000',
                color: '#a5b4fc',
                padding: '10px',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#333333',
                  borderColor: '#333333',
                  boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
                },
              }}
            >
              Sign in with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              sx={{
                borderColor: '#000000',
                backgroundColor: '#000000',
                color: '#a5b4fc',
                padding: '10px',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#333333',
                  borderColor: '#333333',
                  boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
                },
              }}
            >
              Sign in with Facebook
            </Button>

            <Typography sx={{ textAlign: 'center', color: '#a5b4fc', mt: 2 }}>
              Don't have an account?{' '}
              <Link
                href="/signup"
                sx={{
                  color: '#8b5cf6',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#7c3aed',
                    textShadow: '0 0 8px rgba(124, 58, 237, 0.5)',
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
          <ForgotPassword open={open} handleClose={handleClose} />
        </CardStyled>
      </SignInContainer>
    </>
  );
}