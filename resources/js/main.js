const DEFAULT_BUNDLE_ID = 'it.pagopa.app.io';
const DEFAULT_PAYLOAD = {
    aps: {
        alert: 'Push Notifications Test',
        sound: 'default',
        badge: 1,
    },
};

class PNTarget {
    uuid = null;
    payload = null;
    bundleId = null;
    constructor(bundleId, payload) {
        this.payload = payload;
        this.bundleId = bundleId;
    }
    getCommand() {
        if (this.uuid && this.payload && this.bundleId) {
            return `printf '${JSON.stringify(this.payload, undefined, 2)}' |
          xcrun simctl push ${this.uuid} ${this.bundleId} -`;
        }
        return null;
    }
}
const target = new PNTarget(DEFAULT_BUNDLE_ID, DEFAULT_PAYLOAD);

/**
 * Reload available devices via command line. Update the UI with the new output.
 */
function updateDevices() {
    Neutralino.os
        .execCommand('xcrun simctl list devices')
        .then((output) => output.stdOut || stdErr)
        .then((info) => {
            return info
                .split('    ')
                .filter((s) => /^\w+/iu.test(s))
                .flatMap((s) => {
                    const match =
                        /(.*)\s+\((\w{8}-\w{4}-\w{4}-\w{4}-\w{12})\)\s*\((\w+)+\).*$/imu.exec(s);
                    if (match === null) {
                        return [];
                    }
                    const [_, name, uuid, status] = match;
                    return [{ name, uuid, status }];
                })
                .reduce(
                    (acc, info) => {
                        if (/booted/i.test(info.status)) {
                            acc.booted.push(info);
                        } else {
                            acc.shutdown.push(info);
                        }
                        return acc;
                    },
                    { booted: [], shutdown: [] },
                );
        })
        .then(({ booted, shutdown }) => {
            const bootedHtml = booted
                .map(
                    ({ name, uuid }) =>
                        `<li id="${uuid}" onclick="selectDevice(event, '${uuid}')">${name}</li>`,
                )
                .join('');
            document.getElementById('bootedDevices').innerHTML = bootedHtml;
            const shutdownHtml = shutdown
                .map(
                    ({ name, uuid }) =>
                        `<li id="${uuid}" onclick="selectDevice(event, '${uuid}')">${name}</li>`,
                )
                .join('');
            document.getElementById('shutdownDevices').innerHTML = shutdownHtml;
        })
        .catch((e) => console.error(e));
}

function selectDevice(event, uuid) {
    target.uuid = uuid;
}

function setBundleId(event) {
    target.bundleId = event.target.value;
}

function setPayload(event) {
    try {
        const nextPayload = event.target.value;
        target.payload = JSON.parse(nextPayload);
    } catch (e) {
        console.log(e);
    }
}

function sendNotification() {
    const command = target.getCommand();
    console.log('command', command);
    if (command) {
        Neutralino.os
            .execCommand(command)
            .then(({ exitCode, stdErr }) => {
                if (exitCode !== 0) {
                    document.getElementById('statusBar').innerHTML = stdErr;
                } else {
                    document.getElementById('statusBar').innerHTML = 'done';
                }
            })
            .catch((error) => {
                console.error(error);
                Neutralino.os.showNotification('Oops :/', error, 'ERROR');
            });
    }
}

function setTray() {
    if (NL_MODE != 'window') {
        console.log('INFO: Tray menu is only available in the window mode.');
        return;
    }
    let tray = {
        icon: '/resources/icons/trayIcon.png',
        menuItems: [
            { id: 'VERSION', text: 'Get version' },
            { id: 'SEP', text: '-' },
            { id: 'QUIT', text: 'Quit' },
        ],
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch (event.detail.id) {
        case 'VERSION':
            Neutralino.os.showMessageBox(
                'Version information',
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`,
            );
            break;
        case 'QUIT':
            Neutralino.app.exit();
            break;
    }
}

function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();
Neutralino.window.setSize({
    width: 600,
    height: 800,
});
Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked);
Neutralino.events.on('windowClose', onWindowClose);

if (NL_OS != 'Darwin') {
    // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}

updateDevices();
document.getElementById('bundleId').value = DEFAULT_BUNDLE_ID;
document.getElementById('notificationPayload').value = JSON.stringify(
    DEFAULT_PAYLOAD,
    undefined,
    2,
);
// setInterval(updateDevices, 2000);
