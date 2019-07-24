import calculateIp from "./calculator";

const $ip = document.getElementById('ip');
const $f = document.getElementById('ip-form');
const $result = document.getElementById('result');
$ip.onblur = $ip.onchange = $ip.onkeyup = updateIp;
$f.onsubmit = function (e) {
    e.preventDefault();
    updateIp();
}

const state = {};
function updateIp() {
    if ($ip.value === state.ip) return;

    const ip = state.ip = $ip.value;
    const information = calculateIp(ip);

    if (!information) {
        $result.textContent = '\n\nInvalid IP or unknown IP.';
        return;
    }

    const {
        ip: extIp,
        name,
        portStart,
        portEnd,
        sshPort,
    } = information;

    $result.textContent = formatText([
        ['Internal IP', ip],
        ['External IP', extIp],
        ['Location', name],
        ['Port (start)', portStart.toString()],
        ['Port (end)', portEnd.toString()],
        ['Port (ssh)', sshPort.toString()],
    ]);
}

function formatText(items) {
    const [aMax, bMax] = items.reduce(([aLen, bLen], [a, b]) => [Math.max(a.length, aLen), Math.max(b.length, bLen)], [0, 0]);
    return items.map(([a, b]) => padString(a, ' ', '', aMax) + '   ' + padString(b, '', ' ', bMax)).join('\n');
}

function padString(str, left, right, len) {
    while(str.length < len) {
        str = left + str + right;
    }

    return str;
}

[].forEach.call(document.getElementsByTagName('input'), i => i.disabled = false);

const hashIp = location.hash.slice(1);
if (hashIp) {
    $ip.value = hashIp;
}

setTimeout(updateIp);
