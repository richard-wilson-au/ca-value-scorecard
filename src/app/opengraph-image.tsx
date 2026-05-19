import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt =
  'Strategic Capacity Diagnostic — a five-minute diagnostic for senior Corporate Affairs leaders, benchmarked against ASX mining and energy peers.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TP_WHITE = '#FFFFFF';
const TP_NAVY_INK = '#2F3D55';
const TP_NAVY = '#556C8E';
const TP_NAVY_SOFT = '#8C9AB1';
const TP_NAVY_LINE = '#C6CFDC';
const TP_ORANGE = '#F96121';

async function loadFont(relativePath: string): Promise<Buffer> {
  const filePath = path.join(process.cwd(), 'node_modules', relativePath);
  return readFile(filePath);
}

export default async function OpengraphImage() {
  const [baskervilleItalic, plexMono500, plexMono400] = await Promise.all([
    loadFont(
      '@fontsource/libre-baskerville/files/libre-baskerville-latin-400-italic.woff',
    ),
    loadFont(
      '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff',
    ),
    loadFont(
      '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff',
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: TP_WHITE,
          padding: '72px 88px',
          fontFamily: 'Plex',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: TP_NAVY_SOFT,
              fontSize: 18,
              fontFamily: 'PlexMedium',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor: TP_ORANGE,
              }}
            />
            <span>Transformation Partners</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontFamily: 'Baskerville',
              fontStyle: 'italic',
              fontSize: 76,
              lineHeight: 1.08,
              color: TP_NAVY_INK,
              letterSpacing: '-0.01em',
            }}
          >
            How does your CA function compare?
          </div>

          <div
            style={{
              fontFamily: 'Plex',
              fontSize: 28,
              lineHeight: 1.35,
              color: TP_NAVY,
              maxWidth: 880,
              display: 'flex',
            }}
          >
            A five-minute diagnostic for senior Corporate Affairs leaders, benchmarked against ASX mining and energy peers (n=10).
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: 1,
              backgroundColor: TP_NAVY_LINE,
              display: 'flex',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              fontFamily: 'PlexMedium',
              fontSize: 18,
              color: TP_NAVY,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            <span>Strategic Capacity Diagnostic</span>
            <span
              style={{
                fontFamily: 'Plex',
                color: TP_NAVY_SOFT,
                letterSpacing: '0.04em',
                textTransform: 'none',
              }}
            >
              caplaybook.substack.com
            </span>
          </div>
        </div>

      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Baskerville',
          data: baskervilleItalic,
          style: 'italic',
          weight: 400,
        },
        {
          name: 'Plex',
          data: plexMono400,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'PlexMedium',
          data: plexMono500,
          style: 'normal',
          weight: 500,
        },
      ],
    },
  );
}
