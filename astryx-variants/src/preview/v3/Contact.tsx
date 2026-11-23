// Contact — adapted from the Astryx `contact-form` page template.
// Kept: Center (horizontal) > VStack > Section (maxWidth 800, padding 6,
// paddingBlock 10, variant section) > VStack gap 6; the centred display
// header; a two-up Grid (minWidth 260) of TextInputs; a Divider; Selector and
// TextArea; a full-width large primary submit with a supporting line below.
// Replaced: the "why us" card row with a typographic directory of officers
// (MetadataList), and the lead-capture fields with the council's own.
// Removed: goal tokens, budget/timeline selectors, radio and checkbox.

import { useState, type FormEvent } from 'react';
import { VStack, HStack } from '@astryxdesign/core/Layout';
import { Center } from '@astryxdesign/core/Center';
import { Section } from '@astryxdesign/core/Section';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Button } from '@astryxdesign/core/Button';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Icon } from '@astryxdesign/core/Icon';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Selector } from '@astryxdesign/core/Selector';
import { TextArea } from '@astryxdesign/core/TextArea';
import { Divider } from '@astryxdesign/core/Divider';
import { Link } from '@astryxdesign/core/Link';
import { Banner } from '@astryxdesign/core/Banner';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { PageProps } from '../../App';
import { contactForm, contacts, council } from '../../shared/content';
import { useMediaQuery } from '@astryxdesign/core/hooks';
import { Shell } from './Shell';

export default function Contact({ current }: PageProps) {
  const isNarrow = useMediaQuery('(max-width: 720px)', true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<string>(contactForm.topics[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted
    ? {
        fullName: !fullName.trim() ? 'Required' : undefined,
        email: !/^\S+@\S+\.\S+$/.test(email.trim()) ? 'Enter a valid email address' : undefined,
        message: !message.trim() ? 'Required' : undefined,
      }
    : {};

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    setSubmitted(true);
    const invalid = !fullName.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || !message.trim();
    if (invalid) e.preventDefault();
  };

  return (
    <Shell current={current}>
      <Center axis="horizontal">
        <VStack hAlign="center" width="100%">
          <Section width="100%" maxWidth={800} padding={6} paddingBlock={10} variant="section">
            <VStack gap={6}>
              {/* Header */}
              <VStack gap={2} hAlign="center">
                <Text type="label" color="secondary">
                  Council {council.number} · {council.location}
                </Text>
                <Text as="h1" type="display-1" weight="bold" justify="center">
                  Contact us
                </Text>
                <Text type="body" color="secondary" justify="center">
                  {council.intro}
                </Text>
              </VStack>

              {/* Directory: officers, the council inbox and the parish */}
              <Card>
                <VStack gap={4}>
                  <Heading level={2}>Council officers</Heading>
                  <MetadataList label={{ position: 'top' }} columns={isNarrow ? 1 : 3}>
                    {contacts.map((c) => (
                      <MetadataListItem key={c.role} label={c.role}>
                        <VStack gap={1}>
                          <Text type="body" weight="bold">
                            {c.name}
                          </Text>
                          <HStack gap={1.5} vAlign="center">
                            <Icon icon={PhoneIcon} size="xsm" color="secondary" />
                            <Link href={`tel:${c.tel}`} type="supporting">
                              {c.phone}
                            </Link>
                          </HStack>
                          <HStack gap={1.5} vAlign="center">
                            <Icon icon={EnvelopeIcon} size="xsm" color="secondary" />
                            <Link href={`mailto:${c.email}`} type="supporting">
                              {c.email}
                            </Link>
                          </HStack>
                        </VStack>
                      </MetadataListItem>
                    ))}
                  </MetadataList>
                  <Divider />
                  <MetadataList>
                    <MetadataListItem
                      label="Council email"
                      icon={<Icon icon={EnvelopeIcon} size="sm" />}
                    >
                      <Link href={`mailto:${council.email}`}>{council.email}</Link>
                    </MetadataListItem>
                    <MetadataListItem label="Address" icon={<Icon icon={MapPinIcon} size="sm" />}>
                      <VStack gap={0.5}>
                        <Text type="body">{council.parishName}</Text>
                        <Text type="body" color="secondary">
                          {council.address}
                        </Text>
                      </VStack>
                    </MetadataListItem>
                  </MetadataList>
                </VStack>
              </Card>

              <Divider />

              <form method="POST" action="#" onSubmit={onSubmit} noValidate>
                <VStack gap={6}>
                  <Heading level={2}>Send us a message</Heading>

                  {/* Your details */}
                  <VStack gap={5}>
                    <Grid columns={{ minWidth: 260 }} gap={4}>
                      <TextInput
                        label="Name"
                        htmlName="name"
                        autoComplete="name"
                        isRequired
                        value={fullName}
                        onChange={setFullName}
                        status={
                          errors.fullName ? { type: 'error', message: errors.fullName } : undefined
                        }
                      />
                      <TextInput
                        label="Email"
                        type="email"
                        htmlName="email"
                        autoComplete="email"
                        isRequired
                        placeholder="you@example.com"
                        value={email}
                        onChange={setEmail}
                        status={errors.email ? { type: 'error', message: errors.email } : undefined}
                      />
                    </Grid>
                    <Grid columns={{ minWidth: 260 }} gap={4}>
                      <TextInput
                        label="Phone"
                        type="tel"
                        htmlName="phone"
                        autoComplete="tel"
                        isOptional
                        value={phone}
                        onChange={setPhone}
                      />
                      <Selector
                        label="Topic"
                        htmlName="topic"
                        options={[...contactForm.topics]}
                        value={topic}
                        onChange={(v) => setTopic(v ?? contactForm.topics[0])}
                      />
                    </Grid>
                  </VStack>

                  <TextArea
                    label="Message"
                    htmlName="message"
                    isRequired
                    rows={6}
                    value={message}
                    onChange={setMessage}
                    status={errors.message ? { type: 'error', message: errors.message } : undefined}
                  />

                  {submitted && Object.values(errors).some(Boolean) && (
                    <Banner status="error" title="Please fill in the required fields." />
                  )}

                  {/* Submit */}
                  <VStack gap={3}>
                    <Button label="Send message" type="submit" variant="primary" size="lg" />
                    <HStack gap={1} hAlign="center">
                      <Text type="supporting" color="secondary" justify="center">
                        Prefer email? Write to{' '}
                        <Link href={`mailto:${council.email}`} type="supporting">
                          {council.email}
                        </Link>
                        .
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </form>
            </VStack>
          </Section>
        </VStack>
      </Center>
    </Shell>
  );
}
