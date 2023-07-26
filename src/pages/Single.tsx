import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {ArrowLeft, Heart } from "@phosphor-icons/react";
import { useNavigate, Link } from 'react-router-dom';

import RelatedMovies from '../components/RelatedMovies'

import Imdb from '../assets/images/imdb.png'
import Orange from '../assets/images/orange.png'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MovieDetailsParams {
    title: string;
    imdbID: string;
    [key: string]: string;
  }

interface MovieDetails {
    imdbID: string;
    Title: string;
    Poster: string;
    Plot: string;
    Genre: string;
    Actors: string;
    Director: string;
    imdbRating: string;
    Year: string;
    Runtime: string;
    Ratings: string;
    Rated: string;
  }
  
export default function Single(){
    const navigate = useNavigate();
    const { title, imdbID } = useParams<MovieDetailsParams>();
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    async function fetchMovieDetails(){
        setIsLoading(true)
        try{
            const response = await axios.get(`http://www.omdbapi.com/?apikey=de52b313&i=${imdbID}`)
            setMovieDetails(response.data);
        }catch(error){
            console.log(error)
            setIsLoading(false)
        }
        setIsLoading(false)
    }


    useEffect(()=> {
        fetchMovieDetails();
    }, [])

    const handleGoBack = () => {
        navigate(-1); // Navigate to previous page
    };


    const withBreak = (actorList:string) => {
        if (!actorList) {
          return null; 
        }
      
        // Split the string into an array, using the comma as separator
        const actorsArray = actorList.split(", ");
      
        // Creates a new string with each actor on a separate line
        const actorsWithBreaks = actorsArray.map(actor => <React.Fragment key={actor}>{actor}<br /></React.Fragment>);
      
        return actorsWithBreaks;
    };
      


    const isMovieFavorite = (imdbID:string) => {
        const favorites = getFavoritesFromLocalStorage();
        return favorites.some((movie) => movie.imdbID === imdbID);
    };

    // Function to add or remove movie from favorites
    const handleToggleFavorite = () => {
        const favorites = getFavoritesFromLocalStorage();
        const isFavorite = isMovieFavorite(imdbID ?? '');
    
        if (isFavorite) {
        // Remove movie from favorites
        const updatedFavorites = favorites.filter((movie) => movie?.imdbID !== imdbID);
        toast.success("You removed from favorites", {
            theme: 'dark'
        })
        saveFavoritesToLocalStorage(updatedFavorites);
        } else {
        // Add movie to favorites only if movieDetails is not null
        if (movieDetails) {
            const updatedFavorites = [...favorites, movieDetails];
            saveFavoritesToLocalStorage(updatedFavorites);
            toast.success("Added to favorites", {
                theme: 'dark'
            })
        }
        }
    
        setIsFavorite(!isFavorite);
    };

    useEffect(() => {
    setIsFavorite(isMovieFavorite(imdbID ?? ''));
    }, [imdbID]);
            
    // Function to get favorite movies from localStorage
    const getFavoritesFromLocalStorage = (): MovieDetails[] => {
        const favoritesJSON = localStorage.getItem('favorites');
        return favoritesJSON ? JSON.parse(favoritesJSON) : []; // Retorna um array vazio caso seja null
    };

    // Function to save favorite movies in localStorage
    const saveFavoritesToLocalStorage = (favorites: MovieDetails[]) => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };
    

  if(isLoading){
    return(
        <div className="bg-bgPrimay-900 h-screen flex justify-center items-center">
           <div className="spinner"><div className="custom-loader"></div></div>
        </div>
    ) 
}

    return(
        <div className="bg-bgPrimay-900 ">
            <div className="max-w-[912px] mx-auto h-screen">
                <main className="pt-12 flex flex-col h-screen">
                    <div className='md:flex-row gap-7 px-4 md:px-0'>
                        <ArrowLeft size={32} color="#595959" onClick={handleGoBack} className='cursor-pointer'/>
                        <div className='mt-2'>
                            <div className='text-neutral-400 flex items-center gap-2'>
                                <div className='text-[16px]'>{movieDetails?.Runtime}</div> 
                                <div className='h-[5px] w-[5px] rounded-full bg-slate-400'></div> 
                                <div className='text-[16px]'>{movieDetails?.Year}</div> 
                                <div className='h-[5px] w-[5px] rounded-full bg-slate-400'></div> 
                                <span className='block bg-[#7B8C98] pl-2 pr-2 pt-1 pb-1 rounded-md  text-[12px] font-extrabold text-[#000]'>{movieDetails?.Rated}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-7 px-4 md:px-0'>
                        <div className='md:w-1/2'>
                            <div className='mt-5'>
                            <h1 className='text-[36px] md:text-[60px] text-white font-extrabold'>{movieDetails?.Title}</h1>
                            </div>
                            <div className='mt-2 flex gap-3 flex-wrap'>
                            <div className='flex items-center border gap-2 border-[#171C21] rounded-md imdb-rating h-[32px]'>
                                <img src={Imdb} width={45} className='h-[32px]' />
                                <span className='text-[12px] text-[#ccc]'>{movieDetails?.imdbRating} / 10</span>
                            </div>
                            <div className='flex items-center border gap-2 border-[#171C21] rounded-md imdb-rating h-[32px]'>
                                <img src={Orange} width={45} className='h-[32px]' />
                                <span className='text-[12px] text-[#ccc]'>{movieDetails?.Ratings[1]?.Value ? movieDetails?.Ratings[1]?.Value : 'N/A'}</span>
                            </div>
                            <div className='flex items-center border gap-2 border-[#171C21] p-2 rounded-md h-[32px] cursor-pointer' onClick={handleToggleFavorite}>
                                {isFavorite ? 
                                (<><Heart size={22} weight="fill" color="#d45d5d" className='cursor-pointer' /> <span className='text-[12px] text-[#ccc]'>Remove from favorites</span></>) :
                                (<><Heart size={22} color="#ccc" className='cursor-pointer' /> <span className='text-[12px] text-[#ccc]'>Add to favorites</span></>)
                                }
                                
                            </div>
                            </div>
                            <div className='mt-9'>
                            <span className='block text-[#7B8C98]'>Plot</span>
                            <span className='text-white'>{movieDetails?.Plot}</span>
                            </div>
                            <div className='flex flex-col md:flex-row justify-between mt-9'>
                            <div>
                                <span className='block text-[#7B8C98]'>Cast</span>
                                <div className='details-text'>
                                <span>{withBreak(movieDetails?.Actors ?? '')}</span>
                                </div>
                            </div>
                            <div className='lg:hidden md:hidden w-full h-1 mt-3 mb-3 bg-slate-800'></div>
                            <div>
                                <span className='block text-[#7B8C98]'>Genre</span>
                                <div className='details-text'>
                                <span>{withBreak(movieDetails?.Genre ?? '')}</span>
                                </div>
                            </div>
                            <div className='lg:hidden md:hidden w-full h-1 mt-3 mb-3 bg-slate-800'></div>
                            <div>
                                <span className='block text-[#7B8C98]'>Director</span>
                                <div className='details-text'>
                                <span>{withBreak(movieDetails?.Director ?? '')}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        <div className='md:w-1/2 mx-auto flex justify-end'>
                            <img src={movieDetails?.Poster} className='min-w-[360px]' />
                        </div>
                    </div>

                    {movieDetails && <RelatedMovies selectedTitle={movieDetails?.Title} />}
                </main>
            </div>
            <ToastContainer />
        </div>
    )
}