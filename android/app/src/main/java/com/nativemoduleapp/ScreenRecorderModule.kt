// ScreenRecorderModule.kt
package com.nativemoduleapp

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.MediaRecorder
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Environment
import android.util.DisplayMetrics
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*

import java.io.IOException

class ScreenRecorderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var projectionManager: MediaProjectionManager? = null
    private var mediaProjection: MediaProjection? = null
    private var mediaRecorder: MediaRecorder? = null
    private var virtualDisplay: VirtualDisplay? = null
    private var startPromise: Promise? = null
    private var filePath: String? = null

    init {
        reactContext.addActivityEventListener(this)
        projectionManager = reactContext.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
    }

    override fun getName(): String {
        return "ScreenRecorder"
    }

    @ReactMethod
    fun startRecording(promise: Promise) {
        startPromise = promise
        val currentActivity = currentActivity
        if (currentActivity != null) {
            if (checkAndRequestPermissions(currentActivity)) {
                val captureIntent = projectionManager!!.createScreenCaptureIntent()
                currentActivity.startActivityForResult(captureIntent, REQUEST_CODE)
            }
        } else {
            promise.reject("ACTIVITY_NULL", "Current activity is null")
        }
    }

    @ReactMethod
    fun stopRecording(promise: Promise) {
        if (mediaProjection != null) {
            mediaProjection!!.stop()
            mediaRecorder!!.stop()
            mediaRecorder!!.reset()
            virtualDisplay!!.release()
            mediaProjection = null
            promise.resolve(filePath)
        } else {
            promise.reject("NOT_RECORDING", "No active recording found")
        }
    }

    private fun setUpMediaRecorder() {
        filePath = "${Environment.getExternalStorageDirectory()}/recorded_video.mp4"
        mediaRecorder = MediaRecorder()
        mediaRecorder!!.setAudioSource(MediaRecorder.AudioSource.MIC)
        mediaRecorder!!.setVideoSource(MediaRecorder.VideoSource.SURFACE)
        mediaRecorder!!.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
        mediaRecorder!!.setOutputFile(filePath)
        mediaRecorder!!.setVideoSize(1920, 1080) // Full HD resolution
        mediaRecorder!!.setVideoEncoder(MediaRecorder.VideoEncoder.H264)
        mediaRecorder!!.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
        mediaRecorder!!.setVideoEncodingBitRate(5 * 1000 * 1000) // 5 Mbps
        mediaRecorder!!.setVideoFrameRate(30) // 30 fps
        mediaRecorder!!.prepare()
    }

    private fun createVirtualDisplay(): VirtualDisplay {
        val metrics = reactApplicationContext.resources.displayMetrics
        val screenDensity = metrics.densityDpi
        return mediaProjection!!.createVirtualDisplay(
            "ScreenRecorder",
            1920, 1080, screenDensity, // Full HD resolution
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            mediaRecorder!!.surface, null, null
        )
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                mediaProjection = projectionManager!!.getMediaProjection(resultCode, data!!)
                try {
                    setUpMediaRecorder()
                    virtualDisplay = createVirtualDisplay()
                    mediaRecorder!!.start()
                    startPromise!!.resolve("Recording started")
                } catch (e: IOException) {
                    startPromise!!.reject("RECORDER_ERROR", "Error setting up media recorder", e)
                }
            } else {
                startPromise!!.reject("PERMISSION_DENIED", "Screen capture permission denied")
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // No-op
    }

    private fun checkAndRequestPermissions(activity: Activity): Boolean {
        val permissionsNeeded = mutableListOf<String>()
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.RECORD_AUDIO)
        }
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
        }
        if (ContextCompat.checkSelfPermission(activity, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.READ_EXTERNAL_STORAGE)
        }
        return if (permissionsNeeded.isNotEmpty()) {
            ActivityCompat.requestPermissions(activity, permissionsNeeded.toTypedArray(), PERMISSION_REQUEST_CODE)
            false
        } else {
            true
        }
    }

    companion object {
        private const val REQUEST_CODE = 1000
        private const val PERMISSION_REQUEST_CODE = 2000
    }
}
