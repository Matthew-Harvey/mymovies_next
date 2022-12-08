/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSidePropsContext, PreviewData, NextApiRequest, NextApiResponse } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { Reorder } from 'framer-motion';


export const getServerSideProps = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | { req: NextApiRequest; res: NextApiResponse<any>; }) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session)
        return {
            props: {
                userlists: [],
                loggedin: false
            }
        }

    const { data } = await supabase
    .from('listcontent')
    .select('listid, listcontent')
    .eq('userid', session?.user.id)

    return {
        props: {
            userlists: data,
            loggedin: true,
        },
    }
}

export default function Lists({listcontent, loggedin}: any) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const session = useSession();
    listcontent = listcontent[0].listcontent;
    const editbool = useState<Boolean>(true);
    const [items, setItems] = useState([0, 1, 2, 3])
    return (
        <>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28 m-auto justify-center'>
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
                        <div>
                            <p className='p-2 text-center font-semibold text-5xl'>{listcontent.listname}</p>
                            <p className='p-2 text-center font-medium text-sm'>{listcontent.summary}</p>
                        </div>
                        <Reorder.Group axis="y" values={items} onReorder={setItems}>
                            {items.map((item) => (
                                <Reorder.Item key={item} value={item}>
                                    <>
                                        <div className='bg-slate-700 p-5 text-white'>
                                            {item}
                                        </div>
                                    </>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </>
                )}
            </div>
        </>
    )
}