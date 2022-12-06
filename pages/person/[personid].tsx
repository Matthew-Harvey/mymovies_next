/* eslint-disable @next/next/no-img-element */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";

export async function getServerSideProps({ query } : any) {
    // Fetch data from external API
    const personid = query.personid;
    const main = await fetch("https://api.themoviedb.org/3/person/" + personid + "?api_key=" + process.env.REACT_APP_API_URL?.toString()).then((response) => response.json());
    const credits = await fetch("https://api.themoviedb.org/3/person/" + personid + "/combined_credits?api_key=" + process.env.REACT_APP_API_URL?.toString()).then((response) => response.json());

    // Pass data to the page via props
    return { props: { main, credits } }
}

export default function DisplayPerson( { main, credits } : any) {
    const baseimg = "https://image.tmdb.org/t/p/w500";
    const poster_img = baseimg + main.profile_path;
    const imdblink = "https://www.imdb.com/name/" + main.imdb_id;
    const tag = main.birthday + " / " + main.place_of_birth;
    const [parent] = useAutoAnimate<HTMLDivElement>();
    const [parent2] = useAutoAnimate<HTMLDivElement>();

    const castarr: (string | number)[][] = [];
    var counter = 0;
    credits.cast.forEach((movie: { name: string; character: string; title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        if (movie.title == undefined) {
            castarr.push([movie.name, movie.popularity, imgurl, movie.character, movie.id, counter, "/tv/" + movie.id])
        } else {
            castarr.push([movie.title, movie.popularity, imgurl, movie.character, movie.id, counter, "/movie/" + movie.id])
        }
        counter++;
    });
    castarr.sort(compareSecondColumn);

    const [castpage, setCastPage] = useState(1);
    const [castperpage] = useState(8);
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
    const display_cast = currentcast.map((movie: any) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <a href={movie[6]}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                    <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                        {movie[0]}
                    </span>
                </div>
            </a>
        </div>
    );

    const crewarr: (string | number)[][] = [];
    var counter = 0;
    credits.crew.forEach((movie: { name: string; character: string; title: string; popularity: number; poster_path: string; job: string; id: number}) => {
        var imgurl = "";
        if (movie.poster_path == null){
            imgurl = "https://eu.ui-avatars.com/api/?name=" + movie.name;
        } else {
            imgurl = baseimg + movie.poster_path;
        }
        if (movie.title == undefined) {
            crewarr.push([movie.name, movie.popularity, imgurl, movie.character, movie.id, counter, "/tv/" + movie.id])
        } else {
            crewarr.push([movie.title, movie.popularity, imgurl, movie.character, movie.id, counter, "/movie/" + movie.id])
        }
        counter++;
    });
    crewarr.sort(compareSecondColumn);

    const [crewpage, setCrewPage] = useState(1);
    const [crewperpage] = useState(8);
    const indexofcrewlast = crewpage * crewperpage;
    const indexofcrewfirst = indexofcrewlast - crewperpage;
    const currentcrew = crewarr.slice(indexofcrewfirst, indexofcrewlast)
    const crewPageNumbers = [];
    for (let i = 1; i <= Math.ceil(crewarr.length / crewperpage); i++) {
        crewPageNumbers.push(i);
    }
    const crewpaginate = (number: number) => {
        if (number >= 1 && number <= Math.ceil(crewarr.length / crewperpage)) {
            setCrewPage(number);
        }
    };
    const display_crew = currentcrew.map((movie: any) =>
        <div key={movie[5]} className="group cursor-pointer relative inline-block text-center">
            <a href={movie[6]}>
                <img id={movie[4].toString()} src={movie[2]} alt={movie[0].toString()} className="rounded-3xl w-48 p-2 h-70" />
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
            <main>
                <div className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover bg-gradient-to-br from-blue-400 to-red-500">
                    <div className="grid grid-cols-6 mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40 items-stretch">
                        <img src={poster_img} alt={main.name.toString()} className="w-100 invisible md:visible md:rounded-l-3xl md:col-span-2" />
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
                                    {main.name}
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                                    Known for {main.known_for_department}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="p-6 font-semibold text-lg">
                {main.biography}
            </div>
            <div className="grid p-2 sm:grid-cols-1 md:grid-cols-1">
                <div className="col-span-1 sm:ml-0 md:ml-5 lg:ml-10" ref={parent}>
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">In Cast: </span>
                            <button onClick={() => paginate(castpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {castpage + " / " + Math.ceil(castarr.length / castperpage)} </span>
                            <button onClick={() => paginate(castpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    {display_cast}
                    <div className="group cursor-pointer relative p-2 grid grid-cols-1 text-left items-stretch">
                        <span>
                            <span className="text-3xl leading-8 font-bold pr-4">In Crew: </span>
                            <button onClick={() => crewpaginate(crewpage-1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Prev</button>
                            <span className="font-normal text-sm"> {crewpage + " / " + Math.ceil(crewarr.length / crewperpage)} </span>
                            <button onClick={() => crewpaginate(crewpage+1)} className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">Next</button>
                        </span>
                    </div>
                    {display_crew}
                </div>
            </div>
        </>
    );
}


function compareSecondColumn(a: any, b: any) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (b[1] < a[1]) ? -1 : 1;
    }
}