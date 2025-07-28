// /app/api/calendar/route.ts
export async function GET() {
  const res = await fetch(
    'https://api.tradingeconomics.com/calendar/country/all?c=guest:guest'
  )
  const data = await res.json()

  return Response.json(data)
}