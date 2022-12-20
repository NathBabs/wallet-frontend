const fabMenu = document.createElement('div');

fabMenu.innerHTML = `
    <div class="fixed-action-btn sidenav-trigger">
      <a href="#" data-target="slide-out" class="btn-floating btn-large blue">
        <i class="material-icons">menu</i>
      </a>
      <ul id="slide-out">
        <li><a href="../deposit/deposit.html" class="btn-floating orange tooltipped" data-tooltip="Deposit"><i class="material-icons">monetization_on</i></a></li>
        <li><a href="../withdraw/withdraw.html" class="btn-floating red tooltipped" data-tooltip="Withdraw"><i class="material-icons">money_off</i></a></li>
        <li><a href="../transfer/transfer.html" class="btn-floating green tooltipped" data-tooltip="Transfer"><i class="material-icons">swap_horizontal_circle</i></a></li>
        <li><a href="../transactionhistory/transactionhistory.html" class="btn-floating brown tooltipped" data-tooltip="Transaction History"><i class="material-icons">history</i></a></li>
        <li><a href="#!" class="btn-floating grey tooltipped" onclick="logout()" data-tooltip="Logout"><i class="material-icons">exit_to_app</i></a></li>
        <li><a href="../home/home.html" class="btn-floating purple tooltipped" data-tooltip="Home"><i class="material-icons">home</i></a></li>
      </ul>
    </div>
    `;

document.body.appendChild(fabMenu);

function logout() {
  // get JWT from local storage
  const jwt = localStorage.getItem('jwt')

  // Send logout request to server
  $.ajax({
    url: `${BASE_URL}/wallet/logout`,
    type: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`
    },
    success: function() {
      // remove jwt
      localStorage.removeItem('jwt');
      localStorage.removeItem('userId');
      localStorage.removeItem('balance');
      // Redirect to login page
      window.location.href = '../index.html';
    },
    error: function(error) {
      console.log(error);
      Swal.fire({
        text: error?.responseJSON?.message || 'Something went wrong, could not complete logout process',
        icon: 'error',
        confirmButtonText: 'OK'
      }) 
    }
  });
}