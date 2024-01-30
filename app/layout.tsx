import './globals.css'
import SessionProvider from './ProvidersWrapper'
import Nav from './server-components/nav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>
          <Nav/>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}

