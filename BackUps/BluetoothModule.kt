package com.nativemoduleapp

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.content.pm.PackageManager
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*

class BluetoothModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()

    companion object {
        private const val TAG = "BluetoothModule"
         const val REQUEST_ENABLE_BT = 1
         const val REQUEST_BLUETOOTH_PERMISSIONS = 2
    }

    override fun getName(): String {
        return "BluetoothModule"
    }

   
   @ReactMethod
fun enableBluetooth(promise: Promise) {
    if (bluetoothAdapter != null && !bluetoothAdapter.isEnabled) {
        bluetoothAdapter.enable()
        promise.resolve("Bluetooth enabled successfully")
    } else if (bluetoothAdapter != null && bluetoothAdapter.isEnabled) {
        promise.resolve("Bluetooth is already enabled")
    } else {
        promise.reject("ERROR", "Bluetooth not supported on this device")
    }
}


   @ReactMethod
fun disableBluetooth(promise: Promise) {
    if (bluetoothAdapter != null && bluetoothAdapter.isEnabled) {
        bluetoothAdapter.disable()
        promise.resolve("Bluetooth disabled successfully")
    } else if (bluetoothAdapter != null && !bluetoothAdapter.isEnabled) {
        promise.resolve("Bluetooth is already disabled")
    } else {
        promise.reject("ERROR", "Bluetooth not supported on this device")
    }
}


    @ReactMethod
     fun getPairedDevices(promise: Promise) {
        if (bluetoothAdapter != null && bluetoothAdapter.isEnabled) {
            val pairedDevices = bluetoothAdapter.bondedDevices
            val deviceList: WritableArray = Arguments.createArray()
            for (device in pairedDevices) {
                deviceList.pushString("${device.name} - ${device.address}")
            }
            promise.resolve(deviceList)
        } else {
            promise.reject("ERROR", "Bluetooth is not enabled or not supported on this device")
        }
    }



    @ReactMethod
fun scanForDevices(promise: Promise) {
    if (bluetoothAdapter == null) {
        promise.reject("ERROR", "Bluetooth not supported on this device")
        return
    }

    if (!bluetoothAdapter.isEnabled) {
        promise.reject("ERROR", "Bluetooth is not enabled")
        return
    }

    val discoveredDevices = mutableListOf<String>()
    val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
    val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val action: String? = intent.action
            if (BluetoothDevice.ACTION_FOUND == action) {
                val device: BluetoothDevice? =
                    intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                device?.let {
                    val deviceInfo = "${it.name} - ${it.address}"
                    discoveredDevices.add(deviceInfo)
                }
            }
        }
    }

    reactApplicationContext.registerReceiver(receiver, filter)

    if (bluetoothAdapter.isDiscovering) {
        bluetoothAdapter.cancelDiscovery()
    }
    val discoveryStarted = bluetoothAdapter.startDiscovery()
    if (!discoveryStarted) {
        promise.reject("ERROR", "Failed to start discovery")
        return
    }

    // Schedule a runnable to stop discovery and resolve the promise after a certain period
    val handler = android.os.Handler()
    handler.postDelayed({
        reactApplicationContext.unregisterReceiver(receiver)
        promise.resolve(discoveredDevices)
    }, 10000) // 10 seconds
}




    private fun checkAndRequestPermissions(): Boolean {
        val activity = currentActivity ?: return false
        val permissions = arrayOf(
            Manifest.permission.BLUETOOTH,
            Manifest.permission.BLUETOOTH_ADMIN,
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT,
            Manifest.permission.ACCESS_FINE_LOCATION
        )
        val neededPermissions = permissions.filter {
            ContextCompat.checkSelfPermission(activity, it) != PackageManager.PERMISSION_GRANTED
        }

        return if (neededPermissions.isNotEmpty()) {
            ActivityCompat.requestPermissions(activity, neededPermissions.toTypedArray(), REQUEST_BLUETOOTH_PERMISSIONS)
            false
        } else {
            true
        }
    }
}
