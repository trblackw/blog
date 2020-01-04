export const convertTimeStamp = (stamp: number | string): string => {
  //designed to handle converting both Unix time stamps (number) and ISO dates (strings)
  const isISODate = typeof stamp === "string"
  const date = isISODate ? new Date(stamp) : new Date((stamp as number) * 1000)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

export const formatReadingTime = (timeString: string): string => {
  const [minutes] = timeString.split(" ")
  let beers: number
  if (Number(minutes) >= 5) {
    beers = Math.round(Number(minutes) / Math.E)
  } else {
    beers = Number(minutes)
  }
  return `${new Array(Number(beers)).fill("🍺").join(" ")} ${minutes} min read`
}

export const scrollPageTo = (position: 'top' | 'bottom') => {
	window.scrollTo({ top: position === 'bottom' ? document.body.scrollHeight : 0, left: 0, behavior: 'smooth' })
}