package com.nativemoduleapp

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*

class BluetoothModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private val discoveredDevices = mutableListOf<String>()
    private var receiverRegistered = false
    private var scanReceiver: BroadcastReceiver? = null

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

        discoveredDevices.clear()
        val filter = IntentFilter(BluetoothDevice.ACTION_FOUND)
        scanReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                val action: String? = intent.action
                if (BluetoothDevice.ACTION_FOUND == action) {
                    val device: BluetoothDevice? = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                    device?.let {
                        val deviceInfo = "${it.name} - ${it.address}"
                        discoveredDevices.add(deviceInfo)
                    }
                }
            }
        }

        reactApplicationContext.registerReceiver(scanReceiver, filter)
        receiverRegistered = true

        if (bluetoothAdapter.isDiscovering) {
            bluetoothAdapter.cancelDiscovery()
        }

        val discoveryStarted = bluetoothAdapter.startDiscovery()
        if (!discoveryStarted) {
            promise.reject("ERROR", "Failed to start discovery")
            return
        }

        Handler(Looper.getMainLooper()).postDelayed({
            if (receiverRegistered) {
                reactApplicationContext.unregisterReceiver(scanReceiver)
                receiverRegistered = false
            }
            promise.resolve(discoveredDevices)
        }, 10000) // 10 seconds
    }

    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        if (receiverRegistered) {
            try {
                reactApplicationContext.unregisterReceiver(scanReceiver)
                receiverRegistered = false
            } catch (e: IllegalArgumentException) {
                Log.e(TAG, "Receiver not registered", e)
            }
        }
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
