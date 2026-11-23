// Become a Knight — adapted from the Astryx `form-wizard-vertical` page
// template, used here as a read-only step guide rather than a form.
// Kept: Layout padding 4 with a divided header, a 300px start rail holding a
// vertical Stepper (label + one-sentence description per step), a 300px
// complementary end panel, a 640px centred content measure, and a divided
// footer with Back / Continue. Kept the template's three responsive tiers:
// the guidance panel drops first (its content folds into the column), then
// the rail rotates into a horizontal Stepper in the header.
// Removed: every form field, validation and the review step — joining
// happens on kofc.org, so each step explains what to do and links there.

import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
} from '@astryxdesign/core/Layout';
import { Link } from '@astryxdesign/core/Link';
import { List, ListItem } from '@astryxdesign/core/List';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { Badge } from '@astryxdesign/core/Badge';
import { HStack, StackItem, VStack } from '@astryxdesign/core/Stack';
import { Step, Stepper } from '@astryxdesign/core/Stepper';
import { Heading, Text } from '@astryxdesign/core/Text';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { PageProps } from '../../App';
import { assets, council, join, meetings, meetingsNote } from '../../shared/content';
import { Shell, href } from './Shell';
import { formatDay, upcomingMeetings } from './schedule';

const MEASURE = 640;
const PANEL_WIDTH = 300;
const LAYOUT_INSET = 16; // the Layout's padding={4}, which every slot applies

const styles = stylex.create({
  // Template: with only the rail up, lean the footer row under the column.
  footerLean: { marginInlineStart: PANEL_WIDTH - LAYOUT_INSET },
  seal: { width: 72, height: 'auto', display: 'block' },
});

