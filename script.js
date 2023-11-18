//test@sunbasedata.com Test@123


function saveAuthToken(access_token) {
  localStorage.setItem('access_token', access_token);
}

function getAuthToken() {
  return localStorage.getItem('access_token');
}

function authenticateUser(event) {
  event.preventDefault();
  const login_id = document.getElementById("login_id").value;
  const password = document.getElementById("password").value;
  const authentication_url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp";
  const request_data = {
    login_id,
    password,
  };
  fetch(authentication_url, {
    method: 'POST',
    body: JSON.stringify(request_data)
  })
    .then(response => {
      console.log("response", response.body);
      if (response.status === 500) {
        alert("Invalid login id or password");
        return
      }
      // console.log(response.json(), "123")
      // return response.json()
      return response
    }).then(data => {
      console.log("data", data.json());
      saveAuthToken(data.access_token)
      window.location.href = "home.html";

    });
};

function getCustomers() {
  const access_token = getAuthToken();
  if (!access_token) {
    alert('Not Authenticated');
    return;
  }
  // const fetch_customers_url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list";
  // var headers = new Headers();
  // headers.append("Authorization", `Bearer ${access_token}`);
  // // headers.append("Access-Control-Allow-Origin", "*")
  // // headers.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  // // headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  // fetch(fetch_customers_url, {
  //   method: 'GET',
  //   headers,
  //   redirect: 'follow'
  // })
  // .then(response => { return response.json() })
  return [
    {
        "uuid": "test044b3d919bf34911aa8f8b20b7cc2d5c",
        "first_name": "sari entries delete mat kr bhai",
        "last_name": "please, testing krne de",
        "street": "",
        "address": "",
        "city": "",
        "state": "",
        "email": "",
        "phone": ""
    },
    {
        "uuid": "test271a06b763e9490f8c761084f39faaae",
        "first_name": "Jane",
        "last_name": "Doe",
        "street": "Elvnu Street",
        "address": "H no 2",
        "city": "Delhi",
        "state": "Delhi",
        "email": "sam@gmail.com",
        "phone": "12345678"
    },
    {
        "uuid": "test5d14e6d9937a49b4ba577822c13dbdbf",
        "first_name": "Jane",
        "last_name": "Doe",
        "street": "Elvnu Street",
        "address": "H no 2",
        "city": "Delhi",
        "state": "Delhi",
        "email": "sam@gmail.com",
        "phone": "12345678"
    }
]
}


function displayCustomerTable(data) {
  const table = document.createElement('table');
  table.border = '1';

  // Create header row
  const headerRow = table.insertRow(0);
  for (const key in data[0]) {
    if (data[0].hasOwnProperty(key)) {
      const headerCell = document.createElement('th');
      headerCell.innerHTML = key;
      headerRow.appendChild(headerCell);
    }
  }

  // Add columns for the Actions (Edit and Delete)
  const actionsHeaderCell = document.createElement('th');
  actionsHeaderCell.innerHTML = 'Actions';
  headerRow.appendChild(actionsHeaderCell);

  // Create data rows with Edit and Delete buttons
  for (let i = 0; i < data.length; i++) {
    const dataRow = table.insertRow(i + 1);

    for (const key in data[i]) {
      if (data[i].hasOwnProperty(key)) {
        const cell = dataRow.insertCell(-1);
        cell.innerHTML = data[i][key];
      }
    }

    const actionsCell = dataRow.insertCell(-1);

    // Edit button
    const editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.onclick = function () {
      const uuid = data[i].uuid;
      editCustomer(uuid);
    };
    actionsCell.appendChild(editButton);

    // Delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.onclick = function () {
      const uuid = data[i].uuid;
      deleteCustomer(uuid);
    };
    actionsCell.appendChild(deleteButton);
  }

  document.getElementById('customer_data').appendChild(table);
}

// Add a function to redirect to add_customer.html
function redirectToAddCustomer() {
  window.location.href = "add_customer.html";
}


document.addEventListener('DOMContentLoaded', function () {
  // Fetch the UUID from the query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get('uuid');

  // Fetch customer details for the given UUID
  const customer = getCustomerDetails(uuid);

  // Populate the form with existing customer details
  document.getElementById('first_name').value = customer.first_name || '';
  document.getElementById('last_name').value = customer.last_name || '';
  document.getElementById('street').value = customer.street || '';
  document.getElementById('address').value = customer.address || '';
  document.getElementById('city').value = customer.city || '';
  document.getElementById('state').value = customer.state || '';
  document.getElementById('email').value = customer.email || '';
  document.getElementById('phone').value = customer.phone || '';

  // Add event listener for form submission
  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Get updated customer details from the form
      const updatedCustomer = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        street: document.getElementById('street').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
      };

      // Call the updateCustomer function
      updateCustomer(uuid, updatedCustomer);
    });
  }

  const addCustomerForm = document.getElementById('addCustomerForm');
  if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', function (event) {
      event.preventDefault();
      // Get the data from the form
      const newCustomerData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        street: document.getElementById('street').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
      };

      // Call a function to add the new customer
      addCustomer(newCustomerData);
    });
  }
});

function updateCustomer(uuid, updatedCustomer) {
  const url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
  const token = getAuthToken(); // Replace with the actual token

  $.ajax({
    type: "POST",
    url: url,
    headers: {
      "Authorization": "Bearer " + token
    },
    data: {
      cmd: "update",
      uuid: uuid,
      ...updatedCustomer
    },
    success: function(response) {
      if (response === "200, Successfully Updated") {
        alert("Customer updated successfully!");
        // Redirect back to home.html after successful update
        window.location.href = "home.html";
      } else if (response === "500, UUID not found") {
        alert("UUID not found");
      } else if (response === "400, Body is Empty") {
        alert("Update failed: Body is empty");
      } else {
        alert("Error: Customer not updated");
      }
    },
    error: function() {
      alert("Error: Customer not updated");
    }
  });
}

function addCustomer(newCustomerData) {
  const url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
  const token = getAuthToken(); // Replace with the actual token

  // Check if mandatory fields are present
  if (!newCustomerData.first_name || !newCustomerData.last_name) {
    alert('Error: First Name or Last Name is missing');
    return;
  }

  // Make a POST request to add the new customer
  $.ajax({
    type: "POST",
    url: url,
    headers: {
      "Authorization": "Bearer " + token
    },
    data: {
      cmd: "create",
      ...newCustomerData
    },
    success: function(response) {
      if (response === "201, Successfully Created") {
        alert("Customer created successfully!");
        // Redirect back to home.html after successful creation
        window.location.href = "home.html";
      } else if (response === "400, First Name or Last Name is missing") {
        alert("Error: First Name or Last Name is missing");
      } else {
        alert("Error: Customer not created");
      }
    },
    error: function() {
      alert("Error: Customer not created");
    }
  });
}


function getCustomerDetails(uuid) {
  // Fetch customer details for the given UUID from your API
  // Replace this with your actual API call
  // For simplicity, returning sample data
  return {
    "uuid": uuid,
    "first_name": "Sample",
    "last_name": "Customer",
    "street": "123 Main Street",
    "address": "Apt 4B",
    "city": "Anytown",
    "state": "CA",
    "email": "sample@email.com",
    "phone": "123-456-7890"
  };
}

