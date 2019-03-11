let interval;

document.addEventListener('DOMContentLoaded', () => {
    getClientId();
    interval = setInterval(getClientId, 1000);
});

function getClientId() {
    chrome.runtime.sendMessage({ cmd: "request-client-id" }, (response) => {
        if (response.result) {
            document.getElementById("noClientId").style.display = "none";
            document.getElementById("hasClientId").style.display = "block";

            document.getElementById('launch').href = "auryo://launch?client_id=" + response.result;
            clearInterval(interval);
        }
    });
}