import { sql } from "@vercel/postgres";

export default async function Home() {
  // automatic caching -(saves the result into memory (on the server))

  //
  let time = await fetch("http://worldtimeapi.org/api/timezone/Europe/London", {
    next: { revalidate: 10 },
  });
  const data = await time.json();

  const datetime = new Date(data.datetime);
  const evenEasierToReadDate = datetime.toLocaleTimeString("en-GB");

  console.log(data);

  await sql`INSERT INTO ViewsTable (views) SELECT 0 WHERE NOT EXISTS (SELECT * FROM ViewsTable)`;
  await sql`UPDATE ViewsTable SET views = views +1`;
  const result = await sql`SELECT views from ViewsTable`;

  return (
    <main className="flex min-h-screen flex-col items-center">
      <p>You are looking at root route</p>
      <p>This page has been viewed {result.rows[0].views} time(s)</p>
      <p>The time is : {evenEasierToReadDate}</p>
    </main>
  );
}
