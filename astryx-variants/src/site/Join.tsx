// Join: adapted from the Astryx `documentation-technical` template — numbered
// sequential steps, a prerequisite callout card, an onward-links callout, and
// the "On this page" Outline rail. Code blocks and AI-prompt card removed.
import * as stylex from '@stylexjs/stylex';
import { Heading, Text } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { HStack, VStack, StackItem } from '@astryxdesign/core/Stack';
import { Layout, LayoutContent, LayoutPanel } from '@astryxdesign/core/Layout';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { Outline, type OutlineItem } from '@astryxdesign/core/Outline';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { spacingVars } from '@astryxdesign/core/theme/tokens.stylex';
import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  HandRaisedIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import type { PageProps } from '../App';
import { council, join } from '../shared/content';
import { Shell } from './Shell';

const OUTLINE_ITEMS: OutlineItem[] = [
  { id: 'who-can-join', label: 'Who can join', level: 2 },
  { id: 'three-steps', label: 'Three steps to join', level: 2 },
  { id: 'get-involved', label: 'Get involved', level: 2 },
];

const styles = stylex.create({
  // Template's sticky outline rail (was an inline style object).
  outlinePanel: { position: 'sticky', top: 24, alignSelf: 'start', paddingBlockStart: 120 },
  stepNumber: { minWidth: spacingVars['--spacing-8'] },
});

export default function Join({ current }: PageProps) {
  const isMobile = useMediaQuery('(max-width: 768px)', true);

  return (
    <Shell current={current}>
      <Layout
        height="auto"
        contentWidth={960}
        end={
          isMobile ? undefined : (
            <LayoutPanel
              isScrollable={false}
              label="On this page"
              role="complementary"
              xstyle={styles.outlinePanel}
            >
              <Outline items={OUTLINE_ITEMS} />
            </LayoutPanel>
          )
        }
        content={
          <LayoutContent isScrollable={false} padding={8}>
            <VStack gap={8}>
              <VStack gap={2}>
                <Heading level={1} type="display-2">
                  {join.headline}
                </Heading>
                <Text type="large" color="secondary">
                  Join {council.fullName} at {council.name}, {council.location}.
                </Text>
                {isMobile && <Outline items={OUTLINE_ITEMS} />}
              </VStack>

              {/* Prerequisite callout */}
              <Card variant="yellow">
                <VStack gap={3}>
                  <HStack wrap="wrap" gap={2} vAlign="center">
                    <StackItem size="fill">
                      <HStack gap={2} vAlign="center">
                        <Icon icon={CheckBadgeIcon} size="sm" color="secondary" />
                        <Heading id="who-can-join" level={2}>
                          Who can join
                        </Heading>
                      </HStack>
                    </StackItem>
                  </HStack>
                  <Text type="body">{join.eligibility}</Text>
                </VStack>
              </Card>

              <Divider />

              {/* Numbered steps */}
              <VStack gap={4}>
                <Heading id="three-steps" level={2}>
                  Three steps to join
                </Heading>
                {join.steps.map((step, i) => (
                  <HStack key={step.title} gap={3} vAlign="start">
                    <StackItem xstyle={styles.stepNumber}>
                      <Badge variant="blue" label={i + 1} />
                    </StackItem>
                    <VStack gap={2}>
                      <Text type="body" weight="bold">
                        Step {i + 1}: {step.title}
                      </Text>
                      <Text type="body" color="secondary">
                        {step.body}
                      </Text>
                      {i === 0 && (
                        <HStack>
                          <Button
                            label="Join online"
                            variant="primary"
                            href={council.joinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            endContent={<Icon icon={ArrowTopRightOnSquareIcon} size="sm" color="inherit" />}
                          />
                        </HStack>
                      )}
                      {i === 1 && (
                        <HStack gap={2} vAlign="center">
                          <Text type="supporting" color="secondary">
                            Council number
                          </Text>
                          <Badge variant="yellow" label={council.number} />
                        </HStack>
                      )}
                    </VStack>
                  </HStack>
                ))}
              </VStack>

              <Divider />

              {/* Onward links callout */}
              <VStack gap={4}>
                <Heading id="get-involved" level={2}>
                  Get involved
                </Heading>
                <Card>
                  <VStack gap={3}>
                    <HStack gap={2} vAlign="center">
                      <Icon icon={HandRaisedIcon} size="sm" color="accent" />
                      <Text type="body" weight="semibold">
                        {join.volunteerTitle}
                      </Text>
                    </HStack>
                    <Text type="body" color="secondary">
                      {join.volunteerBody}
                    </Text>
                    <HStack gap={4} wrap="wrap">
                      <HStack gap={2} vAlign="center">
                        <Icon icon={EnvelopeIcon} size="sm" color="secondary" />
                        <Link href={`mailto:${council.email}`}>{council.email}</Link>
                      </HStack>
                      <HStack gap={2} vAlign="center">
                        <Icon icon={UserGroupIcon} size="sm" color="secondary" />
                        <Link href={council.facebookUrl} isExternalLink>
                          Our Facebook group
                        </Link>
                      </HStack>
                    </HStack>
                  </VStack>
                </Card>
              </VStack>
            </VStack>
          </LayoutContent>
        }
      />
    </Shell>
  );
}
