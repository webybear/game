import './global.css';
import { AppProviders } from '../providers/AppProviders';

export const metadata = {
  title: 'Star Wars Card Game',
  description: 'Star Wars Card Game - People vs Starships Battle Arena',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
