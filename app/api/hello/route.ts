export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'world';
  
  return new Response(`Hello ${name}`);
}