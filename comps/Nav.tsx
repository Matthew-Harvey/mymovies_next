/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

export default function DisplayMovie( { result } : any) {
    const [show, setShow] = useState(false);
    return (
        <>
            <div className="bg-gray-100 overflow-y-hidden sticky top-0 z-50">
                <nav className="w-full">
                    <div className="container mx-auto px-6 py-3 flex items-center justify-between">
                        <a href="/">
                            <div className="flex items-center" aria-label="Home" role="img">
                                <img className="cursor-pointer w-9 h-9 sm:w-auto" src="/movie.png" alt="logo" />
                                <p className="ml-2 lg:ml-4 text-3xl font-bold text-gray-800">MyMovies</p>
                            </div>
                        </a>
                        <div>
                            <button onClick={() => setShow(!show)} className="sm:block md:hidden lg:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                <img className="h-8 w-8" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg4.svg" alt="show" />
                            </button>
                            <div id="menu" className={`md:block lg:block ${show ? '' : 'hidden'}`}>
                                <button onClick={() => setShow(!show)} className="block md:hidden lg:hidden text-gray-500 hover:text-gray-700 focus:text-gray-700 fixed focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white md:bg-transparent z-30 top-0 mt-3">
                                    <img className="h-8 w-8" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/center_aligned_with_image-svg5.svg" alt="hide" />
                                </button>
                                <ul className="flex text-3xl md:text-base items-center py-8 md:flex flex-col md:flex-row justify-center fixed md:relative top-0 bottom-0 left-0 right-0 bg-white md:bg-transparent  z-20">
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer md:ml-10 pt-10 md:pt-0">
                                        <a href="/trending">Trending</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer md:ml-10 pt-10 md:pt-0">
                                        <a href="/shows">Shows</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer md:ml-10 pt-10 md:pt-0">
                                        <a href="/movies">Movies</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer md:ml-10 pt-10 md:pt-0">
                                        <a href="/people">People</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer md:ml-10 pt-10 md:pt-0">
                                        <a href="/list">Lists</a>
                                    </li>
                                    <li className="text-gray-600 text-lg hover:text-blue-400 cursor-pointer md:ml-10 pt-10 md:pt-0">
                                        <a href="/quiz">Quiz</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}
