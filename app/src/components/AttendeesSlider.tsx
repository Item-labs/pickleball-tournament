import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

type Tile =
  | { id: string; description: string; image: string; className: string }
  | { id: string; label: string };

const confirmed = [
  {
    id: 'item',
    description: 'item',
    image: '/assets/logo-item.png',
    className: 'h-7 w-auto',
  },
  {
    id: 'slash',
    description: 'Slash',
    image: '/assets/logo-slash.png',
    className: 'h-6 w-auto',
  },
];

/* repeat the confirmed logos (plus an open-slot tile) so the belt is
   wider than the container — the slider loops its content at 50% */
const belt: Tile[] = Array.from({ length: 4 }).flatMap((_, round) => [
  ...confirmed.map((logo) => ({ ...logo, id: `${logo.id}-${round}` })),
  { id: `you-${round}`, label: 'Your logo here' },
]);

export function AttendeesSlider() {
  return (
    <div className='relative h-[100px] w-full overflow-hidden'>
      <InfiniteSlider
        className='flex h-full w-full items-center'
        duration={30}
        gap={48}
      >
        {belt.map((tile) => (
          <div key={tile.id} className='flex w-32 items-center justify-center'>
            {'image' in tile ? (
              <img
                src={tile.image}
                alt={tile.description}
                className={tile.className}
              />
            ) : (
              <span className='whitespace-nowrap rounded-md border border-dashed border-[#f3cdb0] bg-[#fdf3ec] px-3 py-1.5 text-xs font-semibold text-[#FF4F00]'>
                {tile.label}
              </span>
            )}
          </div>
        ))}
      </InfiniteSlider>
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 left-0 h-full w-[48px] sm:w-[90px]'
        direction='left'
        blurIntensity={0.5}
      />
      <ProgressiveBlur
        className='pointer-events-none absolute top-0 right-0 h-full w-[48px] sm:w-[90px]'
        direction='right'
        blurIntensity={0.5}
      />
    </div>
  );
}
