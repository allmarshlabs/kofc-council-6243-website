import type { PageProps } from '../../App';
import { GalleryBody } from '../../shared/GalleryBody';
import { Shell } from './Shell';

export default function Gallery({ current }: PageProps) {
  return (
    <Shell current={current}>
      <GalleryBody />
    </Shell>
  );
}
