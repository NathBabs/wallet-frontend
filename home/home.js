
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
  });

  // Retrieve account balance on page load
  $(document).ready(function() {
    // Get JWT from local storage
    const jwt = localStorage.getItem('jwt');
    const balance = localStorage.getItem('balance');

    // Show the preloader
    $('#preloader').show();
    $('#balance-text').hide();

    if(balance != null) {
      $('#preloader').hide();
      $('#balance-text').show();
      $('#balance').text(balance);
      return;
    }

    $.ajax({
      url: `${BASE_URL}/wallet/balance`,
      type: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      success: function(response) {
        localStorage.setItem('balance', response.balance);
        // Show the preloader
        $('#preloader').hide();
        $('#balance-text').show();
        $('#balance').text(response.balance);
      },
      error: function(error) {
        console.log(error);
        if(error?.responseJSON?.message === "expired") {
          M.toast({ html: 'Session expired!' });
          window.local.href = '../index.html'
        };

        const errorMessage = error?.responseJSON?.message || 'Something went wrong, could not get account balance';
        M.toast({ html: `${errorMessage}!`});
      }
    });
  });

