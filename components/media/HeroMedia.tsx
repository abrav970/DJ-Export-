import { Media } from "@/components/media/Media";
import { heroVideo, media } from "@/data/media";

/**
 * Hero background: a looping muted video when one is configured, otherwise the
 * still photograph. Callers never branch on which.
 *
 * The video is deliberately optional. A 5–10s loop is several megabytes and
 * would land on the largest-contentful-paint path; the still carries the same
 * composition at a fraction of the weight. Both use the same asset as poster,
 * so the switch is invisible to layout.
 */
export const HeroMedia = () => {
  if (!heroVideo) {
    return <Media slot="hero-export" priority sizes="100vw" tone="dark" />;
  }

  return (
    <div className="grain relative h-full w-full overflow-hidden">
      <video
        // Every attribute here is load-bearing: without muted + playsInline,
        // mobile browsers refuse to autoplay and show a paused first frame.
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={media["hero-export"].src ?? undefined}
        aria-hidden="true"
        className="h-full w-full object-cover"
      >
        <source src={heroVideo.webm} type="video/webm" />
        <source src={heroVideo.mp4} type="video/mp4" />
      </video>
    </div>
  );
};
