package com.worldlabsprotocol.circuit;

import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  private boolean webViewTouchHooked = false;

  private void hookWebViewTouch() {
    try {
      WebView webView = getBridge().getWebView();
      if (webView == null) {
        Log.e("WEBVIEW_TOUCH", "webView is null");
        return;
      }

      if (webViewTouchHooked) {
        Log.d("WEBVIEW_TOUCH", "listener already attached, skipping");
        return;
      }

      webViewTouchHooked = true;

      // Safe defaults that help taps behave consistently
      webView.setClickable(true);
      webView.setLongClickable(false);
      webView.setHapticFeedbackEnabled(false);
      webView.setFocusable(true);
      webView.setFocusableInTouchMode(true);
      webView.requestFocus();

      webView.setOnTouchListener(new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent ev) {
          Log.d("WEBVIEW_TOUCH", "action=" + ev.getAction() + " x=" + ev.getX() + " y=" + ev.getY());
          // Return false so WebView still handles the event normally
          return false;
        }
      });

      Log.d("WEBVIEW_TOUCH", "listener attached");
    } catch (Exception e) {
      Log.e("WEBVIEW_TOUCH", "hook error: " + e.getMessage());
      webViewTouchHooked = false;
    }
  }

  private void hookWebViewTouchDelayed() {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        getWindow().getDecorView().postDelayed(new Runnable() {
          @Override
          public void run() {
            hookWebViewTouch();
          }
        }, 500);
      }
    });
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    WebView.setWebContentsDebuggingEnabled(true);
    Log.d("WEBVIEW_TOUCH", "onCreate");
    hookWebViewTouchDelayed();
  }

  @Override
  public void onResume() {
    super.onResume();
    Log.d("WEBVIEW_TOUCH", "onResume");
    // Reset hook flag in case WebView was recreated
    webViewTouchHooked = false;
    hookWebViewTouchDelayed();
  }

  @Override
  public boolean dispatchTouchEvent(MotionEvent ev) {
    Log.d("CIRCUIT_TOUCH", "touch action=" + ev.getAction() + " x=" + ev.getX() + " y=" + ev.getY());
    return super.dispatchTouchEvent(ev);
  }
}