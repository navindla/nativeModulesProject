package com.nativemoduleapp

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

import okhttp3.*
import java.io.IOException
import java.util.concurrent.TimeUnit

class NetworkInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Declare reactContext as a property of the class
    private val reactContext: ReactApplicationContext = reactContext

    override fun getName(): String {
        return "NetworkInfo"
    }

    @ReactMethod
    fun getNetworkInfo(promise: Promise) {
        try {
            val cm = reactContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            val capabilities = cm.getNetworkCapabilities(cm.activeNetwork)

            if (capabilities != null) {
                val type = when {
                    capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> "WiFi"
                    capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> "Cellular"
                    else -> "Other"
                }
                val isConnected = capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                val networkInfo = "Type: $type, Connected: $isConnected"

                promise.resolve(networkInfo)
            } else {
                promise.resolve("No active network")
            }
        } catch (e: Exception) {
            promise.reject("Network info error", e)
        }
    }


     @ReactMethod
    fun measureNetworkSpeed(url: String, promise: Promise) {
        val client = OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .build()

        val request = Request.Builder()
            .url(url)
            .build()

        val startTime = System.nanoTime()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                promise.reject("Speed test failed", e.message)
            }

            override fun onResponse(call: Call, response: Response) {
                response.body?.let {
                    it.close()
                    val endTime = System.nanoTime()
                    val durationMs = TimeUnit.NANOSECONDS.toMillis(endTime - startTime)
                    val speedKbps = calculateSpeedKbps(it.contentLength(), durationMs)

                    promise.resolve(speedKbps)
                } ?: run {
                    promise.reject("Speed test failed", "Response body is null")
                }
            }
        })
    }

     private fun calculateSpeedKbps(bytes: Long, timeMs: Long): Double {
        if (timeMs == 0L) return 0.0
        val bytesPerSecond = (bytes / timeMs.toDouble()) * 1000
        return bytesPerSecond * 8 / 1024 // Convert to Kbps
    }

}
