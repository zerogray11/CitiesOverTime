import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',  // Rounded corners
  backgroundColor: alpha(theme.palette.common.white, 0.1),  // Semi-transparent white
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),  // Slightly lighter on hover
  },
  marginLeft: 0,
  width: '100%',
  maxWidth: '400px',  // Limit the width for better aesthetics
  border: '1px solid transparent',
  backgroundClip: 'padding-box',  // Ensure the border gradient doesn't overlap
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: '12px',
    background: 'linear-gradient(45deg, #1e3a8a, #6d28d9, #1e3a8a, #4c1d95)',  // Gradient border
    zIndex: -1,
    animation: 'borderAnimation 6s ease infinite',  // Animated gradient
  },
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#a5b4fc',  // Light purple icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',  // White text color
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,  // Space for the icon
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function FuturisticSearchBar() {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
      />
    </Search>
  );
}