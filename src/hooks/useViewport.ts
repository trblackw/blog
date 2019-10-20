import { useEffect, useState } from "react"

type Dimension = { height: number; width: number }

export default (): [Dimension] => {
  const [windowDimensions, setWindowDimensions] = useState<Dimension>({
    height: 0,
    width: 0,
  })
  const deriveWindowDimensions = (): void => {
    //cross browser compatible
    let height: number = 0,
      width: number = 0
    if (typeof window !== "undefined") {
      height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
    }

    setWindowDimensions({ height, width })
  }

  useEffect(() => {
    deriveWindowDimensions()
    if (typeof window !== "undefined") {
      window.addEventListener("resize", deriveWindowDimensions)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", deriveWindowDimensions)
      }
    }
  }, [])

  return [windowDimensions]
}
