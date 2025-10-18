import "./weather-cloud.scss"

export type WeatherCloudDirection = "ltr" | "rtl"

export interface WeatherCloudProps {
  topPercent: number
  scale: number
  opacity: number
  durationSec: number
  delaySec: number
  direction: WeatherCloudDirection
  layer: 1 | 2 | 3
}

export const WeatherCloud = ({
  topPercent,
  scale,
  opacity,
  durationSec,
  delaySec,
  direction,
  layer,
}: WeatherCloudProps) => {
  const styleVars = {
    top: `${topPercent}%`,
    opacity,
    "--cloud-scale": String(scale),
    "--cloud-duration": `${durationSec}s`,
    "--cloud-delay": `${delaySec}s`,
  } as React.CSSProperties

  return (
    <div
      className={`weather-cloud weather-cloud--${direction} weather-cloud--layer-${layer}`}
      aria-hidden="true"
      style={styleVars}
    >
      <div className="weather-cloud__inner"></div>
    </div>
  )
}
