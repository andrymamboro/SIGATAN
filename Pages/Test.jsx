import MapPicker from '../Components/maps/MapPicker';

export default function Test() {
  return (
    <div style={{ height: 600 }}>
      <MapPicker
        tanahList={[
          { id: 1, latitude: -0.79, longitude: 119.87, status: 'Proses', nama_pemilik: 'Test' }
        ]}
      />
    </div>
  );
}
