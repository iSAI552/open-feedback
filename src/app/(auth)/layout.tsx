export const metadata = {
  title: 'Open Feedback',
  description: 'Provide anonymous feedback to anyone, anywhere.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
