/* eslint-disable @next/next/no-img-element */

export async function getServerSideProps({ query } : any) {
    // Fetch data from external API
    const personid = query.personid;
    const main = await fetch("https://api.themoviedb.org/3/person/" + personid + "?api_key=" + process.env.API_URL?.toString()).then((response) => response.json());
    const credits = await fetch("https://api.themoviedb.org/3/person/" + personid + "/combined_credits?api_key=" + process.env.API_URL?.toString()).then((response) => response.json());

    // Pass data to the page via props
    return { props: { main, credits } }
}

export default function DisplayPerson( { main, credits } : any) {
    const baseimg = "https://image.tmdb.org/t/p/w500";
    const poster_img = baseimg + main.profile_path;
    const imdblink = "https://www.imdb.com/name/" + main.imdb_id;
    const tag = main.birthday + " / " + main.place_of_birth;
    return (
        <>
            <main>
                <div className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover bg-gradient-to-br from-blue-400 to-red-500">
                    <div className="grid grid-cols-6 mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
                        <img src={poster_img} alt={main.name.toString()} className="w-100 col-span-2 rounded-l-3xl" />
                        <div className="col-span-4 p-2 bg-white bg-opacity-60 shadow-md rounded-r-3xl">
                            <div>
                                <h1 className="text-4xl text-black font-bold tracking-tight sm:text-center sm:text-6xl drop-shadow-sm">
                                    {main.name}
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                                    Known for {main.known_for_department}
                                </p>
                            </div>
                            <div className="hidden sm:mb-8 sm:flex sm:justify-center p-2">
                                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-md leading-6 ring-1 ring-gray-900/50 hover:ring-gray-900/5">
                                    <span className="text-gray-600">
                                        {tag}
                                    </span>
                                </div>
                            </div>
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
            </main>
            <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                {main.biography}
            </p>
        </>
    );
}
