/* eslint-disable @next/next/no-img-element */

export async function getServerSideProps({ query } : any) {
    // Fetch data from external API
    const movieid = query.movieid
    const result = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=" + process.env.API_URL?.toString()).then((response) => response.json());

    // Pass data to the page via props
    return { props: { result } }
}

export default function DisplayMovie( { result } : any) {
    const backdrop_img = "url(https://image.tmdb.org/t/p/original" + result.backdrop_path + ")";
    const poster_img = "https://image.tmdb.org/t/p/w500" + result.poster_path;
    const tag = result.status + " " + result.release_date + " / " + result.runtime + " minutes / $" +  result.revenue;
    return (
        <>
            <main>
                <div style={{backgroundImage: backdrop_img}} className="relative px-6 lg:px-8 bg-cover bg-center backdrop-brightness-50">
                    <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500">
                            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20 bg-white">
                                <span className="text-gray-600">
                                    {tag}
                                </span>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl text-white font-bold tracking-tight sm:text-center sm:text-6xl drop-shadow-sm">
                                    {result.title}
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-white sm:text-center">
                                    {result.overview}
                                </p>
                                <div className="mt-8 flex gap-x-4 sm:justify-center">
                                <a
                                    href="#"
                                    className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md"
                                >
                                    IMDb
                                </a>
                                <a
                                    href="#"
                                    className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 bg-black text-white shadow-md"
                                >
                                    Watch Movie
                                </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="grid grid-cols-2 p-4">
                <div className="relative px-6 lg:px-8">
                    <img alt="posterimg" src={poster_img} className="rounded-3xl" />
                </div>
                <div></div>
            </div>
        </>
    );
}
