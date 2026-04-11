import { Divider, Text } from '@mantine/core'

export default function Footer() {
  return (
    <>
      <Divider mt="lg" />
      <Text
        size="xs"
        mt="xs"
        mb="xs"
        style={{
          textAlign: 'center',
        }}
      >
        Open-source monitoring and status page powered by{' '}
        <a
          href="https://github.com/lyc8503/UptimeFlare"
          target="_blank"
          rel="noreferrer noopener"
        >
          Uptimeflare
        </a>{' '}
        and{' '}
        <a href="https://www.cloudflare.com/" target="_blank" rel="noreferrer noopener">
          Cloudflare
        </a>
        , made with ❤ by{' '}
        <a href="https://github.com/lyc8503" target="_blank" rel="noreferrer noopener">
          lyc8503
        </a>
        .
      </Text>
    </>
  )
}
