//  Import axios
// const axios = require('axios');

//  Implement functionality to change active state of the sidebar
const sideBarLinks = document.querySelectorAll('.sidebar-link');
const displayContainers = document.querySelectorAll('.display-container');

sideBarLinks.forEach((link) => {
    link.addEventListener('click', () => {
        sideBarLinks.forEach((link) => {
            link.classList.remove('active');
        });
        link.classList.add('active');

        if (link.dataset.target == "movers") {
            getAllServiceProviders();
        }

        if (link.dataset.target == "bookings") {
            getAllBookings();
        }

        const target = link.dataset.target;
        displayContainers.forEach((container) => {
            container.style.display = 'none';
            if (container.id === target) {
                container.style.display = 'block';
            }
        });
    })
});

// //  Update user profile information
// const updateProfileForm = document.querySelector('#update-profile-form');
// const updateProfileButton = document.querySelector('.update');

// updateProfileButton.addEventListener('click', async(e) => {
//     e.preventDefault();

//     const firstName = document.querySelector('#first_name').value;
//     const lastName = document.querySelector('#last_name').value;
//     const email = document.querySelector('#email').value;
//     const phone = document.querySelector('#phone').value;
//     const password = document.querySelector('#password').value;
//     const id = document.querySelector('#user_id').value;

//     try {
//         await post(`http://localhost:3000/app/client/update${id}`, {
//             first_name: firstName,
//             last_name: lastName,
//             email: email,
//             phone: phone,
//             password: password,
//             id: id
//         });

//         window.location.href = `/app/client/dashboard/${id}`;
//     } catch (error) {
//         console.error(error);
//     }
// })


// GET ALL RELOCATION SERVICE PROVIDERS

function getAllServiceProviders() {
    const moversContainer = document.querySelector('.movers-container');
    const client_id = document.getElementById('client-id').dataset.id;
    moversContainer.innerHTML = "";
    
    fetch('http://localhost:3000/app/client/providers')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                moversContainer.innerHTML = "<p>No service providers available at the moment.</p>";
            } else {
                moversContainer.innerHTML = data.map(mover => {
                    return `
                    <div class="mover">
                        <h3>${mover.first_name} ${mover.last_name} (${mover.company_name || ''})</h3>
                        <p>${mover.email}</p>
                        <p>${mover.phone_number}</p>
                        <div class="mover-services">
                            ${mover.services.map(service => {
                                return `
                                <hr>
                                <div class="service">
                                    <p><span>Service Name: </span>${service.service_name}</p>
                                    <p><span>Description: </span>${service.description}</p>
                                    <p><span>Price: </span>${service.price}</p>
                                    <p><span>Service Area: </span>${service.service_area}</p>
                                </div>
                                `;
                            }).join('')}
                        </div>
                        <button class="book"><a href="http://localhost:3000/app/client/${client_id}/booking/${mover.id}" target="_blank">Book</a></button>
                    </div>
                    `;
                }).join('');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            moversContainer.innerHTML = "<p>There was an error fetching the service providers. Please try again later.</p>";
        });
}

function getAllBookings() {
    const bookingsContainer = document.querySelector('.bookings-container');
    const upcomingRelocation = document.querySelector('.upcoming-relocation');
    const id = bookingsContainer.dataset.id;
    bookingsContainer.innerHTML = "";
    upcomingRelocation.innerHTML = "";

    fetch(`http://localhost:3000/app/client/${id}/bookings`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                bookingsContainer.innerHTML = "<p>No bookings available.</p>";
                upcomingRelocation.innerHTML = "<p>No upcoming relocations.</p>";
            } else {
                bookingsContainer.innerHTML = data.map(booking => {
                    return `
                    <div class="booking">
                        <h3><span>Relocation Service</span> ${booking.service_name}</h3>
                        <p><span>Relocator: </span>${booking.provider_first_name} ${booking.provider_last_name}</p>
                        <p><span>Relocator Phone: </span>${booking.provider_phone}</p>
                        <p><span>Relocation Date</span>${booking.relocation_date}</p>
                        <p><span>From: </span>${booking.from_location}</p>
                        <p><span>To: </span>${booking.to_location}</p>
                        <p><span>Status: </span>${booking.status}</p>
                        <div class="booking-actions">
                            <form action="/app/cancel/${booking.id}" method="post" style="display: inline;">
                                <button type="submit" class="cancel">Cancel</button>
                            </form>
                            <form action="/app/delete/${booking.id}" method="post" style="display: inline;">
                                <button type="submit" class="cancel">Delete</button>
                            </form>
                        </div>
                    </div>
                    `;
                }).join(''); // Ensure correct HTML concatenation

                upcomingRelocation.innerHTML = data.map(booking => {
                    return `
                    <hr>
                    <div class="relocation">
                        <h3><span>Relocation Service</span> ${booking.service_name}</h3>
                        <p><span>Relocator: </span>${booking.provider_first_name} ${booking.provider_last_name}</p>
                        <p><span>Relocator Phone: </span>${booking.provider_phone}</p>
                        <p><span>Relocation Date</span>${booking.relocation_date}</p>
                        <p><span>From: </span>${booking.from_location}</p>
                        <p><span>To: </span>${booking.to_location}</p>
                        <p><span>Status: </span>${booking.status}</p>
                    </div>
                    `;
                    }).join('');
            }
        })
        .catch(error => {
            console.log('Fetch error:', error);
            bookingsContainer.innerHTML = "<p>There was an error fetching the bookings. Please try again later.</p>";
        });
}


getAllBookings();