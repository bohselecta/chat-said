# Deployment

## Development or personal desktop

Run `scripts/start.sh` or `scripts/start.ps1` from the repository.

## Old laptop appliance

1. Install a mainstream minimal Linux distribution with Node.js 22.
2. Copy the repository to `/opt/chatsaid-taurus`.
3. Create a `taurus` system user.
4. Create `/var/lib/chatsaid-taurus` owned by that user.
5. Copy `deploy/systemd/chatsaid-taurus.service` to `/etc/systemd/system/`.
6. Run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now chatsaid-taurus
```

7. Configure automatic login or a terminal dashboard shortcut only if desired. Forge itself is headless and serves the full UI over the LAN.

## Windows automatic startup

Use Task Scheduler to run:

```powershell
powershell.exe -ExecutionPolicy Bypass -File C:\path\to\chatsaid-taurus\scripts\start.ps1
```

Trigger: at startup or user logon. Configure Wake-on-LAN in firmware and the network adapter if the machine should be wakeable.

## Phone access

The served UI is responsive. For reliable microphone capture over an HTTP LAN origin, install the Android wrapper from `apps/pocket-android`. It can discover `_chatsaid-taurus._tcp` services through Android NSD, connect manually by LAN URL, and send Wake-on-LAN directly from the phone.
