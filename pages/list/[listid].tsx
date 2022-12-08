/* eslint-disable react-hooks/rules-of-hooks */
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from 'react';
import { Reorder } from "framer-motion";


export const getServerSideProps = async (ctx: any) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session)
      return {
        props: {}
    }
    
    const listid = ctx.query.listid;
  
    const { data } = await supabase
      .from('listcontent')
      .select('listcontent')
      .eq('listid', listid)
  
    if (data == null) {
        return {
            redirect: {
              permanent: false,
              destination: "/list"
            }
        }
    }

    return {
      props: {
          session: session,
          listcontent: data
      },
    }
}

export default function Lists({session, listcontent}: any) {
    const supabase = useSupabaseClient();
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
                        <div className='p-2 bg-slate-700 text-white justify-center'>
                            <div className='grid grid-cols-8'>
                                <h1 className='text-4xl p-2'>A*</h1>
                            </div>
                            <div className='grid grid-cols-8 bg-slate-700 text-white'>
                                <h1 className='text-4xl p-2'>A</h1>
                            </div>
                            <div className='grid grid-cols-8 bg-slate-700 text-white'>
                                <h1 className='text-4xl p-2'>B</h1>
                            </div>
                            <div className='grid grid-cols-8 bg-slate-700 text-white'>
                                <h1 className='text-4xl p-2'>C</h1>
                            </div>
                            <div className='grid grid-cols-8 bg-slate-700 text-white'>
                                <h1 className='text-4xl p-2'>D</h1>
                            </div>
                            <div className='grid grid-cols-8 bg-slate-700 text-white'>
                                <h1 className='text-4xl p-2'>None</h1>
                            </div>
                        </div>
                        <Reorder.Group axis="y" values={items} onReorder={setItems}>
                            {items.map((item) => (
                                <Reorder.Item key={item} value={item}>
                                    {item}
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </>
                )}
            </div>
        </>
    )
}