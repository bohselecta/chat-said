package com.chatsaid.taurus;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.net.Uri;
import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.os.Build;
import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.Toast;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

public class MainActivity extends Activity {
    private static final int PERMISSION_REQUEST = 42;
    private static final String PREFS = "taurus-pocket";
    private static final String KEY_URL = "forge-url";
    private WebView webView;
    private SharedPreferences prefs;
    private NsdManager.DiscoveryListener discoveryListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        prefs = getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        requestRuntimePermissions();
        buildWebView();
        String url = prefs.getString(KEY_URL, "");
        if (url.isEmpty()) promptForServer();
        else webView.loadUrl(normalizeUrl(url));
    }

    private void buildWebView() {
        webView = new WebView(this);
        webView.setBackgroundColor(0xFF050811);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, false);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                Uri target = request.getUrl();
                Uri forge = Uri.parse(normalizeUrl(prefs.getString(KEY_URL, "")));
                boolean sameNode = forge.getHost() != null && forge.getHost().equalsIgnoreCase(target.getHost()) && forge.getPort() == target.getPort();
                if (sameNode) return false;
                startActivity(new Intent(Intent.ACTION_VIEW, target));
                return true;
            }
        });
        webView.addJavascriptInterface(new NativeBridge(), "TaurusNative");
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> {
                    if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                        request.deny();
                        requestRuntimePermissions();
                        return;
                    }
                    List<String> allowed = new ArrayList<>();
                    for (String resource : request.getResources()) {
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) allowed.add(resource);
                    }
                    if (allowed.isEmpty()) request.deny();
                    else request.grant(allowed.toArray(new String[0]));
                });
            }
        });
        webView.setOnLongClickListener(view -> {
            promptForServer();
            return true;
        });
        setContentView(webView, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
    }

    private void requestRuntimePermissions() {
        List<String> missing = new ArrayList<>();
        if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            missing.add(Manifest.permission.RECORD_AUDIO);
        }
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.NEARBY_WIFI_DEVICES) != PackageManager.PERMISSION_GRANTED) {
            missing.add(Manifest.permission.NEARBY_WIFI_DEVICES);
        }
        if (!missing.isEmpty()) requestPermissions(missing.toArray(new String[0]), PERMISSION_REQUEST);
    }

    private void promptForServer() {
        EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setHint("http://192.168.1.50:7847");
        input.setText(prefs.getString(KEY_URL, ""));
        int pad = (int) (20 * getResources().getDisplayMetrics().density);
        FrameLayout wrap = new FrameLayout(this);
        wrap.setPadding(pad, 0, pad, 0);
        wrap.addView(input, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT));
        new AlertDialog.Builder(this)
            .setTitle("Connect Tong Buku Pocket")
            .setMessage("Enter the LAN address shown by Tong Buku Forge. Long-press anywhere later to change it.")
            .setView(wrap)
            .setCancelable(!prefs.getString(KEY_URL, "").isEmpty())
            .setPositiveButton("Connect", (dialog, which) -> {
                String url = normalizeUrl(input.getText().toString());
                prefs.edit().putString(KEY_URL, url).apply();
                webView.loadUrl(url);
            })
            .setNeutralButton("Find Tong Buku", (dialog, which) -> discoverForge())
            .setNegativeButton("Cancel", null)
            .show();
    }

    private void discoverForge() {
        NsdManager manager = (NsdManager) getSystemService(Context.NSD_SERVICE);
        Toast.makeText(this, "Looking for Tong Buku Forge…", Toast.LENGTH_SHORT).show();
        discoveryListener = new NsdManager.DiscoveryListener() {
            @Override public void onDiscoveryStarted(String type) {}
            @Override public void onDiscoveryStopped(String type) {}
            @Override public void onStartDiscoveryFailed(String type, int code) { stopDiscovery(manager); }
            @Override public void onStopDiscoveryFailed(String type, int code) { stopDiscovery(manager); }
            @Override public void onServiceLost(NsdServiceInfo service) {}
            @Override public void onServiceFound(NsdServiceInfo service) {
                if (!service.getServiceType().contains("_chatsaid-taurus")) return;
                manager.resolveService(service, new NsdManager.ResolveListener() {
                    @Override public void onResolveFailed(NsdServiceInfo info, int code) {}
                    @Override public void onServiceResolved(NsdServiceInfo info) {
                        stopDiscovery(manager);
                        String url = "http://" + info.getHost().getHostAddress() + ":" + info.getPort();
                        runOnUiThread(() -> new AlertDialog.Builder(MainActivity.this)
                            .setTitle("Tong Buku Forge found")
                            .setMessage(url)
                            .setPositiveButton("Connect", (d, w) -> { prefs.edit().putString(KEY_URL, url).apply(); webView.loadUrl(url); })
                            .setNegativeButton("Cancel", null)
                            .show());
                    }
                });
            }
        };
        manager.discoverServices("_chatsaid-taurus._tcp.", NsdManager.PROTOCOL_DNS_SD, discoveryListener);
    }

    private void stopDiscovery(NsdManager manager) {
        if (discoveryListener == null) return;
        try { manager.stopServiceDiscovery(discoveryListener); } catch (Exception ignored) {}
        discoveryListener = null;
    }

    private class NativeBridge {
        @JavascriptInterface
        public String wake(String mac, String broadcast, int port) {
            final String cleaned = mac == null ? "" : mac.replaceAll("[^A-Fa-f0-9]", "");
            if (cleaned.length() != 12) return "invalid-mac";
            final String address = (broadcast == null || broadcast.isEmpty()) ? "255.255.255.255" : broadcast;
            final int targetPort = port <= 0 ? 9 : port;
            Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    byte[] macBytes = new byte[6];
                    for (int i = 0; i < 6; i++) macBytes[i] = (byte) Integer.parseInt(cleaned.substring(i * 2, i * 2 + 2), 16);
                    byte[] packet = new byte[102];
                    for (int i = 0; i < 6; i++) packet[i] = (byte) 0xFF;
                    for (int i = 6; i < packet.length; i++) packet[i] = macBytes[(i - 6) % 6];
                    DatagramSocket socket = new DatagramSocket();
                    socket.setBroadcast(true);
                    socket.send(new DatagramPacket(packet, packet.length, InetAddress.getByName(address), targetPort));
                    socket.close();
                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "Wake packet sent", Toast.LENGTH_SHORT).show());
                } catch (Exception error) {
                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "Wake failed: " + error.getMessage(), Toast.LENGTH_LONG).show());
                }
            });
            return "sent";
        }
    }

    private String normalizeUrl(String value) {
        String url = value.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) url = "http://" + url;
        return url.replaceAll("/+$", "");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
