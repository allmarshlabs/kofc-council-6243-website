// Calendar — adapted from the Astryx `detail-page` page template
// (`astryx build "council meeting calendar page"` matched no page template,
// so this single-record detail layout was the closest real fit).
// Kept: Layout with divided LayoutHeader (h1 + bulleted metadata row +
// actions that drop below on narrow screens), stacked Sections in
// LayoutContent, and the 320px `end` LayoutPanel that folds under the content
// below 1024px. Replaced: order line items → the meeting rhythm; activity
// timeline → computed upcoming dates; invoice → the Google Calendar embed;
// side-panel collapsibles → where-we-meet details. Removed: tabs, panel toggle,
// reactions, demo toasts and dialogs.

import * as stylex from '@stylexjs/stylex';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutPanel,
  VStack,
  HStack,
  StackItem,
  Card,
  Section,
} from '@astryxdesign/core/Layout';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {List, ListItem} from '@astryxdesign/core/List';
import {MetadataList, MetadataListItem} from '@astryxdesign/core/MetadataList';
import {Banner} from '@astryxdesign/core/Banner';
import {Icon} from '@astryxdesign/core/Icon';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {
  CalendarDaysIcon,
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import type {PageProps} from '../../App';
import {council, meetings, meetingsNote} from '../../shared/content';
import {Shell} from './Shell';
import {upcomingMeetings, formatLong} from './schedule';

const styles = stylex.create({
  frame: {
    borderRadius: 'var(--radius-container)',
    overflow: 'hidden',
    backgroundColor: 'var(--color-background-card)',
  },
  iframe: {border: 0, width: '100%', height: '100%'},
});

const calendarPage = council.calendarEmbed.replace('/embed?', '/r?');
const mailto = `mailto:${council.email}?subject=${encodeURIComponent(
  'Council 6243 meeting time',
)}`;


// ─── Page Header ────────────────────────────────────────────────────────────
function PageHeader({isNarrow}: {isNarrow: boolean}) {
  const actions = (
    <>
      <Button
        label="Open Google Calendar"
        variant="primary"
        href={calendarPage}
        target="_blank"
        icon={<Icon icon={ArrowTopRightOnSquareIcon} />}
      />
      <Button
        label="Email to confirm"
        variant="secondary"
        href={mailto}
        icon={<Icon icon={EnvelopeIcon} />}
      />
    </>
  );
  return (
    <LayoutHeader hasDivider padding={4}>
      <VStack gap={3}>
        <HStack gap={4} vAlign="start">
          <StackItem size="fill">
            <VStack gap={1}>
              <Text type="supporting" color="secondary" weight="semibold">
                {`COUNCIL ${council.number} · ${council.location.toUpperCase()}`}
              </Text>
              <Text type="display-2" as="h1">
                Council calendar
              </Text>
              {/* The schedule is explained once, in Meeting rhythm below. */}
            </VStack>
          </StackItem>
          {!isNarrow && <HStack gap={2}>{actions}</HStack>}
        </HStack>
        {isNarrow && (
          <HStack gap={2} wrap="wrap">
            {actions}
          </HStack>
        )}
      </VStack>
    </LayoutHeader>
  );
}

// ─── Meeting rhythm (was: Items) ────────────────────────────────────────────
function RhythmSection() {
  return (
    <Section>
      <VStack gap={4}>
        <Heading level={2}>Meeting rhythm</Heading>
        <List density="spacious" edge="outset" hasDividers>
          {meetings.map(m => (
            <ListItem
              key={m.title}
              label={<Text type="large" weight="semibold">{m.title}</Text>}
              description={
                <Text type="body" color="secondary">
                  {m.when}
                </Text>
              }
              startContent={
                <Icon icon={CalendarDaysIcon} size="lg" color="accent" />
              }
            />
          ))}
        </List>
        <Banner status="info" title={meetingsNote} />
      </VStack>
    </Section>
  );
}

// ─── Upcoming dates (was: Timeline) ─────────────────────────────────────────
function UpcomingSection() {
  const upcoming = upcomingMeetings(6);
  return (
    <Section>
      <VStack gap={4}>
        <Heading level={2}>Upcoming meetings</Heading>
        <VStack gap={3}>
          {upcoming.map(m => (
            <Card
              key={m.date.toISOString() + m.group}
              variant="muted"
              padding={3}>
              <HStack gap={3} vAlign="center" wrap="wrap">
                <StackItem size="fill">
                  <Text type="body" weight="bold">
                    {formatLong(m.date)}
                  </Text>
                </StackItem>
                <Badge
                  variant={m.group === 'Knights' ? 'blue' : 'yellow'}
                  label={m.group}
                />
              </HStack>
            </Card>
          ))}
        </VStack>
      </VStack>
    </Section>
  );
}

// ─── Google Calendar (was: Invoice) ─────────────────────────────────────────
function EmbedSection({isNarrow}: {isNarrow: boolean}) {
  return (
    <Section>
      <VStack gap={4}>
        <HStack vAlign="center" gap={2} wrap="wrap">
          <StackItem size="fill">
            <Heading level={2}>Council Google Calendar</Heading>
          </StackItem>
          <Link href={calendarPage} isExternalLink>
            Open in Google Calendar
          </Link>
        </HStack>
        <AspectRatio ratio={isNarrow ? 3 / 4 : 4 / 3} xstyle={styles.frame}>
          <iframe
            src={council.calendarEmbed}
            title="Knights of Columbus Council 6243 Google Calendar"
            loading="lazy"
            {...stylex.props(styles.iframe)}
          />
        </AspectRatio>
      </VStack>
    </Section>
  );
}

// ─── Panel (was: Notes / Customer) ──────────────────────────────────────────
function PanelContent({sectionLevel = 2}: {sectionLevel?: 2 | 3}) {
  return (
    <VStack gap={4}>
      <Heading level={4} accessibilityLevel={sectionLevel}>
        Where we meet
      </Heading>
      <MetadataList label={{position: 'top'}}>
        <MetadataListItem label="Parish">{council.parishName}</MetadataListItem>
        <MetadataListItem
          label="Address"
          icon={<Icon icon={MapPinIcon} size="sm" />}>
          {council.address}
        </MetadataListItem>
        <MetadataListItem label="Confirm with">
          <Link href={mailto}>{council.email}</Link>
        </MetadataListItem>
      </MetadataList>
      <Link href={council.parishUrl} isExternalLink>
        Visit our parish
      </Link>
    </VStack>
  );
}

function RightPanel() {
  return (
    <LayoutPanel width={320} padding={4} role="complementary">
      <PanelContent />
    </LayoutPanel>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function CalendarPage({current}: PageProps) {
  // Mobile first: narrow layout until script confirms a wide screen.
  const isNarrow = useMediaQuery('(max-width: 1024px)', true);

  return (
    <Shell current={current}>
      <Layout
        height="auto"
        contentWidth={1000}
        defaultHasDividers
        header={<PageHeader isNarrow={isNarrow} />}
        content={
          <LayoutContent isScrollable={false}>
            <VStack gap={4}>
              <RhythmSection />
              <UpcomingSection />
              <EmbedSection isNarrow={isNarrow} />
              {isNarrow && (
                <VStack gap={4}>
                  <PanelContent sectionLevel={2} />
                </VStack>
              )}
            </VStack>
          </LayoutContent>
        }
        end={!isNarrow ? <RightPanel /> : undefined}
      />
    </Shell>
  );
}