export default function Join({ current }: PageProps) {
  const hasGuidance = useMediaQuery('(min-width: 1320px)');
  const hasRail = useMediaQuery('(min-width: 1000px)');
  const [step, setStep] = useState(0);
  const steps = join.steps;
  const isLastStep = step === steps.length - 1;
  const nextKnights = upcomingMeetings(2)
    .filter((m) => m.group === 'Knights')
    .slice(0, 2);

  const stepNodes = (hasDescriptions: boolean) =>
    steps.map((s, i) => (
      <Step
        key={s.title}
        step={i}
        label={s.title}
        description={hasDescriptions ? s.body : undefined}
        indicator="number"
      />
    ));

  const rail = (
    <Stepper activeStep={step} orientation="vertical" onStepClick={setStep} label="Steps to join">
      {stepNodes(true)}
    </Stepper>
  );

  const headerStepper = (
    <Stepper activeStep={step} orientation="horizontal" onStepClick={setStep} label="Steps to join">
      {stepNodes(false)}
    </Stepper>
  );

  // Guidance panel: who can join, and the other ways to take part.
  const helpPanel = (
    <VStack gap={6}>
      <VStack gap={3}>
        <Heading level={5} accessibilityLevel={2}>
          Who can join
        </Heading>
        <Text type="body" color="secondary">
          {join.eligibility}
        </Text>
      </VStack>
      <Divider />
      <VStack gap={3}>
        <Heading level={5} accessibilityLevel={2}>
          {join.volunteerTitle}
        </Heading>
        <Text type="body" color="secondary">
          {join.volunteerBody}
        </Text>
        <List density="compact" edge="flush">
          <ListItem
            href={`mailto:${council.email}`}
            startContent={<Icon icon={EnvelopeIcon} size="sm" color="secondary" />}
            label={<Text type="body">{council.email}</Text>}
          />
          <ListItem
            href={council.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            startContent={<Icon icon={UserGroupIcon} size="sm" color="secondary" />}
            label={<Text type="body">Ladies Auxiliary on Facebook</Text>}
            endContent={<Icon icon={ArrowTopRightOnSquareIcon} size="sm" color="secondary" />}
          />
        </List>
      </VStack>
    </VStack>
  );

  return (
    <Shell current={current}>
      <Layout
        height="auto"
        padding={4}
        header={
          <LayoutHeader hasDivider>
            <VStack gap={4}>
              <HStack wrap="wrap" gap={3} vAlign="center">
                <StackItem size="fill">
                  <VStack gap={1}>
                    <Text type="label" color="secondary">
                      Council {council.number} · {council.name}
                    </Text>
                    <Heading level={1}>{join.headline}</Heading>
                  </VStack>
                </StackItem>
              </HStack>
              {!hasRail && headerStepper}
            </VStack>
          </LayoutHeader>
        }
        start={
          hasRail ? (
            <LayoutPanel width={PANEL_WIDTH} isScrollable={false}>
              {rail}
            </LayoutPanel>
          ) : undefined
        }
        end={
          !hasGuidance ? undefined : (
            <LayoutPanel
              width={PANEL_WIDTH}
              isScrollable={false}
              role="complementary"
              label="Who can join and other ways to help"
            >
              {helpPanel}
            </LayoutPanel>
          )
        }
        content={
          <LayoutContent isScrollable={false}>
            <Center axis="horizontal">
              <VStack gap={6} width="100%" maxWidth={MEASURE}>
                <VStack gap={1}>
                  <Text type="label" color="accent">
                    Step {step + 1} of {steps.length}
                  </Text>
                  <Heading level={2}>{steps[step].title}</Heading>
                  <Text type="large" weight="normal" color="secondary">
                    {steps[step].body}
                  </Text>
                </VStack>

                {step === 0 && (
                  <Card variant="muted" padding={6}>
                    <VStack gap={4}>
                      <Text type="label" color="secondary">
                        {council.joinUrl.replace(/^https:\/\/www\./, '')}
                      </Text>
                      <HStack>
                        <Button
                          label="Start the online form at kofc.org"
                          variant="primary"
                          size="lg"
                          href={council.joinUrl}
                          target="_blank"
                          endContent={<Icon icon={ArrowTopRightOnSquareIcon} size="sm" />}
                        />
                      </HStack>
                    </VStack>
                  </Card>
                )}

                {step === 1 && (
                  <Card padding={6} elevation="low">
                    <HStack gap={6} vAlign="center" wrap="wrap">
                      <img src={assets.emblem} alt="" {...stylex.props(styles.seal)} />
                      <StackItem size="fill">
                        <VStack gap={1}>
                          <Text type="label" color="secondary">
                            Preferred council number
                          </Text>
                          <Text type="display-1" hasTabularNumbers>
                            {council.number}
                          </Text>
                          <Text type="body" color="secondary">
                            {council.name} · {council.location}
                          </Text>
                        </VStack>
                      </StackItem>
                    </HStack>
                  </Card>
                )}

                {step === 2 && (
                  <VStack gap={4}>
                    <MetadataList>
                      <MetadataListItem
                        label="When"
                        icon={<Icon icon={CalendarDaysIcon} size="sm" />}
                      >
                        {meetings[0].when}
                      </MetadataListItem>
                      <MetadataListItem label="Where" icon={<Icon icon={MapPinIcon} size="sm" />}>
                        {council.hallName}, {council.address}
                      </MetadataListItem>
                    </MetadataList>
                    <Divider />
                    <VStack gap={2}>
                      <Text type="label" color="secondary">
                        Next meetings
                      </Text>
                      <List hasDividers edge="flush">
                        {nextKnights.map((m) => (
                          <ListItem
                            key={m.id}
                            label={
                              <Text type="body" weight="bold">
                                {formatDay(m.date)}
                              </Text>
                            }
                            endContent={<Badge variant="blue" label={m.rule} />}
                          />
                        ))}
                      </List>
                      <Text type="supporting" color="secondary">
                        {meetingsNote}{' '}
                        <Link href={`mailto:${council.email}`} type="supporting">
                          {council.email}
                        </Link>
                      </Text>
                    </VStack>
                    <HStack>
                      <Button
                        label="See the full calendar"
                        variant="secondary"
                        href={href('calendar')}
                      />
                    </HStack>
                  </VStack>
                )}

                {/* The guidance panel folds into the column when there is no room for it. */}
                {!hasGuidance && (
                  <>
                    <Divider />
                    {helpPanel}
                  </>
                )}
              </VStack>
            </Center>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <Center
              axis="horizontal"
              xstyle={hasRail && !hasGuidance ? styles.footerLean : undefined}
            >
              <HStack gap={3} vAlign="center" width="100%" maxWidth={MEASURE}>
                <Button
                  label="Back"
                  variant="secondary"
                  isDisabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                />
                <StackItem size="fill" />
                {isLastStep ? (
                  <Button
                    label="Join online"
                    variant="primary"
                    href={council.joinUrl}
                    target="_blank"
                  />
                ) : (
                  <Button
                    label="Continue"
                    variant="primary"
                    onClick={() => setStep((s) => s + 1)}
                  />
                )}
              </HStack>
            </Center>
          </LayoutFooter>
        }
      />
    </Shell>
  );
}
