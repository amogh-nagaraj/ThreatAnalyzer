// Function to convert table data to CSV format
function convertTableToCSV(table) {
  var csv = [];
  var rows = table.querySelectorAll('tr');
  
  for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll('td, th');
    
    for (var j = 0; j < cols.length; j++) 
      row.push(cols[j].innerText);
    
    csv.push(row.join(','));
  }
  return csv.join('\n');
}

// Function to download CSV file
function downloadCSV(csv, filename) {
  var csvFile = new Blob([csv], { type: 'text/csv' });

  if (window.navigator.msSaveOrOpenBlob) { // IE10+
    window.navigator.msSaveOrOpenBlob(csvFile, filename);
  } else { // Others
    var downloadLink = document.getElementById('exportCsvLink');
    
    // Remove existing download link if it exists
    if (downloadLink) {
      document.body.removeChild(downloadLink);
    }

    // Create new download link
    downloadLink = document.createElement('a');
    downloadLink.id = 'exportCsvLink';
    downloadLink.href = URL.createObjectURL(csvFile);
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    
    // Click the download link to initiate download
    downloadLink.click();
  }
}

// Event listener for Export to CSV button
document.addEventListener('DOMContentLoaded', function() {
  var exportCsvButton = document.getElementById('exportCsvButton');
  if (exportCsvButton) {
    exportCsvButton.addEventListener('click', function() {
      var table = document.getElementById('resultsTable');

      // Convert table to CSV format
      var csv = convertTableToCSV(table);

      // Prompt user to save or download CSV file
      var filename = 'table_export.csv';
      downloadCSV(csv, filename);
    });
  }
});
