// Connexion Web Bluetooth à une imprimante thermique ESC/POS (58mm).
// Compatible avec la plupart des imprimantes utilisant le profil SPP-like
// via le service générique 0000ff00-0000-1000-8000-00805f9b34fb (courant sur
// les imprimantes chinoises génériques) — à ajuster selon le modèle réel.

const PRINTER_SERVICE_UUID = 0x18f0; // service générique imprimante BLE
const PRINTER_CHARACTERISTIC_UUID = 0x2af1;

export interface PrinterConnection {
  device: BluetoothDevice;
  characteristic: BluetoothRemoteGATTCharacteristic;
}

export function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

export async function connectPrinter(): Promise<PrinterConnection> {
  if (!isBluetoothSupported()) {
    throw new Error("Le Bluetooth n'est pas disponible sur cet appareil/navigateur.");
  }

  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [PRINTER_SERVICE_UUID] }],
    optionalServices: [PRINTER_SERVICE_UUID],
  });

  const server = await device.gatt?.connect();
  if (!server) throw new Error("Impossible de se connecter à l'imprimante.");

  const service = await server.getPrimaryService(PRINTER_SERVICE_UUID);
  const characteristic = await service.getCharacteristic(PRINTER_CHARACTERISTIC_UUID);

  return { device, characteristic };
}

export async function sendToPrinter(conn: PrinterConnection, data: Uint8Array): Promise<void> {
  // Découpe en paquets de 100 octets (limite MTU courante en BLE)
  const CHUNK_SIZE = 100;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    await conn.characteristic.writeValueWithoutResponse(chunk);
    await new Promise((r) => setTimeout(r, 20));
  }
}

export function disconnectPrinter(conn: PrinterConnection): void {
  conn.device.gatt?.disconnect();
}
