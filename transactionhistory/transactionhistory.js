const BASE_URL = "http://localhost:1337";
const jwt = localStorage.getItem('jwt');


$('.fixed-action-btn').floatingActionButton({
    direction: 'top',
    hoverEnabled: false
  });

// Initialize tooltips on FABs
$(document).ready(function() {
  $('.tooltipped').tooltip({
    delay: 1000
  });
});

 //Initialize the modal
  $(document).ready(function() {
    $('.modal').modal();
  });

// Attach event listeners
  $(document).ready(function() {
    $('#refund-button').click(handleRefundButtonClick);
  });

$(document).ready(function() {
  if(jwt == null) {
    M.toast({
      html : "Session expired. Please sign in",
      displayLength: 3000,
      completeCallback: function (){
        window.location.href = '../index.html'
    }})
    return;
  }
  fetchTransactionHistory();
});


/**
 * Fetches a transaction history.
 */
function fetchTransactionHistory() {
  fetch(`${BASE_URL}/wallet/history`, {
    headers: {
      'Authorization': `Bearer ${jwt}`
    }
  })
    .then(response => response.json())
    .then(response => {
      if (response.success === true) {
        // Use the "createTransactionHistoryTable" function to parse the response
        createTransactionHistoryTable(response.data.transactions);
      } else {
        // alert('Error: ' + response.error);
        const errorMessage = response.error || 'Something went wrong, could not fetch transactions'
        M.toast({html: errorMessage})
      }
    });
}


/**
 * Creates a transaction history table for transaction history
 *
 * @param  {Array}  transactions  The transactions
 */
function createTransactionHistoryTable(transactions) {
    // Create the table element
    const table = $('<table>').addClass('centered');

    // Create the table header
    const headerRow = $('<tr>');
    const txRefHeader = $('<th>').text('Transaction Reference');
    const amountHeader = $('<th>').text('Amount');
    const dateHeader = $('<th>').text('Date');
    headerRow.append(txRefHeader);
    headerRow.append(amountHeader);
    headerRow.append(dateHeader);
    table.append(headerRow);

    // Add a row for each transaction
    transactions.forEach(transaction => {
      const row = $('<tr>');
      const txRefCell = $('<td>').text(transaction.txRef);
      const amountCell = $('<td>').text(transaction.amount);
      const dateCell = $('<td>').text(transaction.created_at);
      row.append(txRefCell);
      row.append(amountCell);
      row.append(dateCell);

      // Add a click event listener to the row to show the transaction details
      row.click(() => showTransactionDetails(transaction));

      table.append(row);
    });

    // Append the table to the page
    $('#transaction-history').append(table);
  }


  /**
   * Shows the transaction details in a modal
   *
   * @param {{}}  transaction  The transaction
   */
  function showTransactionDetails(transaction) {
    // Create the table element
    const table = $('<table>').addClass('highlight');
    // Display the transaction details in the modal
    // $('#transaction-details').text(JSON.stringify(transaction, null, 2));
     
    // Add a row for each property in the transaction object
    for (const prop in transaction) {
      // do not display updated_at field
      if (prop !== 'updated_at'){
        const row = $('<tr>');
        const propCell = $('<td>').text(prop);
        const valueCell = $('<td>').text(transaction[prop]);
        row.append(propCell);
        row.append(valueCell);
        table.append(row);}
    }

    // Clear the transaction details element and append the table to it
    $('#transaction-details').empty().append(table);

    // Check if the user is allowed to refund the transaction
    const userId = localStorage.getItem('userId');
    if (userId == transaction.receiverId) {
      $('#refund-button').removeClass('disabled');
    } else {
      $('#refund-button').addClass('disabled');
    }

    // Show the modal
    $('#transaction-details-modal').modal('open');
  }


  /**
   * Function to handle the refund button click
   *
   * @param {event}  event   The event
   */
  function handleRefundButtonClick(event) {
    // Get the transaction reference from the modal
    const table = $('#transaction-details-modal').find('table');
    const datas = table.find('td');
    const txRef = datas[3].innerHTML

    // Make a request to the server to refund the transaction
    fetch(`${BASE_URL}/wallet/refund`, {
      method: 'POST',
      body: JSON.stringify({ txRef }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }
    })
      .then(response => response.json())
      .then(response => {
        // Check if the refund was successful
        if (response.success === true) {
          M.toast({ html: 'Transaction refunded successfully!' });
        } else {
          const errorMessage = response?.error || 'Something went wrong, could not complete refund'
          M.toast({ html: errorMessage });
        }
      });
  }

/**
 * format date to human readable form
 *
 * @param {Date}  date  The date
 */
function formatDate(date) {
  // Get the created_at date from the transaction object
const createdAt = new Date(date);

// Get the day of the month (1-31)
const day = createdAt.getDate();

// Get the month (0-11) and convert it to a string (e.g. "January")
const month = createdAt.toLocaleString('default', { month: 'long' });

// Get the full year (e.g. 2022)
const year = createdAt.getFullYear();

// Get the hours (0-23) and minutes (0-59)
const hours = createdAt.getHours();
const minutes = createdAt.getMinutes();

// Format the date string
return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

