/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import Lottie from 'lottie-react';
import MovieGIF from '../public/movie_index.json';

export default function Home() {
  return (
    <>
      <div className="relative px-6 lg:px-8 backdrop-brightness-50 bg-fixed bg-center bg-cover bg-gradient-to-br from-blue-400 to-red-500">
          <div className="grid grid-cols-6 mx-auto max-w-6xl pt-40 pb-30 sm:pt-40 sm:pb-40 h-screen w-screen items-stretch">
                  <div className="rounded-3xl col-span-6 md:col-span-6">
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 items-stretch">
                      <div className='m-auto'>
                        <h1 className="text-4xl text-white font-bold tracking-tight sm:text-center sm:text-6xl drop-shadow-md">
                          MyMovies
                        </h1>
                        <div className="mt-8 flex gap-x-4 sm:justify-center">
                          <a
                            href="/trending"
                            className="inline-block rounded-lg bg-blue-700 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-blue-400 hover:text-white hover:scale-110 ease-in-out transition"
                          >
                            Trending
                          </a>
                          <a
                            href="https://github.com/Matthew-Harvey/mymovies_next"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block rounded-lg bg-slate-800 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-md hover:bg-slate-600 hover:text-white hover:scale-110 ease-in-out transition"
                          >
                            Github
                          </a>
                        </div>
                      </div>
                      <div>
                        <Lottie animationData={MovieGIF} />
                      </div>
                    </div>
                  </div>
          </div>
      </div>
    </>
  )
}
