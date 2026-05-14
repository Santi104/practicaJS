document.addEventListener("DOMContentLoaded", () => {

    let username = document.getElementById("name");
    let lastName = document.getElementById("lastName");
    let phone = document.getElementById("phone");
    let city = document.getElementById("city");
    let address = document.getElementById("address");
    let list = document.getElementById("list");
    let addBttn = document.getElementById("add-btton");
    let removeBtn = document.getElementById("remove");
    let checkFemale = document.getElementById("female");
    let checkMale = document.getElementById("male");
    let spinner = document.getElementById("spinnerOverlay");

    let contacts = [];
    let editId = null;

    const API_URL = "/api/contacts";

    checkFemale.addEventListener("change", () => {
        if (checkFemale.checked) checkMale.checked = false;
    });

    checkMale.addEventListener("change", () => {
        if (checkMale.checked) checkFemale.checked = false;
    });

    function showSpinner() {
        spinner.classList.remove("hidden");
    }

    function hideSpinner() {
        spinner.classList.add("hidden");
    }

    async function getContacts() {

        showSpinner();

        try {

            const response = await fetch(API_URL);

            contacts = await response.json();

            renderContacts();

        } catch (error) {

            console.error(error);

        } finally {

            hideSpinner();
        }
    }

    function renderContacts() {

        list.innerHTML = "";

        contacts.forEach((c) => {

            const li = document.createElement("li");
            li.className = "contact-item";

            const contact_div = document.createElement("div");
            contact_div.className = "contact-div";

            const userIcon = document.createElement("i");

            userIcon.textContent =
                c.gender === "female" ? "👩" : "👤";

            const textSpan = document.createElement("span");

            textSpan.textContent =
                `${c.name} ${c.lastName} - ${c.city}`;

            contact_div.appendChild(userIcon);
            contact_div.appendChild(textSpan);

            const div_bttons = document.createElement("div");
            div_bttons.className = "div_bttons";

            const editBtn = document.createElement("button");

            editBtn.textContent = "✏️";

            editBtn.addEventListener("click", () => {

                username.value = c.name;
                lastName.value = c.lastName;
                phone.value = c.phone;
                city.value = c.city;
                address.value = c.address;

                checkFemale.checked = c.gender === "female";
                checkMale.checked = c.gender === "male";

                editId = c.id;
            });

            const deleteBtn = document.createElement("button");

            deleteBtn.textContent = "🗑️";

            deleteBtn.addEventListener("click", async () => {

                try {

                    await fetch(`${API_URL}/${c.id}`, {
                        method: "DELETE"
                    });

                    getContacts();

                } catch (error) {

                    console.error(error);
                }
            });

            div_bttons.appendChild(editBtn);
            div_bttons.appendChild(deleteBtn);

            li.appendChild(contact_div);
            li.appendChild(div_bttons);

            list.appendChild(li);
        });
    }

    async function saveContact() {

        if (
            username.value === "" ||
            lastName.value === "" ||
            phone.value === "" ||
            city.value === "" ||
            address.value === ""
        ) {
            return;
        }

        const contact = {
            name: username.value,
            lastName: lastName.value,
            phone: phone.value,
            city: city.value,
            address: address.value,
            gender: checkFemale.checked ? "female" : "male"
        };

        try {

            if (editId !== null) {

                await fetch(`${API_URL}/${editId}`, {

                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(contact)
                });

                editId = null;

            } else {

                await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(contact)
                });
            }

            clearForm();

            getContacts();

        } catch (error) {

            console.error(error);
        }
    }

    async function removeLast() {

        if (contacts.length === 0) return;

        const lastContact = contacts[contacts.length - 1];

        try {
            await fetch(`${API_URL}/${lastContact.id}`, {
                method: "DELETE"
            });

            getContacts();

        } catch (error) {

            console.error(error);
        }
    }

    function clearForm() {

        username.value = "";
        lastName.value = "";
        phone.value = "";
        city.value = "";
        address.value = "";

        checkFemale.checked = false;
        checkMale.checked = false;
    }

    addBttn.addEventListener("click", (e) => {

        e.preventDefault();

        saveContact();
    });

    removeBtn.addEventListener("click", removeLast);
    getContacts();
});