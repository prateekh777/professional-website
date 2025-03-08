import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: '../public/Fonts/AeonikTRIAL-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/Fonts/AeonikTRIAL-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/Fonts/AeonikTRIAL-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Fonts/AeonikTRIAL-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/Fonts/AeonikTRIAL-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/Fonts/AeonikTRIAL-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-aeonik',
}); 