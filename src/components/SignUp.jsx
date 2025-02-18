import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
  Card,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon } from './CustomIcons';

const CardStyled = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: '64px auto',
  background: '#000000',
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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  flexDirection: 'column',
  gap: theme.spacing(3),
  background: 'linear-gradient(135deg, #1e3a8a, #6d28d9)',
  backgroundColor: '#000000',
  flexGrow: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    gap: theme.spacing(2),
  },
}));

const formControlStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.5)',
      borderWidth: '2px'
    },
    '&:hover fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.8)'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7c3aed',
      boxShadow: '0 0 10px rgba(124, 58, 237, 0.3)'
    }
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff'
  }
};

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateInputs = () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value;

    let isValid = true;

    // Validate full name
    if (!fullName || fullName.trim().length === 0) {
      setNameError(true);
      setNameErrorMessage('Full name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Validate password
    if (!password || password.length < 6) {
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

    const user = {
      fullName: document.getElementById('fullName').value,
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        credentials: 'include', // Include credentials (e.g., cookies)
      });
  
      // Check if the response is OK (status code 2xx)
      if (!response.ok) {
        // Try to parse the error response as JSON
        let errorData;
        try {
          errorData = await response.json();
        } catch (error) {
          // If parsing as JSON fails, read the response as text
          const errorText = await response.text();
          throw new Error(errorText || 'Registration failed');
        }
        throw new Error(errorData.message || 'Registration failed');
      }
  
      // Try to parse the successful response as JSON
      let result;
      try {
        result = await response.json();
      } catch (error) {
        // If parsing as JSON fails, read the response as text
        const resultText = await response.text();
        console.log('User registered successfully:', resultText);
        alert('Registration successful!');
        return;
      }
  
      console.log('User registered successfully:', result);
      alert('Registration successful!');
    } catch (error) {
      console.error('Error during registration:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  };
  return (
    <SignUpContainer>
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
          Sign up
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel sx={{ color: '#a5b4fc', mb: 1 }}>Full name</FormLabel>
            <TextField
              error={nameError}
              helperText={nameErrorMessage}
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Full name"
              autoComplete="name"
              required
              fullWidth
              sx={formControlStyle}
            />
          </FormControl>

          <FormControl>
            <FormLabel sx={{ color: '#a5b4fc', mb: 1 }}>Username</FormLabel>
            <TextField
              error={nameError}
              helperText={nameErrorMessage}
              id="username"
              type="text"
              name="username"
              placeholder="username"
              autoComplete="username"
              required
              fullWidth
              sx={formControlStyle}
            />
          </FormControl>

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
              id="password"
              name="password"
              placeholder="••••••"
              type={passwordVisible ? 'text' : 'password'}
              autoComplete="new-password"
              required
              fullWidth
              sx={formControlStyle}
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                value="showPassword"
                onClick={togglePasswordVisibility}
                sx={{
                  color: '#7c3aed',
                  '&.Mui-checked': { color: '#7c3aed' }
                }}
              />
            }
            label="Show password"
            sx={{ color: '#a5b4fc' }}
          />

          <FormControlLabel
            control={
              <Checkbox
                value="allowExtraEmails"
                sx={{
                  color: '#7c3aed',
                  '&.Mui-checked': { color: '#7c3aed' }
                }}
              />
            }
            label="I want to receive updates via email."
            sx={{ color: '#a5b4fc' }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
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
            Sign up
          </Button>
        </Box>

        <Divider sx={{
          my: 3,
          color: '#a5b4fc',
          '&::before, &::after': {
            borderColor: 'rgba(124, 58, 237, 0.3)'
          }
        }}>
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
            Sign up with Google
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
            Sign up with Facebook
          </Button>

          <Typography sx={{ textAlign: 'center', color: '#a5b4fc', mt: 2 }}>
            Already have an account?{' '}
            <Link
              href="/signin"
              sx={{
                color: '#8b5cf6',
                textDecoration: 'none',
                '&:hover': {
                  color: '#7c3aed',
                  textShadow: '0 0 8px rgba(124, 58, 237, 0.5)'
                }
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </CardStyled>
    </SignUpContainer>
  );
}