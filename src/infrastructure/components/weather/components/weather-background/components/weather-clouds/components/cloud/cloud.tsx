import { CSSProperties, useMemo } from "react"
import { createStableRandom } from "../../../../weather-background.utils"
import "./cloud.scss"

type StableRandom = {
  random: () => number
  float: (min: number, max: number) => number
}

type CloudProps = {
  seed: number
  index: number
  isLoading?: boolean
  style?: CSSProperties
}

const getCloudSize = (sizeRandom: number, random: StableRandom) => {
  if (sizeRandom >= 0.8) {
    return {
      size: "large" as const,
      width: random.float(120, 160),
      height: random.float(40, 60),
    }
  }
  if (sizeRandom >= 0.4) {
    return {
      size: "medium" as const,
      width: random.float(70, 120),
      height: random.float(25, 45),
    }
  }
  return {
    size: "small" as const,
    width: random.float(40, 80),
    height: random.float(15, 30),
  }
}

export const Cloud = ({ seed, index, isLoading = false, style }: CloudProps) => {
  const { size, width, height } = useMemo(() => {
    const random = createStableRandom(seed, index) as StableRandom
    return getCloudSize(random.random(), random)
  }, [seed, index])

  return (
    <div
      className={`weather-background__cloud weather-background__cloud--${size} ${isLoading ? "weather-background__cloud--loading" : ""}`}
      style={{
        ...style,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  )
}
