import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: './fonts/AeonikTRIAL-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/AeonikTRIAL-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: './fonts/AeonikTRIAL-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/AeonikTRIAL-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/AeonikTRIAL-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/AeonikTRIAL-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-aeonik',
}); 