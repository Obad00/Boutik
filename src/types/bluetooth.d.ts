// Déclarations minimales pour l'API Web Bluetooth (absente des libs TS par défaut).
export {};

declare global {
  interface BluetoothRemoteGATTCharacteristic {
    writeValueWithoutResponse(value: BufferSource): Promise<void>;
    writeValue(value: BufferSource): Promise<void>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: number | string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>;
    getPrimaryService(service: number | string): Promise<BluetoothRemoteGATTService>;
    disconnect(): void;
  }

  interface BluetoothDevice {
    gatt?: BluetoothRemoteGATTServer;
    name?: string;
    addEventListener(type: 'gattserverdisconnected', listener: () => void): void;
    removeEventListener(type: 'gattserverdisconnected', listener: () => void): void;
  }

  interface RequestDeviceOptions {
    filters?: Array<{ services?: Array<number | string> }>;
    optionalServices?: Array<number | string>;
  }

  interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  }

  interface Navigator {
    bluetooth: Bluetooth;
  }
}
