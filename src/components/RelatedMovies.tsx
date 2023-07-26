import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import slugify from 'slugify';

interface RelatedMoviesProps {
    selectedTitle: string;
}

interface Movie {
    imdbID: string;
    Title: string;
    Poster: string;
}


export default function RelatedMovies({ selectedTitle }: RelatedMoviesProps) {
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  console.log("selectedTitle:", selectedTitle);

  useEffect(() => {
    async function fetchRelatedMovies() {
      try {
        const response = await axios.get(
          `http://www.omdbapi.com/?apikey=de52b313&s=${localStorage.getItem('film')}`
        );

        if (response.data.Response === 'True') {
          // Limit the related movies to a maximum of 6
          const limitedRelatedMovies = response.data.Search.slice(0,6);
          setRelatedMovies(limitedRelatedMovies);
        } else {
          setRelatedMovies([]);
        }
      } catch (error) {
        console.error('Error fetching related movies:', error);
        setRelatedMovies([]);
      }
    }

    fetchRelatedMovies();
  }, [selectedTitle]);

  // Create a function to convert the title to a slug format
  const createSlug = (title: string): string => {
    return slugify(title, {
      replacement: '-', // Replace spaces with hyphens
      lower: true, // Convert text to lowercase
    });
  };

  return (
    <div className="mt-9">
      <h2 className="text-white text-2xl font-bold mb-4">Your search:</h2>
      <div className="grid grid-cols-6 gap-4 overflow-auto">
        {relatedMovies.map((movie) => (
          <Link 
          to={`#`} key={movie.imdbID}
          onClick={() => {
            window.location.href = `/${createSlug(movie.Title)}/${movie.imdbID}`;
          }}>
            <div className="bg-[#171C21] rounded-md overflow-hidden shadow-lg">
              <img className="w-full h-40 object-cover" src={movie.Poster} alt={movie.Title} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}