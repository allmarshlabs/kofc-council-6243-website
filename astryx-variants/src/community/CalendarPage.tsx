// Calendar: adapted from the Astryx `settings` template (what `astryx build
// "community events calendar page"` returned): a Layout with a divided header
// and sections stacked in a {minWidth: 320, max: 3} Grid at gap 10, separated
// by Dividers. Search, side nav and form fields are replaced by the meeting
// calendar, the upcoming-dates list and the Google Calendar embed.
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { VStack, HStack, StackItem, Layout, LayoutContent, LayoutHeader } from '@astryxdesign/core/Layout';
import { Grid } from '@astryxdesign/core/Grid';
import { List, ListItem } from '@astryxdesign/core/List';
import { Text, Heading } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Divider } from '@astryxdesign/core/Divider';
import { Card } from '@astryxdesign/core/Card';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Icon } from '@astryxdesign/core/Icon';
import { Link } from '@astryxdesign/core/Link';
import { Calendar, type ISODateString } from '@astryxdesign/core/Calendar';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { ArrowTopRightOnSquareIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import type { PageProps } from '../App';
import { council, meetings, meetingsNote } from '../shared/content';
import { Shell } from './Shell';
import {
  formatLong,
  formatShort,
  isMeetingDay,
  meetingKind,
  relative,
  startOfToday,
  toISO,
  upcomingMeetings,
} from './meetings';

const styles = stylex.create({
  embed: {
    display: 'block',
    width: '100%',
    height: 640,
    borderWidth: 0,
    borderRadius: radiusVars['--radius-container'],
  },
  embedMobile: { height: 520 },
});

const KIND_BADGE = { knights: 'blue', auxiliary: 'yellow' } as const;

export default function CalendarPage({ current }: PageProps) {
  const isNarrow = useMediaQuery('(max-width: 768px)');
  const today = startOfToday();
  const upcoming = upcomingMeetings(8, today);
  const [selected, setSelected] = useState<ISODateString>(upcoming[0].iso as ISODateString);
  const [focus, setFocus] = useState<ISODateString>(upcoming[0].iso as ISODateString);
  const select = (iso: string) => {
    setSelected(iso as ISODateString);
    setFocus(iso as ISODateString);
  };
  const selectedDate = new Date(`${selected}T00:00:00`);
  const selectedKind = meetingKind(selectedDate);
  // Agenda view reads far better than a month grid on a phone.
  const embedSrc = isNarrow ? `${council.calendarEmbed}&mode=AGENDA` : council.calendarEmbed;
  const openUrl = council.calendarEmbed;

  return (
    <Shell current={current}>
      <Layout
        height="auto"
        contentWidth={1440}
        header={
          <LayoutHeader hasDivider>
            <HStack vAlign="center" wrap="wrap" gap={2}>
              <StackItem size="fill">
                <Heading level={1}>Calendar</Heading>
              </StackItem>
              <Button
                label="Open Google Calendar"
                variant="secondary"
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                endContent={<Icon icon={ArrowTopRightOnSquareIcon} size="sm" color="inherit" />}
              />
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent padding={4} isScrollable={false}>
            <VStack gap={4}>
              <Grid columns={{ minWidth: 320, max: 3 }} gap={10}>
                <VStack gap={4}>
                  <VStack gap={1}>
                    <Heading level={3} accessibilityLevel={2}>
                      Meeting days
                    </Heading>
                    <Text type="supporting" color="secondary">
                      Meeting Mondays are the only dates you can pick in the calendar.
                    </Text>
                  </VStack>
                  <VStack gap={2}>
                    {meetings.map((m, i) => (
                      <HStack key={m.title} gap={2} vAlign="center" wrap="wrap">
                        <Badge variant={i === 0 ? 'blue' : 'yellow'} label={m.title} />
                        <Text type="supporting">{m.when}</Text>
                      </HStack>
                    ))}
                  </VStack>
                  <Banner
                    status="info"
                    title={meetingsNote}
                    collapsible={false}
                    description={
                      <Link href={`mailto:${council.email}`} color="inherit" hasUnderline>
                        {council.email}
                      </Link>
                    }
                  />
                </VStack>

                <VStack gap={3} hAlign="center">
                  <Calendar
                    mode="single"
                    value={selected}
                    onChange={(v) => v && setSelected(v as ISODateString)}
                    focusDate={focus}
                    onFocusDateChange={setFocus}
                    min={toISO(today) as ISODateString}
                    dateConstraints={[isMeetingDay]}
                    hasVariableRowCount
                  />
                  {selectedKind && (
                    <Card variant={selectedKind === 'knights' ? 'blue' : 'yellow'} width="100%">
                      <VStack gap={1}>
                        <Text type="body" weight="semibold">
                          {selectedKind === 'knights' ? meetings[0].title : meetings[1].title}
                        </Text>
                        <Text type="supporting">
                          {formatLong(selectedDate)} · {relative(selectedDate, today)}
                        </Text>
                      </VStack>
                    </Card>
                  )}
                </VStack>

                <VStack gap={2}>
                  <Heading level={3} accessibilityLevel={2}>
                    Upcoming dates
                  </Heading>
                  <List density="compact" hasDividers>
                    {upcoming.map((m) => (
                      <ListItem
                        key={m.iso}
                        label={m.title}
                        description={`${formatLong(m.date)} · ${m.ordinal}`}
                        startContent={<Icon icon={CalendarDaysIcon} size="sm" color="secondary" />}
                        endContent={<Badge variant={KIND_BADGE[m.kind]} label={formatShort(m.date)} />}
                        isSelected={m.iso === selected}
                        onClick={() => select(m.iso)}
                      />
                    ))}
                  </List>
                </VStack>
              </Grid>

              <Divider />

              <VStack gap={4}>
                <VStack gap={1}>
                  <Heading level={3} accessibilityLevel={2}>
                    Council calendar
                  </Heading>
                  <Text type="supporting" color="secondary">
                    Events from the council's Google Calendar.{' '}
                    <Link href={openUrl} isExternalLink type="supporting">
                      Open it in Google Calendar
                    </Link>
                  </Text>
                </VStack>
                <Card padding={0}>
                  <iframe
                    title="Council 6243 Google Calendar"
                    src={embedSrc}
                    loading="lazy"
                    {...stylex.props(styles.embed, isNarrow && styles.embedMobile)}
                  />
                </Card>
              </VStack>
            </VStack>
          </LayoutContent>
        }
      />
    </Shell>
  );
}
