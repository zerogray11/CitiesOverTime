import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { debounce } from '@mui/material/utils';

// Refined search container with subtle styling
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.common.white, 0.07),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.09),
  },
  marginLeft: 0,
  width: '100%',
  maxWidth: '400px',
  transition: 'all 0.3s ease',
  border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  '&:focus-within': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  }
}));

// Refined icon wrapper
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.6),
}));

// Refined input styling
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.common.white,
  width: '100%',
  fontWeight: 300,
  letterSpacing: '0.3px',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create(['width', 'background-color']),
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: '0.95rem',
    [theme.breakpoints.up('sm')]: {
      width: '16ch',
      '&:focus': {
        width: '24ch',
      },
    },
    '&::placeholder': {
      color: alpha(theme.palette.common.white, 0.4),
      fontSize: '0.95rem',
      fontWeight: 300,
    },
  },
}));

// Refined search results container
const SearchResults = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  right: 0,
  backgroundColor: alpha('#121220', 0.97),
  borderRadius: '6px',
  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2), 0 3px 6px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  maxHeight: '280px',
  overflowY: 'auto',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.common.white, 0.2),
    borderRadius: '4px',
  },
}));

// Refined search result item
const SearchResultItem = styled(Link)(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(1.2, 2),
  color: alpha(theme.palette.common.white, 0.85),
  textDecoration: 'none',
  fontSize: '0.9rem',
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
  transition: 'all 0.2s ease',
  fontWeight: 300,
  letterSpacing: '0.2px',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
  },
  '&:last-child': {
    borderBottom: 'none',
  }
}));

// Message component for states (loading, error, no results)
const SearchMessage = styled('div')(({ theme, type }) => ({
  padding: theme.spacing(1.5, 2),
  color: type === 'error' 
    ? alpha('#ff6b6b', 0.9) 
    : alpha(theme.palette.common.white, 0.6),
  fontSize: '0.9rem',
  fontWeight: 300,
  letterSpacing: '0.2px',
  textAlign: 'center',
}));

export default function SophisticatedSearchBar() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [allArticles, setAllArticles] = React.useState([]);
  const [filteredResults, setFilteredResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Fetch articles from the backend
  React.useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setAllArticles(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Debounced search function
  const handleSearch = React.useMemo(
    () =>
      debounce((query) => {
        if (query.trim() === '') {
          setFilteredResults([]);
          return;
        }

        const filtered = allArticles.filter((article) =>
          article.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredResults(filtered);
      }, 250),
    [allArticles]
  );

  // Update search query and trigger debounced search
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    // Delay blur slightly to allow clicking on results
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };

  // Show results only when focused or has query
  const showResults = isFocused && searchQuery.trim() !== '';

  return (
    <Search sx={{ boxShadow: isFocused ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
      <SearchIconWrapper>
        <SearchIcon fontSize="small" />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search' }}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />

      {/* Display search results */}
      {showResults && (
        <SearchResults>
          {isLoading ? (
            <SearchMessage>Searching...</SearchMessage>
          ) : error ? (
            <SearchMessage type="error">{error}</SearchMessage>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((article) => (
              <SearchResultItem
                key={article.id}
                to={`/article/${article.id}`}
                aria-label={`View article: ${article.title}`}
              >
                {article.title}
              </SearchResultItem>
            ))
          ) : (
            <SearchMessage>No matching results</SearchMessage>
          )}
        </SearchResults>
      )}
    </Search>
  );
}