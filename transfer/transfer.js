const BASE_URL = "http://localhost:1337"

$('.fixed-action-btn').floatingActionButton({
    direction: 'top',
    hoverEnabled: false
  });

// Initialize tooltips on FABs
$(document).ready(function() {
  $('.tooltipped').tooltip({
    delay: 1000
  });
  // Set the balance in the page to the value in local storage
  $('#balance').text(localStorage.getItem('balance'));
});

$(document).ready(function() {
    $('#transfer-form').validate({
      rules: {
        recipient: {
          required: true,
          minlength: 1
        },
        amount: {
          required: true,
          min: 1
        }
      },
      messages: {
        recipient: {
          required: "Please enter a recipient's account number",
          minlength: "Please enter a valid account number"
        },
        amount: {
          required: "Please enter an amount to transfer",
          min: "Please enter a valid amount"
        }
      },
      submitHandler: function(form) {
        // Get values from form fields
        const recipient = $('#recipient').val();
        const amount = $('#amount').val();

        // Get JWT from local storage
        const jwt = localStorage.getItem('jwt');

        // Make a POST request to the /wallet/transfer endpoint
        $.ajax({
          url: `${BASE_URL}/wallet/transfer`,
          type: 'POST',
          data: {
            to: recipient,
            amount: amount
          },
          headers: {
            'Authorization': `Bearer ${jwt}`
          },
          success: function(response) {
            // update balance in local storage
            localStorage.setItem('balance', response?.data?.balance);
            // Display a success message
            M.toast({ html: 'Transfer successful' });
            // Clear form fields
            $('#transfer-form')[0].reset();
          },
          error: function(error) {
            const errorMessage = error?.message || 'Something went wrong, could not complete transfer'
            // Display an error message
            M.toast({ html: errorMessage });
          }
        });
      }
    });
  });