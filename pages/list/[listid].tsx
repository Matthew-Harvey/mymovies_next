/* eslint-disable react-hooks/rules-of-hooks */
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

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
    console.log(listcontent)
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
                        <p className='p-6'>List Info</p>
                        <p>{listcontent.listname}</p>
                        <p>{listcontent.created}</p>
                    </>
                )}
            </div>
        </>
    )
}