function submitForm() {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const formData = { email: email, password: password };

    fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.ok) {
                response.json().then((data) => {
                    console.log(response.data);
                });
                // handle successful login
            } else {
                document.getElementById("hints").innerHTML =
                    "Wrong Email or Password";
                // handle error
            }
        })
        .catch((error) => {
            document.getElementById("hints").innerHTML =
                "Server error try again";
            // handle error
        });
}

// register

document
    .getElementById("registration-form")
    .addEventListener("submit", submitForm);
function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("newPassword").value;
    const data = { name, email, password };
    console.log("REGISTERING user data");
    console.log(data);
    postData("/api/signup", data)
        .then((response) => {
            if (response.ok && response.status === 201) {
                window.location.href = "/home";
            } else {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error(error);
            // do something with the error, like displaying an error message
        });
}
async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
