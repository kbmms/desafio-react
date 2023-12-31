import axios from 'axios';
import { useEffect, useState } from 'react';
import ImageInitial from '../assets/images/image.png';
import { Link } from 'react-router-dom';
import slugify from 'slugify'; 

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
}

interface MoviesProps {
  searchQuery: string;
  setIsLoading: (loading: boolean) => void;
}

interface OmdbApiResponse {
  Search: Movie[];
  Response: 'True' | 'False';
  Error?: boolean;
  totalResults: number;
}

const Movies: React.FC<MoviesProps> = ({ searchQuery, setIsLoading }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState<boolean>(false); 
  
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  let debounceTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    setIsLoadingPage(true)
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 2000);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [searchQuery, currentPage]);

  // Monitor changes to the searchQuery state to reset the isError state
  useEffect(() => {
    setIsError(false);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setIsLoadingPage(true)
      setIsError(false); // Reset the error state when starting a new search
      const response = await axios.get<OmdbApiResponse>(
        `http://www.omdbapi.com/?apikey=de52b313&s=${searchQuery}&page=${currentPage}`
      );

      if (response.data.Response === 'True') {
        setMovies((prevMovies) =>
          currentPage === 1 ? response.data.Search || [] : [...prevMovies, ...(response.data.Search || [])]
        );
        setTotalPages(Math.ceil(response.data.totalResults / itemsPerPage));
      } else {
        setIsError(true);
        setMovies([]);
        setTotalPages(1);
      }
      setIsLoadingPage(false)
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsError(true); // Set the error message for request errors
      setIsLoading(false);
      setIsLoadingPage(false)
    }
  };

    // Effect to restart page when searchQuery changes
    useEffect(() => {
      setCurrentPage(1);
    }, [searchQuery]);


    const createSlug = (title: string): string => {
      const cleanTitle = title.replace(/:/g, ''); // Remove all occurrences of ":"
      return slugify(cleanTitle, {
        replacement: '-',
        lower: true,
      });
    };
    

    const handlePreviousPage = () => {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
  
    const handleNextPage = () => {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
  

  // Render list of movies from current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  

  // Always render the initial message when the search field is empty and there are no movies in the list
  if ((!searchQuery || searchQuery.trim() === '') && !movies.length) {
    return (
      <section className="flex flex-col flex-1 items-center justify-center mt-8">
        <img src={ImageInitial} alt="Initial" />
        <h2 className="text-[24px] font-bold text-white mt-5 mb-1">Don't know what to search?</h2>
        <p className="text-[16px] text-[#7B8C98]">Here's an offer you can't refuse</p>
      </section>
    );
  }

  // Render the list of movies when there are results
  return (
  <section>
    {isError && !movies.length ? (
      <div className="mt-8 flex items-center justify-center">
        <p className="text-[24px] font-bold text-white mt-5 mb-1">Sorry... Movie not Found!</p>
      </div>
    ) : ( 
    <>
      {isLoadingPage ? 
      (<>
          <div className='flex w-full justify-center items-center mt-9 mb-9'>
            <div className="spinner"><div className="custom-loader"></div></div>
          </div>
      </>) :
      (<>      
        <div className="grid gap-4 mt-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">  
            {visibleMovies?.map((movie) => (
              <Link to={`${createSlug(movie.Title)}/${movie.imdbID}`} key={movie.imdbID}>
                <div className="movie-card cursor-pointer transition transform hover:scale-110 flex items-center justify-center">
                  <img className="w-full h-[198px] rounded-md object-contain lg:h-[198px] lg:w-[140px]" src={movie.Poster} alt={movie.Title} />
                </div>
              </Link>
            ))}
        </div>
      </>)}
    </>
    )}
    {totalPages > 1 && (
    <div className="flex justify-center mt-28">
    <button className="mr-2 px-4 py-2 text-white bg-slate-800 rounded hover:bg-slate-600 focus:outline-none"
      onClick={handlePreviousPage}
      disabled={currentPage === 1}>
      Previous
    </button>
    <button className="ml-2 px-4 py-2 text-white bg-slate-800 rounded hover:bg-slate-600 focus:outline-none"
      onClick={handleNextPage}
      disabled={currentPage === totalPages}>
      Next
    </button>
    </div>
    )}

    {totalPages > 1 && <div className='mb-9 text-white text-center mt-2 text-gray-600'> {currentPage} of {totalPages} pages</div>}

  </section>
  );
};

export default Movies;
