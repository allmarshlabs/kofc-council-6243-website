// Home: adapted from the Astryx `centered-hero` template (centered headline,
// blurb, paired CTAs over one wide picture), followed by card sections in the
// template's VStack gap rhythm.
import * as stylex from '@stylexjs/stylex';
import { VStack, HStack, Layout, LayoutContent } from '@astryxdesign/core/Layout';
import { Text, Heading } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { AspectRatio } from '@astryxdesign/core/AspectRatio';
import { Center } from '@astryxdesign/core/Center';
import { Section } from '@astryxdesign/core/Section';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { rtlStyles } from '@astryxdesign/core/utils';
import { radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import {
  BookOpenIcon,
  CalendarDaysIcon,
  FlagIcon,
  GiftIcon,
  HandRaisedIcon,
  HeartIcon,
  HomeIcon,
  LinkIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type { PageProps } from '../App';
import {
  assets,
  council,
  founder,
  join,
  meetings,
  meetingsNote,
  pillars,
  principles,
} from '../shared/content';
import { Shell, href } from './Shell';
import { formatLong, nextOf, relative } from './meetings';

const styles = stylex.create({
  // Template frame values, moved from inline style objects to StyleX.
  heroFrame: {
    maxWidth: 1200,
    width: '100%',
    marginInline: 'auto',
    borderRadius: radiusVars['--radius-page'],
    overflow: 'hidden',
  },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  // Official emblem as a seal beside the council's giving note.
  emblem: { width: 200, maxWidth: '60%', height: 'auto', display: 'block' },
});

const PILLAR_ICONS = {
  Faith: BookOpenIcon,
  Community: UserGroupIcon,
  Family: HomeIcon,
  Life: HeartIcon,
} as const;
const PRINCIPLE_ICONS = {
  Charity: GiftIcon,
  Unity: LinkIcon,
  Fraternity: UsersIcon,
  Patriotism: FlagIcon,
} as const;

function SectionHeading({ title, blurb }: { title: string; blurb?: string }) {
  return (
    <VStack gap={2} hAlign="center">
      <Heading level={2} justify="center" textWrap="balance">
        {title}
      </Heading>
      {blurb && (
        <Text type="body" color="secondary" justify="center" textWrap="balance">
          {blurb}
        </Text>
      )}
    </VStack>
  );
}

export default function Home({ current }: PageProps) {
  const knights = nextOf('knights');
  const auxiliary = nextOf('auxiliary');
  const nextMeetings = [
    { meeting: meetings[0], next: knights, color: 'blue' as const },
    { meeting: meetings[1], next: auxiliary, color: 'yellow' as const },
  ];

  return (
    <Shell current={current}>
      <Layout
        height="auto"
        content={
          <LayoutContent padding={6} isScrollable={false}>
            <VStack gap={10}>
              {/* Hero */}
              <VStack gap={6} hAlign="center">
                <VStack gap={3} hAlign="center">
                  <Badge variant="yellow" label={`Knights of Columbus · Council ${council.number}`} />
                  <Heading level={1} type="display-2" justify="center" textWrap="balance">
                    {council.name}
                  </Heading>
                  <Text type="body" color="secondary" justify="center" textWrap="balance">
                    {council.intro}
                  </Text>
                </VStack>
                <HStack gap={3} wrap="wrap" hAlign="center">
                  <Button
                    label="Become a Knight"
                    variant="primary"
                    href={href('join')}
                    endContent={
                      <Icon icon={ArrowRightIcon} size="sm" color="inherit" xstyle={rtlStyles.mirror} />
                    }
                  />
                  <Button label="See the calendar" variant="secondary" href={href('calendar')} />
                </HStack>
              </VStack>
              <Section variant="transparent" padding={0}>
                <VStack gap={2}>
                  <AspectRatio ratio={16 / 9} xstyle={styles.heroFrame}>
                    <img {...stylex.props(styles.heroImage)} src={assets.mcgivney} alt={assets.mcgivneyAlt} />
                  </AspectRatio>
                  <Text type="supporting" color="secondary" justify="center">
                    {founder.name}, founder of the Knights of Columbus
                  </Text>
                </VStack>
              </Section>

              {/* Next meetings */}
              <VStack gap={6}>
                <SectionHeading title="Next meetings" blurb={meetingsNote} />
                <Grid columns={{ minWidth: 280, max: 2 }} gap={4}>
                  {nextMeetings.map(({ meeting, next, color }) => (
                    <Card key={meeting.title} elevation="low">
                      <VStack gap={4}>
                        <HStack gap={3} vAlign="center" hAlign="between" wrap="wrap">
                          <HStack gap={2} vAlign="center">
                            <Icon icon={CalendarDaysIcon} size="lg" color="accent" />
                            <Heading level={3}>{meeting.title}</Heading>
                          </HStack>
                          <Badge variant={color} label={relative(next.date)} />
                        </HStack>
                        <VStack gap={1}>
                          <Text type="large" weight="semibold">
                            {formatLong(next.date)}
                          </Text>
                          <Text type="supporting" color="secondary">
                            {meeting.when}
                          </Text>
                        </VStack>
                        <HStack>
                          <Button label="See all dates" variant="ghost" size="sm" href={href('calendar')} />
                        </HStack>
                      </VStack>
                    </Card>
                  ))}
                </Grid>
              </VStack>

              {/* Pillars */}
              <VStack gap={6}>
                <SectionHeading title="How we serve" />
                <Grid columns={{ minWidth: 240, max: 4 }} gap={4}>
                  {pillars.map((pillar) => (
                    <Card key={pillar.title}>
                      <VStack gap={3}>
                        <Icon
                          icon={PILLAR_ICONS[pillar.title as keyof typeof PILLAR_ICONS]}
                          size="lg"
                          color="accent"
                        />
                        <VStack gap={1}>
                          <Heading level={3}>{pillar.title}</Heading>
                          <Text type="supporting" color="secondary">
                            {pillar.body}
                          </Text>
                        </VStack>
                      </VStack>
                    </Card>
                  ))}
                </Grid>
              </VStack>

              {/* Giving note */}
              <Card variant="yellow" padding={6}>
                <Grid columns={{ minWidth: 280, max: 2 }} gap={6} align="center">
                  <VStack gap={3}>
                    <Heading level={2}>More than $10,000 a year</Heading>
                    <Text type="body">{council.givingNote}</Text>
                  </VStack>
                  <Center axis="both">
                    <img
                      {...stylex.props(styles.emblem)}
                      src={assets.emblem}
                      alt={`Knights of Columbus emblem, ${council.fullName}`}
                    />
                  </Center>
                </Grid>
              </Card>

              {/* Principles */}
              <VStack gap={6}>
                <SectionHeading title="Our principles" />
                <HStack gap={3} wrap="wrap" hAlign="center">
                  {principles.map((p) => (
                    <Token
                      key={p}
                      size="lg"
                      color="blue"
                      label={p}
                      icon={<Icon icon={PRINCIPLE_ICONS[p]} size="sm" />}
                    />
                  ))}
                </HStack>
              </VStack>

              {/* Founder */}
              <Card padding={6}>
                <VStack gap={3}>
                  <Text type="label" color="secondary">
                    Our founder
                  </Text>
                  <Heading level={2}>{founder.name}</Heading>
                  <Text type="body" color="secondary">
                    {founder.blurb}
                  </Text>
                  <Link href={founder.url} isExternalLink>
                    Learn more about Father McGivney
                  </Link>
                </VStack>
              </Card>

              {/* Join CTA */}
              <Banner
                status="info"
                icon={<Icon icon={HandRaisedIcon} size="md" />}
                title="Ready to join us?"
                description={join.eligibility}
                collapsible={false}
                endContent={
                  <Button label="Become a Knight" variant="primary" size="sm" href={href('join')} />
                }
              />
            </VStack>
          </LayoutContent>
        }
      />
    </Shell>
  );
}
