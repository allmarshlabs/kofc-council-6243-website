// Calendar — adapted from the Astryx `table-grouped` page template.
// Kept: Layout with a divided LayoutHeader (padding 4: h1 + primary action),
// LayoutContent padding 0 holding a Table (balanced density, row dividers,
// hover) grouped with useTableGroupedRows into collapsible sections, each
// header showing its label and a count Badge.
// Removed: PowerSearch, the grouping popover, row menus, the create dialog and
// the resizable detail panel — a meeting schedule has nothing to filter or
// edit. Added below the table: the confirm note and the Google Calendar embed.

import { useMemo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  VStack,
  HStack,
  StackItem,
} from '@astryxdesign/core/Layout';
import { Text, Heading } from '@astryxdesign/core/Text';
import { Button } from '@astryxdesign/core/Button';
import { Badge } from '@astryxdesign/core/Badge';
import { Card } from '@astryxdesign/core/Card';
import { Center } from '@astryxdesign/core/Center';
import { Banner } from '@astryxdesign/core/Banner';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Link } from '@astryxdesign/core/Link';
import { Icon } from '@astryxdesign/core/Icon';
import { Table, proportional, pixel, useTableGroupedRows } from '@astryxdesign/core/Table';
import type { TableColumn } from '@astryxdesign/core/Table';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import type { PageProps } from '../../App';
import { council, meetings, meetingsNote } from '../../shared/content';
import { Shell } from './Shell';
import { formatDay, formatShort, isToday, upcomingMeetings, type Meeting } from './schedule';

const styles = stylex.create({
  embed: { display: 'block', width: '100%', height: 620, borderWidth: 0 },
});

interface MeetingRow extends Record<string, unknown> {
  id: string;
  month: string;
  meeting: Meeting;
}

function getColumns(isNarrow: boolean): TableColumn<MeetingRow>[] {
  const cols: TableColumn<MeetingRow>[] = [
    {
      key: 'date',
      header: 'Date',
      width: isNarrow ? proportional(1) : pixel(280),
      renderCell: ({ meeting }) => (
        <HStack gap={2} vAlign="center">
          <Text type="body" weight="bold" hasTabularNumbers>
            {isNarrow ? formatShort(meeting.date) : formatDay(meeting.date)}
          </Text>
          {isToday(meeting.date) && <Badge variant="success" label="Today" />}
        </HStack>
      ),
    },
  ];
  if (!isNarrow) {
    cols.push({
      key: 'meeting',
      header: 'Meeting',
      width: proportional(1),
      renderCell: ({ meeting }) => (
        <HStack gap={3} vAlign="center">
          <Text type="body">{meeting.title}</Text>
          <Text type="supporting" color="secondary">
            {meeting.rule}
          </Text>
        </HStack>
      ),
    });
  }
  cols.push({
    key: 'group',
    header: 'Group',
    width: pixel(isNarrow ? 150 : 180),
    renderCell: ({ meeting }) => (
      <Badge variant={meeting.group === 'Knights' ? 'blue' : 'purple'} label={meeting.group} />
    ),
  });
  return cols;
}

export default function Calendar({ current }: PageProps) {
  const isNarrow = useMediaQuery('(max-width: 640px)', true);
  const columns = useMemo(() => getColumns(isNarrow), [isNarrow]);
  const rows = useMemo<MeetingRow[]>(
    () => upcomingMeetings(6).map((m) => ({ id: m.id, month: m.month, meeting: m })),
    [],
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => new Set());

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const grouped = useTableGroupedRows<MeetingRow>({
    data: rows,
    groupBy: (row) => row.month,
    collapsedGroups,
    onToggleGroup: toggleGroup,
    getRowKey: (row) => row.id,
    renderGroupHeader: (key, count) => (
      <HStack gap={2} vAlign="center">
        <Text type="body" weight="bold">
          {key}
        </Text>
        <Badge variant="neutral" label={`${count} meeting${count === 1 ? '' : 's'}`} />
      </HStack>
    ),
  });

  return (
    <Shell current={current}>
      <Layout
        height="auto"
        contentWidth={1200}
        header={
          <LayoutHeader hasDivider padding={4}>
            <VStack gap={4}>
              {/* On a narrow screen the action moves under the title instead of squeezing it. */}
              <HStack gap={3} vAlign="center" wrap="wrap">
                <StackItem size="fill">
                  <VStack gap={1}>
                    <Text type="label" color="secondary">
                      Council {council.number} · Meeting schedule
                    </Text>
                    <Heading level={1}>Calendar</Heading>
                  </VStack>
                </StackItem>
                <Button
                  label="Email to confirm"
                  variant="primary"
                  size="lg"
                  href={`mailto:${council.email}?subject=Meeting%20time%20and%20location`}
                />
              </HStack>
              <HStack gap={6} wrap="wrap">
                {meetings.map((m) => (
                  <VStack key={m.title} gap={0.5}>
                    <Text type="body" weight="bold">
                      {m.title}
                    </Text>
                    <Text type="supporting" color="secondary">
                      {m.when}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </VStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent padding={0}>
            {/* A website page, not an app pane: hold the table to the header's measure. */}
            <Center axis="horizontal">
              <VStack
                gap={0}
                width="100%"
                maxWidth={1200}
                paddingInline={isNarrow ? 0 : 4}
                paddingBlockStart={isNarrow ? 0 : 4}
              >
                <Table
                  data={grouped.data}
                  columns={columns}
                  idKey={grouped.idKey}
                  density="balanced"
                  dividers="rows"
                  textOverflow="truncate"
                  hasHover
                  plugins={{ grouped: grouped.plugin }}
                />
                <VStack gap={6} paddingInline={isNarrow ? 4 : 0} paddingBlock={8}>
                  <Banner
                    status="info"
                    title={meetingsNote}
                    endContent={
                      <Link href={`mailto:${council.email}`} type="supporting">
                        {council.email}
                      </Link>
                    }
                  />
                  <Card padding={0}>
                    <Collapsible
                      defaultIsOpen={!isNarrow}
                      trigger={
                        <HStack gap={3} vAlign="center" padding={4}>
                          <Icon icon={CalendarDaysIcon} size="md" color="accent" />
                          <Text type="body" weight="bold">
                            Council Google Calendar
                          </Text>
                        </HStack>
                      }
                    >
                      <VStack gap={3} padding={4} paddingBlockStart={0}>
                        <iframe
                          title="Council 6243 Google Calendar"
                          src={council.calendarEmbed}
                          loading="lazy"
                          {...stylex.props(styles.embed)}
                        />
                        <HStack>
                          <Link href={council.calendarEmbed} isExternalLink>
                            Open the calendar in Google Calendar
                          </Link>
                        </HStack>
                      </VStack>
                    </Collapsible>
                  </Card>
                </VStack>
              </VStack>
            </Center>
          </LayoutContent>
        }
      />
    </Shell>
  );
}
