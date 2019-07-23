function invalidIpPart(part) {
	return part <= 0 || part > 255;
}

const locations = ['Germany', 'Canada', 'Bulgaria', 'Pennsylvania', 'Finland'];
const database = {
	10: '88.198.50.201',
	12: '148.251.3.246',
	20: '192.99.148.130',
	30: '82.118.234.154',
	40: '199.187.125.84',
	42: '76.72.171.42',
	50: '95.216.20.157',
};

function calculateIp(internal) {
	const ipParts = internal.match(/^10\.10\.(\d{1,3})\.(\d{1,3})$/);
	if (!ipParts) {
		return;
	}

	const serverIdInfo = parseInt(ipParts[1], 10);
	const serverAddr = parseInt(ipParts[2], 10);

	if (invalidIpPart(serverIdInfo) || invalidIpPart(serverAddr)) {
		return;
	}

	const serverId = serverIdInfo & ~1;
	const highPort = (serverIdInfo & 1);

    const ip = database[serverId];
    if (!ip) return;

	const serverNameIndex = ((serverIdInfo / 10)|0) - 1;

	const portStart = highPort * 30 + serverAddr * 100;
	const portEnd = portStart + 19;
	const sshPort = portEnd + 1;
	
	return {
        ip,
        name: locations[serverNameIndex],
		portStart,
		portEnd,
		sshPort,
	};
}

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
