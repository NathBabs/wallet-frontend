  const BASE_URL = "http://localhost:1337"
  // Toggle between sign up and sign in modes
  $('#signin-text').click(function() {
    $('#balance-field').hide(); // Hide the balance field
    $('#balance-field').removeAttr('required'); // Hide the balance field
    $('#signup-form h3').text('Sign In'); // Change the heading
    });
  $('#signup-text').click(function() {
    $('#balance-field').show(); // Show the balance field
    $('#balance-field').attr('required', true); // Hide the balance field
    $('#signup-form h3').text('Sign Up'); // Change the heading
  });

  const jwt = localStorage.getItem('jwt')
  $('#signup-form').submit(function(event) {
  event.preventDefault(); // Prevent the form from being submitted

  // if there is an active jwt, redirect to home page
  if(jwt != null) {
    window.location.href = './home/home.html'
  }

  // Check the form's mode
  if ($('#balance-field').is(':visible')) {
    // Send a request to the sign up endpoint
    $.ajax({
      url: `${BASE_URL}/wallet/register`,
      type: 'POST',
      data: {
        email: $('#email').val(),
        password: $('#password').val(),
        balance: $('#balance').val()
      },
      success: function(response) {
        if(response?.data){
          localStorage.setItem("jwt", response.data.token);
          localStorage.setItem("userId", response.data.user.id)
        }
        Swal.fire({
          text: response['message'],
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          window.location.href = './home/home.html';
        });
      },
      error: function(error) {
        Swal.fire({
         text: error.responseJSON.message || 'Something went wrong, could not create your account',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  } else {
    // Send a request to the sign in endpoint
    $.ajax({
      url: `${BASE_URL}/wallet/login`,
      type: 'POST',
      data: {
        email: $('#email').val(),
        password: $('#password').val()
      },
      success: function(response) {
        if(response?.data){
          localStorage.setItem("jwt", response.data.token);
          localStorage.setItem("userId", response.data.userId)
        }
        Swal.fire({
          text: response['message'],
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          window.location.href = './home/home.html';
        })
      },
      error: function(error) {
        Swal.fire({
          text: error.responseJSON.message || 'Something went wrong, could not login',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    });
  }
});

