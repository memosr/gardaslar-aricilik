import "./globals.css";

export const metadata = {
  title: "Gardaşlar Arıcılık",
  description: "1987'den beri yayla arıcılığı. Katkısız, analizli bal ve arı ürünleri, üreticiden sofranıza.",
  openGraph: {
    title: "Gardaşlar Arıcılık",
    description: "Kovandan sofraya, üç kuşaktır aynı sabırla.",
    images: ["/media/hero-poster.jpg"],
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport = { themeColor: "#FFC629" };

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;0,6..96,700;1,6..96,500;1,6..96,600&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
