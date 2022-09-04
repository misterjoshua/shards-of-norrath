import { useRouter } from 'next/router';
import { MapFileInfo } from '../maps';

export function MapSelector(props: { mapList: MapFileInfo[] }): JSX.Element {
  const { mapList } = props;
  const router = useRouter();

  return (
    <select
      className="mb-4 block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      onChange={(e) => {
        const url = e.target.value ? `/map/${e.target.value}` : '/';
        router.push(url);
      }}
    >
      <option value={''}>Select a Map</option>
      {mapList.map((map) => (
        <option key={map.file} value={map.file}>
          {map.display}
        </option>
      ))}
    </select>
  );
}
