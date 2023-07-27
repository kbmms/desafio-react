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
      replacement: '-',
      lower: true,
    });
  };

  return (
    <div className="mt-9 pb-9 pl-4 pr-4 lg:pl-0 lg:pr-0 related-box">
      <h2 className="text-white text-2xl font-bold mb-4">Your search:</h2>
      <div className="flex gap-[0.9rem] overflow-auto pt-5 pb-5">
        {relatedMovies.map((movie) => (
          <Link 
          to={`#`} key={movie.imdbID}
          onClick={() => {
            window.location.href = `/${createSlug(movie.Title)}/${movie.imdbID}`;
          }}>
            <div className="w-[140px] h-[200px] bg-[#171C21] rounded-md overflow-hidden shadow-lg">
              <img className="w-full object-cover" src={movie.Poster} alt={movie.Title} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
