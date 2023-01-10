/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { useAutoAnimate } from '@formkit/auto-animate/react';

const baseimg = "https://image.tmdb.org/t/p/w500";

export async function getServerSideProps({ query } : any) {
    // Fetch data from external API
    const movieid = query.movieid
    const main = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const credits = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/credits?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const recommend = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/recommendations?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    const videos = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/videos?api_key=" + process.env.NEXT_PUBLIC_APIKEY?.toString()).then((response) => response.json());
    // Pass data to the page via props
    return { props: { main, credits, recommend, videos} }
}

export default function DisplayMovie( { main, credits, recommend, videos} : any) {
    const backdrop_img = "url(https://image.tmdb.org/t/p/original" + main.backdrop_path + ")";
    const poster_img = baseimg + main.poster_path;
    const imdblink = "https://www.imdb.com/title/" + main.imdb_id;
    const revtotal = "$" + new Intl.NumberFormat('en-US').format(main.revenue);
    const tag = main.status + " " + main.release_date + " / " + main.runtime + " minutes / " +  revtotal;
    const [parent] = useAutoAnimate<HTMLDivElement>();

    const genre_list = 
        <div className="flex container items-center flex-row py-4">
            {main.genres.map((genre: { id: string; name: string; }) =>
                <div key={genre.id} className="p-1">
                    <span className="z-10 p-3 text-sm leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg">
                        {genre.name}
                    </span>
                </div>
            )}
            <div className="p-1">
                <span className="z-10 p-3 text-sm leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg">
                    {main.vote_average}/10
                </span>
            </div>
            <div className="p-1">
                <span className="z-10 p-3 text-sm leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-slate-700 to-slate-900 shadow-lg">
                    {main.original_language}
                </span>
            </div>
        </div>
    ;

    const castarr: (string | number)[][] = [];
    credits.cast.forEach((person: { original_name: string; popularity: number; profile_path: string; character: string; id: number}) => {
        var imgurl = "";
        if (person.profile_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + person.original_name;
        } else {
            imgurl = baseimg + person.profile_path;
        }
        castarr.push([person.original_name, person.popularity, imgurl, person.character, person.id])
    });
    castarr.sort(compareSecondColumn);

    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(6);
    const indexoflast = castpage * castperpage;
    const indexoffirst = indexoflast - castperpage;
    const currentcast = castarr.slice(indexoffirst, indexoflast)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(castarr.length / castperpage); i++) {
        pageNumbers.push(i);
    }
    const paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(castarr.length / castperpage)) {
            setCastPage(number);
        }
    };
    const display_cast = currentcast.map((person) =>
        <div key={person[4]} className="group cursor-pointer relative inline-block text-center">
            <a href={"/person/" + person[4]}>
                <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {person[0]} as {person[3]}
                    </span>
                </div>
            </a>
        </div>
    );

    const crewarr: (string | number)[][] = [];
    var counter = 0;
    credits.crew.forEach((person: { original_name: string; popularity: number; profile_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (person.profile_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + person.original_name;
        } else {
            imgurl = baseimg + person.profile_path;
        }
        crewarr.push([person.original_name, person.popularity, imgurl, person.job, person.id, counter])
        counter++;
    });
    crewarr.sort(compareSecondColumn);

    const [crewpage, setCrewPage] = useState(1);
    const [crewperpage] = useState(6);
    const indexoflastcrew = crewpage * crewperpage;
    const indexoffirstcrew = indexoflastcrew - crewperpage;
    const currentcrew = crewarr.slice(indexoffirstcrew, indexoflastcrew)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(crewarr.length / crewperpage); i++) {
        crewPageNumbers.push(i);
    }
    const crewpaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(crewarr.length / crewperpage)) {
            setCrewPage(number);
        }
    };
    const display_crew = currentcrew.map((person) =>
        <div key={person[5]} className="group cursor-pointer relative inline-block text-center">
            <a href={"/person/" + person[4]}>
                <img id={person[4].toString()} src={person[2].toString()} alt={person[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {person[0]} as {person[3]}
                    </span>
                </div>
            </a>
        </div>
    );
    return (
        <>
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover">
                <div className="grid grid-cols-6 mx-auto max-w-4xl pt-20 pb-32 sm:pt-48 sm:pb-40 items-stretch">
                        <img src={poster_img} alt={main.title.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
                        <div className="bg-white bg-opacity-75 shadow-md rounded-3xl md:rounded-r-3xl md:rounded-none col-span-6 md:col-span-4">
                            <div className="hidden sm:mb-8 sm:flex sm:justify-center p-2">
                                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-md leading-6 ring-1 ring-gray-900/50 hover:ring-gray-900/5">
                                    <span className="text-gray-600">
                                        {tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-2">
                                <h1 className="text-4xl text-black font-bold tracking-tight sm:text-center sm:text-6xl drop-shadow-sm">
                                    {main.title}
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                                    {main.overview}
                                </p>
                                <div className="mt-8 flex gap-x-4 sm:justify-center">
                                    <a
                                        href={imdblink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition"
                                    >
                                        IMDb
                                    </a>
                                    <a
                                        href={main.homepage}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-black text-white shadow-md hover:scale-110 hover:text-black hover:bg-white ease-in-out transition"
                                    >
                                        Watch Movie
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="grid p-2 sm:grid-cols-1 md:grid-cols-3">
                <div className="col-span-2 sm:ml-0 md:ml-5 lg:ml-10" ref={parent}>
                    <div className="text-2xl leading-8 font-normal pr-4">{main.tagline}</div>
                    {genre_list}
                    <br />
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">Top Cast: </span>
                            <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {castpage + " / " + Math.ceil(castarr.length / castperpage)} </span>
                            <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    {display_cast}
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch mt-2">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">Top Crew: </span>
                            <button onClick={() => crewpaginate(crewpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {crewpage + " / " + Math.ceil(crewarr.length / crewperpage)} </span>
                            <button onClick={() => crewpaginate(crewpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    {display_crew}
                    <MovieVideos videos={videos} />
                </div>
                <div>
                    {main.belongs_to_collection != null &&
                        <div key={main.belongs_to_collection} className="group cursor-pointer relative inline-block text-center">
                            <a href={"/collection/" + main.belongs_to_collection.id}>
                                <img id={main.belongs_to_collection.id.toString()} src={baseimg + main.belongs_to_collection.poster_path.toString()} alt={main.belongs_to_collection.name.toString()} className="rounded-3xl p-2" />
                            </a>
                        </div>
                    }
                    <div className="text-3xl leading-8 font-bold pr-4">Recommended: </div>
                    <RecommendedMovies recommend={recommend} />
                </div>
            </div>
        </>
    )
}

function RecommendedMovies ({ recommend } : any) {
    const rec_arr: (string | number)[][] = [];
    var counter = 0;
    recommend.results.forEach((movie: { title: string; popularity: number; poster_path: string; job: string; id: number, media_type: string}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.title;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        var hrefrec = "";
        if (movie.media_type == "tv") {
            hrefrec = "/tv/" + movie.id;
        } else {
            hrefrec = "/movie/" + movie.id;
        }
        rec_arr.push([movie.title, movie.popularity, imgurl, movie.job, movie.id, counter, hrefrec])
        counter++;
    });
    rec_arr.sort(compareSecondColumn);
    const rec_result = rec_arr.map((movie : any) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <a href={movie[6]}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-40 p-2 h-60" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </a>
        </div>
    );
    return (
        <div className="">
            {rec_result}
        </div> 
    )
}

function compareSecondColumn(a: any, b: any) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (b[1] < a[1]) ? -1 : 1;
    }
}

import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

function MovieVideos ({ videos } : any) {
    const video_arr: (string | number)[][] = [];
    var counter = 0;
    videos.results.forEach((video: { name: string; id: string; key: string, site: string, official: boolean}) => {
        var imgurl = "";
        if (video.site == "YouTube" && video.official == true) {
            imgurl = "https://www.youtube.com/watch?v=" + video.key;
            video_arr.push([video.name, imgurl, counter])
            counter++;
        }
    });
    const [videopage, setVideoPage] = useState(1);
    const [videoperpage] = useState(1);
    const indexoflastvideo = videopage * videoperpage;
    const indexoffirstvideo = indexoflastvideo - videoperpage;
    const currentvideo = video_arr.slice(indexoffirstvideo, indexoflastvideo)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(video_arr.length / videoperpage); i++) {
        crewPageNumbers.push(i);
    }
    const video_paginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(video_arr.length / videoperpage)) {
            setVideoPage(number);
        }
    };
    const videoresult = currentvideo.map((video) =>
        <div key={video[2]} className="p-2 sm:w-full col-span-2 object-cover">
            <ReactPlayer url={video[1].toString()} width="100%" controls={true} />
        </div>
    );
    return (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 p-2">
            {video_arr.length != 0 &&
                <>
                    <div className="text-3xl leading-8 font-bold pr-4">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">Videos: </span>
                            <button onClick={() => video_paginate(videopage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {videopage + " / " + Math.ceil(video_arr.length / videoperpage)} </span>
                            <button onClick={() => video_paginate(videopage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                </>
            }
            <br />
            {videoresult}
        </div>
    )
}