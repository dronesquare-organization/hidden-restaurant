import { useEffect, useState } from "react";
import Papa from "papaparse";
import { CustomMarker, InnerText, MapContainer } from "react-openlayers7";

type Location = {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
};

function CSVReader() {
  const [csvData, setCSVData] = useState<Location[]>([]);

  useEffect(() => {
    fetch("/convertcsv.csv") // public 디렉토리의 파일 경로를 지정
      .then((response) => response.text())
      .then((data) => {
        const result = Papa.parse(data, { header: true }); // CSV 파싱
        setCSVData(result.data as Location[]);
      })
      .catch((error) => console.error("Error fetching CSV:", error));
  }, []);

  return (
    <div>
      <MapContainer
        center={[126.9675222, 37.53609444]}
        zoomLevel={12}
        width="100vw"
        height="100vh"
      >
        {csvData.map((dat, index) => {
          const center = [Number(dat.x), Number(dat.y)];
          if (!dat.x || !dat.place_name) return null;
          return (
            <CustomMarker
              key={index}
              center={center}
              onClick={() => {
                window.location.href = dat.place_url;
              }}
            >
              <InnerText isPopup>{dat.place_name}</InnerText>
            </CustomMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default CSVReader;
