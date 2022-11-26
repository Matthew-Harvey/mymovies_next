
export async function getServerSideProps({ query } : any) {
    // Fetch data from external API
    const movieid = query.movieid
    const result = await fetch("https://api.themoviedb.org/3/movie/" + movieid + "?api_key=" + process.env.API_URL?.toString()).then((response) => response.json());

    // Pass data to the page via props
    return { props: { result: result } }
  }

export default function DisplayMovie( { result } : any) {
    return (
        <div>{result.title}</div>
    );
}
