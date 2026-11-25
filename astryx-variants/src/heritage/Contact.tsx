// Contact — adapted from the Astryx `form-two-column` page template.
// Kept: Center > Section (maxWidth 1100, padding 10) frame, the two-column
// Grid (minWidth 320, gap 10) of headline + image beside the form Card
// (padding 8), and the divided contact strip underneath. Replaced: copy,
// fields (name, email, optional phone, topic, message) and the strip, which
// now holds the three officers. The persistent context column carries the
// council email and parish address. Removed: company/job/budget fields and
// the inquiry-reason tokens (the topic Selector submits with the form).

import {useState, type FormEvent} from 'react';
import {VStack, HStack} from '@astryxdesign/core/Layout';
import {Center} from '@astryxdesign/core/Center';
import {Section} from '@astryxdesign/core/Section';
import {Grid} from '@astryxdesign/core/Grid';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Link} from '@astryxdesign/core/Link';
import {Divider} from '@astryxdesign/core/Divider';
import {Card} from '@astryxdesign/core/Card';
import {Selector} from '@astryxdesign/core/Selector';
import {Icon} from '@astryxdesign/core/Icon';
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import type {PageProps} from '../App';
import {
  contactForm,
  contacts,
  council,
  meetingsNote,
} from '../shared/content';
import {Shell} from './Shell';
import {useMediaQuery} from '@astryxdesign/core/hooks';

export default function ContactPage({current}: PageProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isPhone = useMediaQuery('(max-width: 640px)', false);

  const errors = submitted
    ? {
        fullName: !fullName.trim() ? 'Required' : undefined,
        email: !/^\S+@\S+\.\S+$/.test(email.trim())
          ? 'Enter an email address'
          : undefined,
        message: !message.trim() ? 'Required' : undefined,
      }
    : {};

  // Native POST to the form service (VStack as="form" doesn't type method /
  // action, so they're set on the element just before the browser submits);
  // blocked only while required fields are empty so the inline errors show.
  const handleSubmit = (e: FormEvent<HTMLElement>) => {
    const form = e.currentTarget as HTMLFormElement;
    form.method = 'POST';
    form.action = '#'; // preview only: the main site build uses Google Forms
    form.noValidate = true;
    setSubmitted(true);
    if (
      !fullName.trim() ||
      !/^\S+@\S+\.\S+$/.test(email.trim()) ||
      !message.trim()
    ) {
      e.preventDefault();
    }
  };

  return (
    <Shell current={current}>
      <Center axis="horizontal">
        <Section
          maxWidth={1100}
          width="100%"
          padding={10}
          paddingInline={isPhone ? 4 : 10}
          variant="transparent">
          <VStack gap={10}>
            {/* Two-column; stacks to one column below ~700px. */}
            <Grid columns={{minWidth: 320}} align="start" gap={10}>
              <VStack gap={6}>
                <VStack gap={3}>
                  <Text type="display-1" as="h1">
                    Contact us
                  </Text>
                  <Text type="large" color="secondary">
                    {council.intro}
                  </Text>
                </VStack>
                <VStack gap={3}>
                  <HStack gap={2} vAlign="start">
                    <Icon icon={EnvelopeIcon} size="sm" color="accent" />
                    <VStack gap={0}>
                      <Text type="label">Council email</Text>
                      <Link href={`mailto:${council.email}`}>
                        {council.email}
                      </Link>
                    </VStack>
                  </HStack>
                  <HStack gap={2} vAlign="start">
                    <Icon icon={MapPinIcon} size="sm" color="accent" />
                    <VStack gap={0}>
                      <Text type="label">{council.hallName}</Text>
                      <Text type="body" color="secondary">
                        {council.address}
                      </Text>
                      <Link href={council.directionsUrl} isExternalLink>
                        Get directions
                      </Link>
                      <Link href={council.parishUrl} isExternalLink>
                        Visit our parish
                      </Link>
                    </VStack>
                  </HStack>
                  <Text type="supporting" color="secondary">
                    {meetingsNote}
                  </Text>
                </VStack>
              </VStack>

              <Card padding={isPhone ? 5 : 8}>
                <VStack
                  as="form"
                  gap={4}
                  onSubmit={handleSubmit}>
                  <Text type="display-3" as="h2">
                    Send a message
                  </Text>
                  <TextInput
                    label="Full name"
                    htmlName="name"
                    autoComplete="name"
                    value={fullName}
                    onChange={setFullName}
                    status={
                      errors.fullName
                        ? {type: 'error', message: errors.fullName}
                        : undefined
                    }
                  />
                  <Grid columns={{minWidth: 180}} gap={3}>
                    <TextInput
                      label="Email"
                      type="email"
                      htmlName="email"
                      autoComplete="email"
                      value={email}
                      onChange={setEmail}
                      status={
                        errors.email
                          ? {type: 'error', message: errors.email}
                          : undefined
                      }
                    />
                    <TextInput
                      label="Phone"
                      type="tel"
                      htmlName="phone"
                      autoComplete="tel"
                      isOptional
                      value={phone}
                      onChange={setPhone}
                    />
                  </Grid>
                  <Selector
                    label="Topic"
                    htmlName="topic"
                    options={[...contactForm.topics]}
                    value={topic ?? undefined}
                    onChange={setTopic}
                    placeholder="What is this about?"
                  />
                  <TextArea
                    label="Message"
                    htmlName="message"
                    rows={5}
                    value={message}
                    onChange={setMessage}
                    status={
                      errors.message
                        ? {type: 'error', message: errors.message}
                        : undefined
                    }
                  />
                  {/* hAlign="stretch" = full-width button. */}
                  <VStack hAlign="stretch">
                    <Button
                      label="Send message"
                      variant="primary"
                      type="submit"
                      size="lg"
                    />
                  </VStack>
                </VStack>
              </Card>
            </Grid>

            {/* Officer strip; stacks on narrow screens. */}
            <VStack gap={6}>
              <Divider />
              <Grid columns={{minWidth: 220, repeat: 'fit'}} gap={6}>
                {contacts.map(c => (
                  <VStack key={c.role} gap={1} hAlign="center">
                    <Text type="supporting" color="secondary">
                      {c.role}
                    </Text>
                    <Text type="large" weight="semibold" justify="center">
                      {c.name}
                    </Text>
                    <HStack gap={1} vAlign="center">
                      <Icon icon={PhoneIcon} size="xsm" color="secondary" />
                      <Link href={`tel:${c.tel}`} type="body" size="sm">
                        {c.phone}
                      </Link>
                    </HStack>
                    <HStack gap={1} vAlign="center">
                      <Icon icon={EnvelopeIcon} size="xsm" color="secondary" />
                      <Link href={`mailto:${c.email}`} type="body" size="sm">
                        {c.email}
                      </Link>
                    </HStack>
                  </VStack>
                ))}
              </Grid>
            </VStack>
          </VStack>
        </Section>
      </Center>
    </Shell>
  );
}
