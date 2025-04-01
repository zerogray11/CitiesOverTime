import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { debounce } from '@mui/material/utils'; // For debouncing

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginLeft: 0,
  width: '100%',
  maxWidth: '400px',
  border: '1px solid transparent',
  backgroundClip: 'padding-box',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: '12px',
    background: 'linear-gradient(45deg, #1e3a8a, #6d28d9, #1e3a8a, #4c1d95)',
    zIndex: -1,
    animation: 'borderAnimation 6s ease infinite',
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
  color: '#a5b4fc',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SearchResults = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: '#1e1e2f',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
  marginTop: theme.spacing(1),
  maxHeight: '200px',
  overflowY: 'auto',
}));

const SearchResultItem = styled(Link)(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(1, 2),
  color: '#fff',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: '#2d2d48',
  },
}));

export default function FuturisticSearchBar() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [allArticles, setAllArticles] = React.useState([]); // Store all fetched articles
  const [filteredResults, setFilteredResults] = React.useState([]); // Store filtered results
  const [isLoading, setIsLoading] = React.useState(false); // Loading state
  const [error, setError] = React.useState(null); // Error state

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
        setAllArticles(data); // Store all articles
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
          setFilteredResults([]); // Clear results if query is empty
          return;
        }

        const filtered = allArticles.filter((article) =>
          article.title.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredResults(filtered); // Set filtered results
      }, 300), // 300ms debounce delay
    [allArticles]
  );

  // Update search query and trigger debounced search
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search articles…"
        inputProps={{ 'aria-label': 'search' }}
        value={searchQuery}
        onChange={handleInputChange}
      />

      {/* Display search results */}
      {searchQuery && (
        <SearchResults>
          {isLoading ? (
            <div style={{ padding: '8px 16px', color: '#fff' }}>Loading...</div>
          ) : error ? (
            <div style={{ padding: '8px 16px', color: '#ff6b6b' }}>{error}</div>
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
            <div style={{ padding: '8px 16px', color: '#fff' }}>
              No results found
            </div>
          )}
        </SearchResults>
      )}
    </Search>
  );
}