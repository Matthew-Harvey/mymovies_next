/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

const baseimg = "https://image.tmdb.org/t/p/w500";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import axios from "axios";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
    // Fetch data from external API
    const movie = await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const type = "movie";
    const query = "";
    // Pass data to the page via props
    return { props: { mediatype: type, query: query, movie: movie} }
}

export default function MoviesHome( { mediatype, query, movie } : any) {
    useEffect(() => {
        const fetchData = async () => {
            console.log(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/getSearchResult")
            const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/getSearchResult", {params: {searchterm: query, type: mediatype}});
            console.log(getResult, query)
        }
        fetchData();
    }, [query]);

    const [parent] = useAutoAnimate<HTMLDivElement>();
    
    const movie_arr: (string | number)[][] = [];
    var counter = 0;
    movie.results.forEach((movie: { title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        movie_arr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter])
        counter++;
    });
    
    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(8);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = movie_arr.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(movie_arr.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(movie_arr.length / castperpage)) {
            setCastPage(number);
        }
    };
    const display_movies = currentcast.map((movie) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <a href={"/movie/" + movie[4]}>
                <img id={movie[4].toString()} src={movie[2].toString()} alt={movie[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </a>
        </div>
    );
    return (
        <>
            <div className="grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28">
                <div className="col-span-2 sm:ml-0 md:ml-5 lg:ml-10" ref={parent}>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">Trending Movies: </span>
                            <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {castpage + " / " + Math.ceil(movie_arr.length / castperpage)} </span>
                            <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    {display_movies}
                </div>
            </div>
        </>
    )
}