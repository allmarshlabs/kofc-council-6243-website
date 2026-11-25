// Join — adapted from the Astryx `course-detail` page template.
// Kept: Layout/LayoutContent (contentWidth 1200, padding 6), the 2-up fit Grid
// (minWidth 320, gap 6), the pitch column of padded Sections under a
// SectionHeader, and the sticky enrollment rail Card. Replaced: course head →
// join head; about → why join + principles; syllabus → join.steps; instructor
// → volunteer / Ladies Auxiliary; reviews → the four pillars; FAQ → questions
// answered from content.ts; rail → eligibility + "Join online". Removed:
// pricing, ratings, sliders, cohort pickers and demo toasts.

import * as stylex from '@stylexjs/stylex';
import type {ReactNode} from 'react';
import {
  Layout,
  LayoutContent,
  Section,
  VStack,
  HStack,
  StackItem,
} from '@astryxdesign/core/Layout';
import {Grid} from '@astryxdesign/core/Grid';
import {Text, Heading} from '@astryxdesign/core/Text';
import {Card} from '@astryxdesign/core/Card';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {Badge} from '@astryxdesign/core/Badge';
import {Divider} from '@astryxdesign/core/Divider';
import {Link} from '@astryxdesign/core/Link';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Collapsible, CollapsibleGroup} from '@astryxdesign/core/Collapsible';
import {rtlStyles} from '@astryxdesign/core/utils';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {
  CheckIcon,
  ArrowRightIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  EnvelopeIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';
import type {PageProps} from '../App';
import {
  assets,
  council,
  join,
  meetings,
  meetingsNote,
  pillars,
  principles,
} from '../shared/content';
import {Shell, useHeritage} from './Shell';

// Custom CSS limited to what Astryx components can't express today:
// the sticky enroll rail (no sticky prop on layout primitives) and image
// corner clipping / crop focus.
const styles = stylex.create({
  stickyRail: {
    position: 'sticky',
    top: 'var(--spacing-8)',
    alignSelf: 'start',
  },
  poster: {
    borderRadius: 'var(--radius-container)',
    overflow: 'hidden',
  },
  posterCrop: {objectPosition: '50% 35%'},
});

const FAQS = [
  {q: 'Who can join?', a: join.eligibility},
  {
    q: 'Which council should I choose?',
    a: join.steps[1].body,
  },
  ...meetings.map(m => ({
    q: `When are the ${m.title.replace('’ meetings', '').replace(' meetings', '')} meetings?`,
    a: `${m.when}. ${meetingsNote}`,
  })),
];

function SectionHeader({title, action}: {title: string; action?: ReactNode}) {
  return (
    <HStack gap={2} vAlign="center" hAlign="between" wrap="wrap">
      <Heading level={2}>{title}</Heading>
      {action}
    </HStack>
  );
}

// ─── Join head: title, poster, facts ────────────────────────────────────────
function JoinHead() {
  return (
    <VStack gap={4}>
      <VStack gap={2}>
        <HStack gap={2} vAlign="center">
          <Badge variant="yellow" label={`Council ${council.number}`} />
          <Badge label={council.location} />
        </HStack>
        <Text type="display-1" as="h1">
          {join.headline}
        </Text>
        <Text type="large" color="secondary">
          {council.intro}
        </Text>
      </VStack>
      <AspectRatio ratio={16 / 9} fit="cover" xstyle={styles.poster}>
        <img
          src={assets.rosary}
          alt="A Knight in a Knights of Columbus sweatshirt praying the rosary"
          {...stylex.props(styles.posterCrop)}
        />
      </AspectRatio>
      <HStack gap={5} vAlign="center" wrap="wrap">
        <HStack gap={1} vAlign="center">
          <Icon icon={HashtagIcon} size="sm" />
          <Text type="body" color="secondary">
            Council {council.number}
          </Text>
        </HStack>
        <HStack gap={1} vAlign="center">
          <Icon icon={CalendarDaysIcon} size="sm" />
          <Text type="body" color="secondary">
            Monday meetings
          </Text>
        </HStack>
        <HStack gap={1} vAlign="center">
          <Icon icon={MapPinIcon} size="sm" />
          <Text type="body" color="secondary">
            {council.location}
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
}

// ─── Why join (was: About) ──────────────────────────────────────────────────
function WhySection() {
  return (
    <Section padding={6}>
      <VStack gap={4}>
        <SectionHeader title="Why join" />
        <Text type="body">{council.givingNote}</Text>
        <VStack gap={2}>
          <Text type="label">Our principles</Text>
          <HStack gap={2} wrap="wrap">
            {principles.map(p => (
              <Badge key={p} label={p} />
            ))}
          </HStack>
        </VStack>
      </VStack>
    </Section>
  );
}

// ─── Steps (was: Syllabus) ──────────────────────────────────────────────────
function StepsSection() {
  return (
    <Section padding={6}>
      <VStack gap={4}>
        <SectionHeader
          title="How to join"
          action={
            <Text type="supporting" color="secondary">
              {join.steps.length} steps
            </Text>
          }
        />
        <VStack gap={4}>
          {join.steps.map((step, i) => (
            <HStack key={step.title} gap={4} vAlign="start">
              <Text type="display-3" color="accent">
                {String(i + 1)}
              </Text>
              <StackItem size="fill">
                <VStack gap={1}>
                  <Text type="large" weight="bold">
                    {step.title}
                  </Text>
                  <Text type="body" color="secondary">
                    {step.body}
                  </Text>
                </VStack>
              </StackItem>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Section>
  );
}

// ─── Pillars (was: Reviews) ─────────────────────────────────────────────────
function PillarsSection() {
  return (
    <Section padding={6}>
      <VStack gap={4}>
        <SectionHeader title="What you'll be part of" />
        <Grid columns={{minWidth: 240, max: 2, repeat: 'fit'}} gap={4}>
          {pillars.map(p => (
            <Card key={p.title} padding={4}>
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
    </Section>
  );
}

// ─── Volunteer / Auxiliary (was: Instructor) ────────────────────────────────
function VolunteerSection() {
  return (
    <Section padding={6}>
      <VStack gap={4}>
        <SectionHeader title={join.volunteerTitle} />
        <Card padding={5}>
          <VStack gap={4}>
            <AspectRatio ratio={3 / 2} fit="cover" xstyle={styles.poster}>
              <img
                src={assets.volunteers}
                alt="Volunteers sorting boxes of donations"
              />
            </AspectRatio>
            <Text type="body">{join.volunteerBody}</Text>
            <HStack gap={2} wrap="wrap">
              <Button
                label="Email the council"
                href={`mailto:${council.email}`}
                icon={<Icon icon={EnvelopeIcon} />}
              />
              <Button
                label="Facebook group"
                variant="ghost"
                href={council.facebookUrl}
                target="_blank"
                icon={<Icon icon={UserGroupIcon} />}
              />
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </Section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
function FaqSection() {
  return (
    <Section padding={6}>
      <VStack gap={4}>
        <SectionHeader title="Common questions" />
        <CollapsibleGroup type="multiple">
          {FAQS.map(faq => (
            <Collapsible
              key={faq.q}
              value={faq.q}
              defaultIsOpen={false}
              trigger={
                <Text type="large" weight="bold">
                  {faq.q}
                </Text>
              }>
              <Text type="body">{faq.a}</Text>
            </Collapsible>
          ))}
        </CollapsibleGroup>
      </VStack>
    </Section>
  );
}

// ─── Join rail (was: Enroll rail) ───────────────────────────────────────────
function JoinRail() {
  const {href} = useHeritage();
  return (
    <Card padding={5}>
      <VStack gap={4}>
        <VStack gap={1}>
          <Text type="label" color="secondary">
            Your council number
          </Text>
          <Text type="display-2">{council.number}</Text>
          <Text type="supporting" color="secondary">
            Enter {council.number} as your council when you join online.
          </Text>
        </VStack>
        <VStack hAlign="stretch" gap={2}>
          <Button
            label="Join online"
            variant="primary"
            size="lg"
            href={council.joinUrl}
            target="_blank"
            icon={
              <Icon icon={ArrowRightIcon} size="sm" xstyle={rtlStyles.mirror} />
            }
          />
          <Button label="Ask us a question" size="lg" href={href('contact')} />
        </VStack>
        <Divider />
        <VStack gap={2}>
          <Text type="label">Who can join</Text>
          <HStack gap={2} vAlign="start">
            <Icon icon={CheckIcon} size="sm" />
            <Text type="body" color="secondary">
              {join.eligibility}
            </Text>
          </HStack>
        </VStack>
        <Divider />
        <VStack gap={2}>
          <Text type="label">Meetings</Text>
          {meetings.map(m => (
            <HStack key={m.title} gap={2} vAlign="start">
              <Icon icon={CalendarDaysIcon} size="sm" />
              <VStack gap={0}>
                <Text type="body">{m.title}</Text>
                <Text type="supporting" color="secondary">
                  {m.when}
                </Text>
              </VStack>
            </HStack>
          ))}
          <Link href={href('calendar')} type="supporting">
            See upcoming dates
          </Link>
        </VStack>
      </VStack>
    </Card>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function JoinPage({current}: PageProps) {
  // The two columns stack below ~664px; there the rail follows the head so
  // "Join online" isn't buried under the whole pitch.
  const isStacked = useMediaQuery('(max-width: 720px)', true);
  return (
    <Shell current={current}>
      <Layout
        height="auto"
        contentWidth={1200}
        content={
          <LayoutContent padding={6} isScrollable={false}>
            <Grid columns={{minWidth: 320, max: 2, repeat: 'fit'}} gap={6}>
              <VStack gap={4}>
                <JoinHead />
                {isStacked && <JoinRail />}
                <WhySection />
                <StepsSection />
                <VolunteerSection />
                <PillarsSection />
                <FaqSection />
              </VStack>
              {!isStacked && (
                <VStack gap={4} xstyle={styles.stickyRail}>
                  <JoinRail />
                </VStack>
              )}
            </Grid>
          </LayoutContent>
        }
      />
    </Shell>
  );
}
