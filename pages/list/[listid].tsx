/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { useRouter } from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react';
import { Reorder } from 'framer-motion';


export const getServerSideProps = async (ctx: any) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session)
        return {
            props: {
                listcontent: [],
                loggedin: false,
                serveruser: "",
            }
        }

    const { data } = await supabase
        .from('listcontent')
        .select('listcontent, userid')
        .eq('listid', ctx.query.listid)

    if (data == null) {
        return {
            redirect: {
              permanent: false,
              destination: "/list"
            }
          }
    } else {
        return {
            props: {
                listcontent: data,
                loggedin: true,
                // @ts-ignore
                serveruser: data[0].userid,
            },
        } 
    }
}

export default function Lists({listcontent, loggedin, serveruser}: any) {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const session = useSession();
    try{
        listcontent = listcontent[0].listcontent;
    } catch{
        listcontent = ""
    }
    const [editbool, setEdit] = useState<Boolean>(false);
    if (serveruser == session?.user.id && editbool == false) {
        setEdit(true)
    }
    const [title, setTitle] = useState("");
    const titleChange = (value: any) => {
        setTitle(value);
    }
    const [summary, setSummary] = useState("");
    const SummaryChange = (value: any) => {
        setSummary(value);
    }
    const [items, setItems] = useState([0, 1, 2, 3])
    if (session != undefined && loggedin == false) {
        router.push({
            pathname: '/list',
            query: {},
        })
    }
    return (
        <>
            <div className='grid p-2 sm:grid-cols-1 md:grid-cols-1 mt-28 m-auto justify-center text-center'>
                {!session ? (
                    <>
                        <h1 className='font-semibold text-2xl p-2'>To create/view lists you must login:</h1>
                        <p>Demo credentials:
                            <br />
                            email - matthewtlharvey@gmail.com
                            <br />
                            pass - demouser
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
                            {editbool == false &&
                                <>
                                    <p className='p-2 text-center font-semibold text-5xl'>{listcontent.listname}</p>
                                    <br />
                                    <p className='p-2 text-center font-medium text-sm'>{listcontent.summary}</p>
                                </>
                            }
                            {editbool == true &&
                                <>
                                    <div className='justify-center m-auto text-center grid p-2 sm:grid-cols-1 md:grid-cols-1'>
                                        <input className='p-2 text-center font-semibold text-5xl' placeholder={listcontent.listname} value={title} onChange={(e) => titleChange(e.target.value)} />
                                        <br />
                                        <input className='p-2 text-center font-medium text-sm' placeholder={listcontent.summary} value={summary} onChange={(e) => SummaryChange(e.target.value)} />
                                    </div>
                                </>
                            }
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