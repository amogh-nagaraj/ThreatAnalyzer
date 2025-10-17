// popup.js

document.addEventListener('DOMContentLoaded', function() {
  var scanButton = document.getElementById('scanButton');
  var domainsInput = document.getElementById('domainsInput');
  var resultsDiv = document.getElementById('results');

  scanButton.addEventListener('click', function() {
    var domains = domainsInput.value.split('\n').map(domain => domain.trim()).filter(domain => domain !== '');
    if (domains.length === 0) {
      alert('Please enter at least one domain.');
      return;
    }

    resultsDiv.innerHTML = ''; // Clear previous results

    domains.forEach(function(domain) {
      chrome.runtime.sendMessage({ action: "scanDomain", domain: domain }, function(response) {
        if (response.success) {
          displayResult(domain, response.result);
        } else {
          displayResult(domain, { error: response.error });
        }
      });
    });
  });

  function displayResult(domain, result) {
    var resultDiv = document.createElement('div');
    resultDiv.classList.add('result');
    resultDiv.innerHTML = `<strong>${domain}</strong>: `;
    if (result.error) {
      resultDiv.innerHTML += `Error: ${result.error}`;
    } else {
      resultDiv.innerHTML += `Malicious score: ${result.data.attributes.last_analysis_stats.malicious}`;
    }
    resultsDiv.appendChild(resultDiv);
  }
});
