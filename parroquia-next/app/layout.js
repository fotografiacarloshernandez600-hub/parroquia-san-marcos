import './globals.css';

export const metadata = {
  title: 'Parroquia San Marcos Evangelista - Paraíso, Tabasco',
  description: '"Comprometernos decididamente con la nueva evangelización" desde una comunidad parroquial samaritana',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
