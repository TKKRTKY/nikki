import './globals.css';

export const metadata = {
  title: 'nikki - AI-Powered Diary App',
  description:
    'Organize your thoughts through LLM conversations and generate structured diary entries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
