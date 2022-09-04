import type { GetStaticPropsResult, NextPage } from 'next';
import { PageLayout } from '../components/PageLayout';
import { getMapFile, getMapList } from '../maps/server';
import { MapSelector } from '../components/MapSelector';
import { MapFileInfo } from '../maps';

interface HomePageProps {
  mapList: MapFileInfo[];
}

const Home: NextPage<HomePageProps> = (props) => {
  const { mapList } = props;

  return (
    <PageLayout>
      <MapSelector mapList={mapList} />
    </PageLayout>
  );
};

export async function getStaticProps(): Promise<GetStaticPropsResult<HomePageProps>> {
  const mapList = getMapList();
  const mapFile = mapList[0] && getMapFile(mapList[0].file);

  if (!mapFile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      mapList,
    },
  };
}

export default Home;
