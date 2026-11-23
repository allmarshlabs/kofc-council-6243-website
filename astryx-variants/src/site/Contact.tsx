// Contact: adapted from the Astryx `contact-form` template — centered single
// column Section (maxWidth 800, padding 6/10), a row of cards above the form
// (here: the council officers), mixed controls, one full-width submit.
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
import { Avatar } from '@astryxdesign/core/Avatar';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Token } from '@astryxdesign/core/Token';
import { TextArea } from '@astryxdesign/core/TextArea';
import { Divider } from '@astryxdesign/core/Divider';
import { Banner } from '@astryxdesign/core/Banner';
import { Link } from '@astryxdesign/core/Link';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { PageProps } from '../App';
import { contactForm, contacts, council } from '../shared/content';
import { Shell } from './Shell';

export default function Contact({ current }: PageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const errors = submitted
    ? {
        name: !name.trim() ? 'Required' : undefined,
        email: !email.trim() ? 'Required' : undefined,
        topic: !topic ? 'Pick a topic' : undefined,
        message: !message.trim() ? 'Required' : undefined,
      }
    : {};

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<'sent' | 'failed' | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setResult(null);
    if (!name.trim() || !email.trim() || !topic || !message.trim()) return;

    const values = { name, email, phone, topic, message };
    const { formId, fields } = contactForm.googleForm;

    // Not connected to a Google Form yet: hand off to the visitor's email app.
    if (!formId) {
      const body = `${message}\n\n${name}\n${email}${phone ? `\n${phone}` : ''}`;
      window.location.href = `mailto:${council.email}?subject=${encodeURIComponent(
        `Website message: ${topic}`,
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    const data = new URLSearchParams();
    (Object.keys(fields) as (keyof typeof fields)[]).forEach((k) => {
      if (fields[k]) data.append(fields[k], values[k]);
    });
    setSending(true);
    try {
      // Google Forms doesn't send CORS headers, so the response is opaque;
      // a network error still throws and is reported below.
      await fetch(`https://docs.google.com/forms/d/e/${formId}/formResponse`, {
        method: 'POST',
        mode: 'no-cors',
        body: data,
      });
      setResult('sent');
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setTopic('');
      setMessage('');
    } catch {
      setResult('failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <Shell current={current}>
      <Center axis="horizontal">
        <VStack hAlign="center" width="100%">
          <Section width="100%" maxWidth={800} padding={6} paddingBlock={10} variant="section">
            <VStack gap={6}>
              {/* Header */}
              <VStack gap={2} hAlign="center">
                <Heading level={1} type="display-2" justify="center">
                  Contact us
                </Heading>
                <Text type="body" color="secondary" justify="center">
                  Email the council at <Link href={`mailto:${council.email}`}>{council.email}</Link>, call one
                  of our officers, or send us a message below.
                </Text>
              </VStack>

              {/* Officers */}
              <Grid columns={{ minWidth: 200 }} gap={4}>
                {contacts.map((c) => (
                  <Card key={c.name}>
                    <VStack gap={3}>
                      <Avatar name={c.name} size="lg" tooltip={false} />
                      <VStack gap={1}>
                        <Text type="supporting" color="secondary">
                          {c.role}
                        </Text>
                        <Text as="h2" type="body" weight="bold">
                          {c.name}
                        </Text>
                      </VStack>
                      <VStack gap={1}>
                        <HStack gap={2} vAlign="center">
                          <Icon icon={PhoneIcon} size="sm" color="secondary" />
                          <Link href={`tel:${c.tel}`} type="supporting" label={`Call ${c.name}, ${c.phone}`}>
                            {c.phone}
                          </Link>
                        </HStack>
                        <HStack gap={2} vAlign="center">
                          <Icon icon={EnvelopeIcon} size="sm" color="secondary" />
                          <Link href={`mailto:${c.email}`} type="supporting" maxLines={1}>
                            {c.email}
                          </Link>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Card>
                ))}
              </Grid>

              <Divider />

              <form onSubmit={onSubmit} noValidate aria-label="Send a message">
                <VStack gap={6}>
                  {/* Your details */}
                  <VStack gap={5}>
                    <Heading level={2}>Send a message</Heading>
                    <Grid columns={{ minWidth: 260 }} gap={4}>
                      <TextInput
                        label="Name"
                        htmlName="name"
                        autoComplete="name"
                        placeholder="Your name"
                        value={name}
                        onChange={setName}
                        isRequired
                        status={errors.name ? { type: 'error', message: errors.name } : undefined}
                      />
                      <TextInput
                        label="Email"
                        type="email"
                        htmlName="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={setEmail}
                        isRequired
                        status={errors.email ? { type: 'error', message: errors.email } : undefined}
                      />
                    </Grid>
                    <TextInput
                      label="Phone"
                      type="tel"
                      htmlName="phone"
                      autoComplete="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={setPhone}
                      isOptional
                    />
                  </VStack>

                  {/* Topic + message */}
                  <VStack gap={5}>
                    <VStack gap={2}>
                      <Text type="label" color="secondary">
                        What is this about?
                      </Text>
                      <HStack gap={2} wrap="wrap">
                        {contactForm.topics.map((t) => (
                          <Token
                            key={t}
                            label={t}
                            color={topic === t ? 'blue' : 'default'}
                            onClick={() => setTopic(t)}
                            description={topic === t ? 'Selected' : undefined}
                          />
                        ))}
                      </HStack>
                      {errors.topic && <Banner status="error" title={errors.topic} />}
                    </VStack>

                    <TextArea
                      label="Message"
                      htmlName="message"
                      placeholder="How can we help?"
                      rows={5}
                      value={message}
                      onChange={setMessage}
                      isRequired
                      status={errors.message ? { type: 'error', message: errors.message } : undefined}
                    />
                  </VStack>

                  {/* Submit */}
                  <VStack gap={3}>
                    {result === 'sent' && (
                      <Banner
                        status="success"
                        title="Message sent"
                        description="Thank you. A member of the council will reply by email."
                      />
                    )}
                    {result === 'failed' && (
                      <Banner
                        status="error"
                        title="We couldn't send your message"
                        description={`Please check your connection and try again, or email ${council.email}.`}
                      />
                    )}
                    <Button label="Send message" variant="primary" size="lg" type="submit" isLoading={sending} />
                    <Text type="supporting" color="secondary" justify="center">
                      We'll reply by email. You can also write to us directly at{' '}
                      <Link href={`mailto:${council.email}`} type="supporting">
                        {council.email}
                      </Link>
                      .
                    </Text>
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
