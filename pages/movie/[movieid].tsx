/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

export async function getServerSideProps({ query } : any) {
    // Fetch data from external API
    const movieid = query.movieid
    const main = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=" + process.env.API_URL?.toString()).then((response) => response.json());
    const credits = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "/credits?api_key=" + process.env.API_URL?.toString()).then((response) => response.json());

    // Pass data to the page via props
    return { props: { main, credits } }
}

export default function DisplayMovie( { main, credits } : any) {
    const baseimg = "https://image.tmdb.org/t/p/w500";
    const backdrop_img = "url(https://image.tmdb.org/t/p/original" + main.backdrop_path + ")";
    const poster_img = baseimg + main.poster_path;
    const imdblink = "https://www.imdb.com/title/" + main.imdb_id;
    const revtotal = "$" + new Intl.NumberFormat('en-US').format(main.revenue);
    const tag = main.status + " " + main.release_date + " / " + main.runtime + " minutes / " +  revtotal;

    const genre_list = 
        <div className="flex container items-center flex-row py-4">
            {main.genres.map((genre: { id: string; name: string; }) =>
                <div key={genre.id} className="p-1">
                    <span className="z-10 p-3 text-sm leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-slate-700 to-slate-500 shadow-lg">
                        {genre.name}
                    </span>
                </div>
            )}
            <div className="p-1">
                <span className="z-10 p-3 text-sm leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-slate-700 to-slate-500 shadow-lg">
                    Score {main.vote_average}/10
                </span>
            </div>
        </div>
    ;

    function compareSecondColumn(a: any, b: any) {
        if (a[1] === b[1]) {
            return 0;
        }
        else {
            return (b[1] < a[1]) ? -1 : 1;
        }
    }
    const castarr: (string | number)[][] = [];
    credits.cast.forEach((person: { original_name: string; popularity: number; profile_path: string; character: string; id: number}) => {
        castarr.push([person.original_name, person.popularity, person.profile_path, person.character, person.id])
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
        setCastPage(number);
    };

    const pagination = pageNumbers.map((number) =>
        <div key={number} className="group cursor-pointer relative inline-block text-center p-2">
            <a onClick={() => paginate(number)}>
                {number}
            </a>
        </div>
    );

    const display_list = currentcast.map((person) =>
        <div key={person[4]} className="group cursor-pointer relative inline-block text-center">
            <img src={baseimg + person[2]} alt={person[0].toString()} className="rounded-3xl w-40 p-2" />
            <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                <span className="z-10 p-3 text-md leading-none rounded-lg text-white whitespace-no-wrap bg-gradient-to-r from-blue-700 to-red-700 shadow-lg">
                    {person[0]} as {person[3]}
                </span>
            </div>
        </div>
    );

    return (
        <>
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover">
                    <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
                        <div className="p-8 rounded-3xl bg-white bg-opacity-60 shadow-md">
                            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-md leading-6 ring-1 ring-gray-900/50 hover:ring-gray-900/5">
                                    <span className="text-gray-600">
                                        {tag}
                                    </span>
                                </div>
                            </div>
                            <div>
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
            <div className="grid p-4 sm:grid-cols-1 md:grid-cols-6">
                <div className="relative px-6 col-span-2">
                    {genre_list}
                    <img alt="posterimg" src={poster_img} className="rounded-3xl" />
                </div>
                <div className="col-span-4">
                    <div className="text-3xl leading-8 font-bold text-black p-4">Top Cast:</div>
                    {display_list}
                    <div className="text-3xl leading-8 font-semibold text-black p-4">{pagination}</div>
                </div>
            </div>
        </>
    )
}