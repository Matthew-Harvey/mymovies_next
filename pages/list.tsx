/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import axios from 'axios';

export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data } = await supabase
    .from('listcontent')
    .select('listid, listcontent')
    .eq('userid', session?.user.id)

  if (!session)
    return

  return {
    props: {
        session: session,
        userlists: data
    },
  }
}

async function CreateList(userid: string, router: any) { 
    const getResult = await axios.get(process.env.NEXT_PUBLIC_BASEURL?.toString() + "api/CreateList", {params: {userid: userid}});
    router.push({
        pathname: '/list/[listid]',
        query: { listid: getResult.data.listid },
    })
}

export default function Lists({session, userlists}: any) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    // get lists that user created.
    const display_lists = userlists.map((list: any) =>
        <div key={list.listid} className="group cursor-pointer relative inline-block text-center">
            <a href={"/list/" + list.listid}>
                <p className='p-2' >{list.listcontent.listname}</p>
            </a>
        </div>
    );
    return (
        <>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28 max-w-4xl m-auto text-center'>
                {!session ? (
                    <>
                        <h1 className='font-semibold text-2xl p-2'>To create/view lists you must login:</h1>
                        <p>Demo credentials:
                            <br />
                            email - matthewtlharvey@gmail.com
                            <br />
                            pass - demo
                        </p>
                        <div className='max-w-xl m-auto text-center text-lg'>
                            <Auth
                                supabaseClient={supabase}
                                appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                    colors: {
                                        brand: 'red',
                                        brandAccent: 'darkred',
                                    },
                                    },
                                },
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className='max-w-lg p-10 justify-center m-auto'>
                            <p className='mb-6'>Logged in using - {session.user.email}.</p>
                            <button onClick={()=> CreateList(session.user.id, router)} 
                                className="inline-block rounded-lg bg-yellow-600 px-4 py-1.5 text-base font-semibold leading-7 text-black shadow-md hover:bg-orange-500 hover:text-white hover:scale-110 ease-in-out transition">
                                    Create a list
                            </button>
                            <div className='p-6'>
                                {display_lists}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}