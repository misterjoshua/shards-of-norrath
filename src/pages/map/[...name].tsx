import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import ReactDOMServer from 'react-dom/server';
import { MapSvg } from '../../components/MapSvg';
import { MapSelector } from '../../components/MapSelector';
import { PageLayout } from '../../components/PageLayout';
import { useElementSize } from '../../hooks/useElementSize';
import { getViewBox, MapFileInfo, MapFile } from '../../maps';
import { getMapList, getMapFile } from '../../maps/server';

interface MapPageProps {
  mapList: MapFileInfo[];
  mapFile: MapFile;
}

const MapPage: NextPage<MapPageProps> = (props) => {
  const { mapList, mapFile } = props;

  return (
    <PageLayout>
      <MapSelector mapList={mapList} />
      <MapDisplay mapFile={mapFile} />
    </PageLayout>
  );
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const mapList = getMapList();

  return {
    paths: mapList.map((mapFile) => ({
      params: {
        name: mapFile.file.split('/'),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context: GetStaticPropsContext): Promise<GetStaticPropsResult<MapPageProps>> {
  if (!context.params) {
    return {
      notFound: true,
    };
  }

  const name = context.params.name as string[];
  const mapFile = getMapFile(name.join('/'));

  if (!mapFile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      mapList: getMapList(),
      mapFile,
    },
  };
}

export default MapPage;

function MapDisplay(props: { mapFile: MapFile }): JSX.Element {
  const { mapFile } = props;

  const viewBox = getViewBox(mapFile);

  const [boxRef, boxW, boxH] = useElementSize<HTMLDivElement>();

  function onDownloadSVG() {
    const svg = ReactDOMServer.renderToString(
      <MapSvg mapFile={mapFile} width={viewBox.width} height={viewBox.height} />,
    );
    const href = URL.createObjectURL(new Blob([svg], { type: 'image/png+xml' }));

    download({
      href,
      fileName: `${mapFile.display}.svg`,
    });
  }

  function onDownloadPNG() {
    const viewBox = getViewBox(mapFile);
    const width = Math.min(16384, viewBox.width * 10);
    const height = Math.min(16384, viewBox.height * 10);

    const img = document.createElement('img');
    img.loading = 'eager';
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas);
    document.body.appendChild(img);

    const svg = ReactDOMServer.renderToString(<MapSvg mapFile={mapFile} width={width} height={height} />);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No canvas rendering context');
    }

    img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
    // Wait until the image is done loading/rendering.
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      const href = canvas.toDataURL();

      document.body.removeChild(canvas);
      document.body.removeChild(img);

      download({
        href,
        fileName: `${mapFile.display}.png`,
      });
    };
    img.onerror = () => {
      document.body.removeChild(canvas);
      document.body.removeChild(img);
      alert('Your browser failed to render the map to an image file');
    };
  }

  return (
    <>
      <div className="mb-4">
        <button className="btn bg-green-600 rounded text-white p-2 m-1" onClick={onDownloadSVG}>
          Download SVG
        </button>
        <button className="btn bg-green-600 rounded text-white p-2 m-1" onClick={onDownloadPNG}>
          Download PNG
        </button>
      </div>
      <div className="h-[75vh]" ref={boxRef}>
        <MapSvg mapFile={mapFile} width={boxW} height={boxH} />
      </div>
    </>
  );
}

interface Download {
  readonly href: string;
  readonly fileName: string;
}

function download(params: Download) {
  const element = document.createElement('a');
  element.href = params.href;
  element.download = params.fileName;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
}
