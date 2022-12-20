// JavaScript for the page
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
});

$(document).ready(function() {
  // Set the balance in the page to the value in local storage
  $('#balance').text(localStorage.getItem('balance'));

  // Attach a click event listener to the withdraw button
  $('#withdraw-button').click(function() {
    // Get the amount from the input field
    const amount = $('#amount').val();

    // Send a POST request to the /wallet/withdraw endpoint with the amount as a query param
    fetch(`${BASE_URL}/wallet/withdraw?amount=${amount}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    })
      .then(response => response.json())
      .then(response => {
        if (response.success === true) {
          // Update the balance in local storage
          localStorage.setItem('balance', response.data.balance);
          // Update the balance in the page
          $('#balance').text(response.data.balance);
          // Show a success message
          M.toast({html: 'Withdrawal successful'});
        } else {
          // Show an error message
          M.toast({html: response.error || 'Something went wrong, could not process withdrawal'});
        }
      });
  });
});
