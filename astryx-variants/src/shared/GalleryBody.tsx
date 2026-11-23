// Gallery — adapted from the Astryx `classic-gallery` page template.
// Kept: the centered column (max 1200, padding 6/8), the centered intro
// Section (max 680) with filter TabList, and the uniform 3:2 tile Grid
// (minWidth 260, gap 4). Added: Lightbox (useLightbox) so photos open full
// size, an EmptyState until the council has photos, and a link out to the
// shared Google Photos album. Shared by all three variants; each variant's
// Shell and theme supply the look.

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { VStack, Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Center } from '@astryxdesign/core/Center';
import { Text, Heading } from '@astryxdesign/core/Text';
import { Grid } from '@astryxdesign/core/Grid';
import { Section } from '@astryxdesign/core/Section';
import { TabList, Tab } from '@astryxdesign/core/TabList';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { useLightbox } from '@astryxdesign/core/Lightbox';
import { PhotoIcon, ArrowTopRightOnSquareIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { council, gallery, type GalleryPhoto } from './content';

// Template frame values (moved from inline style objects to StyleX).
const styles = stylex.create({
  outer: {
    maxWidth: 1200,
    width: '100%',
    paddingInline: 'var(--spacing-6)',
    paddingBlock: 'var(--spacing-8)',
  },
  textCenter: { textAlign: 'center' },
  imageWrapper: {
    position: 'relative',
    aspectRatio: '3/2',
    borderRadius: 'var(--radius-container)',
    overflow: 'clip',
    cursor: 'zoom-in',
  },
  imgFill: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

type Filter = 'All' | GalleryPhoto['category'];

function AlbumButton({ variant = 'primary' }: { variant?: 'primary' | 'secondary' }) {
  if (gallery.albumUrl) {
    return (
      <Button
        label="See all photos on Google Photos"
        variant={variant}
        href={gallery.albumUrl}
        target="_blank"
        icon={<Icon icon={ArrowTopRightOnSquareIcon} size="sm" />}
      />
    );
  }
  // No album yet: invite members to send photos to the council.
  return (
    <Button
      label="Share your photos with the council"
      variant={variant}
      href={`mailto:${council.email}?subject=${encodeURIComponent('Photos for the council website')}`}
      icon={<Icon icon={EnvelopeIcon} size="sm" />}
    />
  );
}

// `titleStyle="display"` uses the theme's display face (Heritage titles).
export function GalleryBody({ titleStyle = 'heading' }: { titleStyle?: 'heading' | 'display' }) {
  const [filter, setFilter] = useState<Filter>('All');
  const photos = gallery.photos;
  const categories = [...new Set(photos.map((p) => p.category))];
  const shown = filter === 'All' ? photos : photos.filter((p) => p.category === filter);
  const lightbox = useLightbox({
    media: shown.map((p) => ({ src: p.src, alt: p.alt, caption: p.caption })),
  });

  return (
    <Layout
      height="auto"
      content={
        <LayoutContent role="main" padding={0}>
          <Center axis="horizontal">
            <VStack gap={8} xstyle={styles.outer}>
              {/* Header */}
              <Center axis="horizontal">
                <Section variant="transparent" maxWidth={680} padding={0}>
                  <VStack gap={4} hAlign="center" xstyle={styles.textCenter}>
                    <VStack gap={2} hAlign="center">
                      {titleStyle === 'display' ? (
                        <Text type="display-2" as="h1">
                          Gallery
                        </Text>
                      ) : (
                        <Heading level={1}>Gallery</Heading>
                      )}
                      <Text type="body" color="secondary">
                        {gallery.intro}
                      </Text>
                    </VStack>
                    {photos.length > 0 && <AlbumButton variant="secondary" />}
                    {categories.length > 1 && (
                      <TabList value={filter} onChange={(v) => setFilter(v as Filter)}>
                        <Tab value="All" label="All" />
                        {categories.map((c) => (
                          <Tab key={c} value={c} label={c} />
                        ))}
                      </TabList>
                    )}
                  </VStack>
                </Section>
              </Center>

              {photos.length === 0 ? (
                <Section variant="muted" padding={10}>
                  <EmptyState
                    icon={<Icon icon={PhotoIcon} size="lg" color="secondary" />}
                    title="Photos coming soon"
                    description="We're gathering pictures from council meetings, parish events and service projects. Have photos to share? Send them our way."
                    headingLevel={2}
                    actions={<AlbumButton />}
                  />
                </Section>
              ) : (
                /* Gallery grid; each photo opens full size in the Lightbox */
                <Grid columns={{ minWidth: 260, repeat: 'fit' }} gap={4}>
                  {shown.map((photo, i) => (
                    <VStack key={photo.src} xstyle={styles.imageWrapper}>
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                        {...stylex.props(styles.imgFill)}
                        {...lightbox.getTriggerProps(i)}
                      />
                    </VStack>
                  ))}
                </Grid>
              )}
            </VStack>
          </Center>
          {lightbox.element}
        </LayoutContent>
      }
    />
  );
}
