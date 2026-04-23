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

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

function showSpinner() {
    spinner.classList.remove("hidden");
}

function hideSpinner() {
    spinner.classList.add("hidden");
}

checkFemale.addEventListener("change", () => {
    if (checkFemale.checked) checkMale.checked = false;
});

checkMale.addEventListener("change", () => {
    if (checkMale.checked) checkFemale.checked = false;
});

function saveToLocalStorage() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function renderContacts() {
    list.innerHTML = "";

    contacts.forEach((c, index) => {
        const li = document.createElement("li");
        li.className = "contact-item";

        const contact_div = document.createElement("div");
        contact_div.className = "contact-div";

        const userIcon = document.createElement("i");
        userIcon.textContent = c.gender === "female" ? "👩" : "👤";

        const textSpan = document.createElement("span");
        textSpan.textContent = `${c.name} ${c.lastName} - ${c.city}`;

        contact_div.appendChild(userIcon);
        contact_div.appendChild(textSpan);

        const div_bttons = document.createElement("div");
        div_bttons.className = "div_bttons";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";

        deleteBtn.addEventListener("click", () => {
            contacts.splice(index, 1);
            saveToLocalStorage();
            renderContacts();
        });

        div_bttons.appendChild(deleteBtn);

        li.appendChild(contact_div);
        li.appendChild(div_bttons);

        list.appendChild(li);
    });
}

function add() {
    if (
        username.value === "" ||
        lastName.value === "" ||
        phone.value === "" ||
        city.value === "" ||
        address.value === ""
    ) {
        return;
    }

    showSpinner();

    setTimeout(() => {
        const contact = {
            name: username.value,
            lastName: lastName.value,
            phone: phone.value,
            city: city.value,
            address: address.value,
            gender: checkFemale.checked ? "female" : "male"
        };

        contacts.push(contact);
        saveToLocalStorage();
        renderContacts();

        username.value = "";
        lastName.value = "";
        phone.value = "";
        city.value = "";
        address.value = "";

        checkFemale.checked = false;
        checkMale.checked = false;

        hideSpinner();
    }, 700);
}

function remove() {
    contacts.pop();
    saveToLocalStorage();
    renderContacts();
}

addBttn.addEventListener("click", (e) => {
    e.preventDefault();
    add();
});

removeBtn.addEventListener("click", remove);

showSpinner();
setTimeout(() => {
    renderContacts();
    hideSpinner();
}, 500);

});