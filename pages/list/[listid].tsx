/* eslint-disable react-hooks/rules-of-hooks */
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useRouter } from 'next/router';


export default function Lists() {
    const supabase = useSupabaseClient();
    const session = useSession();
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
                        <p>List Info</p>
                    </>
                )}
            </div>
        </>
    )
}

function makeid(length: number) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}   
async function CreateList(userid: string, supabase: any) { 
    const listid = makeid(12);
    const {error} = await supabase
        .from('userlists')
        .insert({ userid: userid, listid: listid})
    const router = useRouter();
    router.push({
        pathname: '/list/[listid]',
        query: { listid: listid },
    })
}