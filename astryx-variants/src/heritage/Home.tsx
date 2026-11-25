// Home — adapted from the Astryx `side-gallery` page template.
// Kept: Layout/LayoutContent frame, the 2-up fit Grid (minWidth 360, gap 8),
// the copy column (eyebrow, h1, body, CTA row, divider + stat blocks) and the
// 3-column image collage. Replaced: copy, stats and images with council
// content; added principle / meeting / pillar / founder sections below in the
// same Grid + VStack rhythm.

import * as stylex from '@stylexjs/stylex';
import {VStack, HStack, Layout, LayoutContent} from '@astryxdesign/core/Layout';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Grid} from '@astryxdesign/core/Grid';
import {Divider} from '@astryxdesign/core/Divider';
import {Section} from '@astryxdesign/core/Section';
import {Card} from '@astryxdesign/core/Card';
import {Icon} from '@astryxdesign/core/Icon';
import {Link} from '@astryxdesign/core/Link';
import {
  CalendarDaysIcon,
  ArrowRightIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import type {PageProps} from '../App';
import {
  assets,
  council,
  founder,
  meetings,
  meetingsNote,
  pillars,
  principles,
} from '../shared/content';
import {Shell, useHeritage} from './Shell';
import {upcomingMeetings, formatShort, formatMonthDay} from './schedule';

const styles = stylex.create({
  tile: {
    borderRadius: 'var(--radius-element)',
    overflow: 'hidden',
  },
  // Portrait sits on the right of the 16:9 painting: crop toward him.
  mcgivneyCrop: {objectPosition: '80% 30%'},
  // Official emblem (reverse on the dark ground, positive on white) as the hero seal.
  emblem: {padding: {default: 'var(--spacing-12)', '@media (max-width: 768px)': 'var(--spacing-2)'}},
  // On phones the full-width square leaves a lot of empty space; cap it.
  heroEmblem: {
    width: '100%',
    maxWidth: {default: 'none', '@media (max-width: 768px)': 240},
    marginInline: 'auto',
  },
  // Principles: the numeral sits on the same text line as the blackletter
  // name (Stack has no baseline option), and a fixed numeral column keeps
  // the names and their captions on one left edge across all four degrees.
  degreeRow: {alignItems: 'baseline', columnGap: 'var(--spacing-3)'},
  // Right-aligned in a column as wide as "III", so each numeral sits snug
  // against its name and the four names still share one left edge.
  numeral: {minWidth: '1.6em', textAlign: 'end'},
  // Comfortable reading measure for the intro paragraph.
  measure: {maxWidth: 680},
});

// ─── Stat Block ─────────────────────────────────────────────────────────────

// One labelled entry in the hero's "Next meetings" row: group, then date.
function NextMeeting({group, value}: {group: string; value: string}) {
  return (
    <VStack gap={0}>
      <Text type="supporting" color="secondary">
        {group}
      </Text>
      <Text type="large" weight="bold">
        {value}
      </Text>
    </VStack>
  );
}

// ─── Hero Image ─────────────────────────────────────────────────────────────
// One image in the template's gallery slot: the official KofC emblem, which
// stands for the organization. (The McGivney portrait is in the founder section.)

function HeroImage() {
  // Reverse (light) emblem on Variant 1's dark ground; positive on white.
  const {emblemSrc} = useHeritage();
  return (
    <AspectRatio ratio={1} fit="contain" xstyle={styles.heroEmblem}>
      <img
        src={emblemSrc}
        alt="Knights of Columbus emblem"
        {...stylex.props(styles.emblem)}
      />
    </AspectRatio>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <VStack gap={2}>
      <Text type="supporting" color="secondary" weight="semibold">
        {eyebrow.toUpperCase()}
      </Text>
      <Text type="display-3" as="h2">
        {title}
      </Text>
      {body && (
        <Text type="body" color="secondary">
          {body}
        </Text>
      )}
    </VStack>
  );
}

// Each principle is one of the Order's degrees, in order.
const DEGREES = [
  {numeral: 'I', name: 'First Degree'},
  {numeral: 'II', name: 'Second Degree'},
  {numeral: 'III', name: 'Third Degree'},
  {numeral: 'IV', name: 'Fourth Degree'},
];

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Home({current}: PageProps) {
  const {href} = useHeritage();
  // Four degrees read as one row, a 2 × 2 block, or a list — never 3 + 1.
  const isWide = useMediaQuery('(min-width: 1100px)');
  const isPhone = useMediaQuery('(max-width: 600px)');
  const degreeColumns = isWide ? 4 : isPhone ? 1 : 2;
  // The next meeting for each group (from the meeting rhythm in content.ts),
  // shown soonest first.
  const upcoming = upcomingMeetings(6);
  const todayLabel = new Date().toDateString();
  const nextMeetings = (['Knights', 'Ladies Auxiliary'] as const)
    .map(group => upcoming.find(u => u.group === group))
    .filter(m => m !== undefined)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(m => ({
      group: m.group,
      value:
        m.date.toDateString() === todayLabel
          ? `Today, ${formatMonthDay(m.date)}`
          : formatShort(m.date),
    }));
  return (
    <Shell current={current}>
      <Layout
        height="auto"
        contentWidth={1400}
        content={
          <LayoutContent padding={6} isScrollable={false}>
            <VStack gap={10}>
              <Grid
                columns={{minWidth: 360, max: 2, repeat: 'fit'}}
                gap={8}
                align="center">
                {/* Left side: Text + CTA */}
                <VStack gap={6} vAlign="center">
                  <VStack gap={3}>
                    <Text type="supporting" color="secondary" weight="semibold">
                      {`${council.name.toUpperCase()} · ${council.location.toUpperCase()}`}
                    </Text>
                    {/* The council leads; the parish name is the small label above.
                        Two lines: the half-width column is too narrow for one. */}
                    <Text type="display-1" as="h1">
                      Knights of Columbus
                      <br />
                      {`Council\u00A0${council.number}`}
                    </Text>
                    <Text type="large" color="secondary">
                      {council.intro}
                    </Text>
                  </VStack>

                  <HStack gap={3} vAlign="center" wrap="wrap">
                    <Button
                      label="Council calendar"
                      variant="primary"
                      size="lg"
                      href={href('calendar')}
                      icon={<Icon icon={CalendarDaysIcon} />}
                    />
                    <Button
                      label="Become a Knight"
                      size="lg"
                      href={href('join')}
                    />
                  </HStack>

                  <VStack gap={4}>
                    <Divider />
                    <HStack gap={4} hAlign="between" vAlign="center">
                      <Text type="supporting" color="secondary" weight="semibold">
                        NEXT MEETINGS
                      </Text>
                      <Link href={href('calendar')} type="supporting" weight="semibold">
                        Full calendar
                      </Link>
                    </HStack>
                    <HStack gap={8} wrap="wrap">
                      {nextMeetings.map(m => (
                        <NextMeeting key={m.group} group={m.group} value={m.value} />
                      ))}
                    </HStack>
                  </VStack>
                </VStack>

                {/* Right side: the KofC emblem as the single hero image */}
                <HeroImage />
              </Grid>

              {/* Principles — the four degrees of the Order */}
              <Section
                paddingBlock={10}
                paddingInline={6}
                dividers={['top', 'bottom']}
                variant="transparent">
                <VStack gap={8}>
                  <VStack gap={3}>
                    <SectionHeader eyebrow="Since 1882" title="Our principles" />
                    <Text type="large" color="secondary" xstyle={styles.measure}>
                      {council.givingNote}
                    </Text>
                  </VStack>
                  <Grid
                    columns={degreeColumns}
                    columnGap={6}
                    rowGap={isPhone ? 5 : 8}>
                    {principles.map((p, i) => (
                      <HStack key={p} gap={0} xstyle={styles.degreeRow}>
                        <Text
                          type="large"
                          weight="semibold"
                          color="secondary"
                          aria-hidden
                          xstyle={styles.numeral}>
                          {DEGREES[i].numeral}
                        </Text>
                        <VStack gap={1}>
                          <Text type="display-3" as="h3" color="accent">
                            {p}
                          </Text>
                          <Text type="supporting" color="secondary">
                            {DEGREES[i].name}
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </Grid>
                </VStack>
              </Section>

              {/* Meetings */}
              <Grid
                columns={{minWidth: 360, max: 2, repeat: 'fit'}}
                gap={8}
                align="center">
                <VStack gap={4}>
                  <SectionHeader
                    eyebrow="Meetings"
                    title="Gather with us on Monday evenings"
                    body={meetingsNote}
                  />
                  <HStack gap={3} wrap="wrap">
                    <Button
                      label="See upcoming dates"
                      variant="primary"
                      href={href('calendar')}
                      icon={<Icon icon={ArrowRightIcon} />}
                    />
                    <Button
                      label="Email the council"
                      variant="ghost"
                      href={`mailto:${council.email}`}
                      icon={<Icon icon={EnvelopeIcon} />}
                    />
                  </HStack>
                </VStack>
                <VStack gap={3}>
                  {meetings.map(m => (
                    <Card key={m.title} padding={5}>
                      <HStack gap={4} vAlign="center">
                        <Icon icon={CalendarDaysIcon} size="lg" color="accent" />
                        <VStack gap={1}>
                          <Heading level={3}>{m.title}</Heading>
                          <Text type="body" color="secondary">
                            {m.when}
                          </Text>
                        </VStack>
                      </HStack>
                    </Card>
                  ))}
                </VStack>
              </Grid>

              {/* Pillars */}
              <VStack gap={6}>
                <SectionHeader
                  eyebrow="What we do"
                  title="Faith, community, family and life"
                />
                <Grid columns={{minWidth: 240, repeat: 'fit'}} gap={4}>
                  {pillars.map(p => (
                    <Card key={p.title} padding={5}>
                      <VStack gap={2}>
                        <Heading level={3}>{p.title}</Heading>
                        <Text type="body" color="secondary">
                          {p.body}
                        </Text>
                      </VStack>
                    </Card>
                  ))}
                </Grid>
              </VStack>

              {/* Founder */}
              <Section variant="muted" padding={0}>
                <Grid
                  columns={{minWidth: 360, max: 2, repeat: 'fit'}}
                  gap={0}
                  align="stretch">
                  <AspectRatio ratio={4 / 3} fit="cover">
                    <img
                      src={assets.mcgivney}
                      alt={assets.mcgivneyAlt}
                      {...stylex.props(styles.mcgivneyCrop)}
                    />
                  </AspectRatio>
                  <VStack gap={4} padding={8} vAlign="center">
                    <Text type="supporting" color="secondary" weight="semibold">
                      OUR FOUNDER
                    </Text>
                    <Text type="display-2" as="h2">
                      {founder.name}
                    </Text>
                    <Text type="large" color="secondary">
                      {founder.blurb}
                    </Text>
                    <Link href={founder.url} isExternalLink weight="semibold">
                      Read about our founder on kofc.org
                    </Link>
                  </VStack>
                </Grid>
              </Section>
            </VStack>
          </LayoutContent>
        }
      />
    </Shell>
  );
}
