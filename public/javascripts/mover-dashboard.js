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



// // GET ALL RELOCATION SERVICE PROVIDERS

// function getAllServiceProviders() {
//     const moversContainer = document.querySelector('.movers-container');
//     moversContainer.innerHTML = "";
    
//     fetch('http://localhost:3000/app/client/providers')
//         .then(response => response.json())
//         .then(data => {
//             if (data.length === 0) {
//                 moversContainer.innerHTML = "<p>No service providers available at the moment.</p>";
//             } else {
//                 moversContainer.innerHTML = data.map(mover => {
//                     return `
//                     <div class="mover">
//                         <h3>${mover.first_name} ${mover.last_name}</h3>
//                         <p>${mover.email}</p>
//                         <p>${mover.phone_number}</p>
//                         <button class="book" data-provider-id="${mover.id}">Book</button>
//                     </div>
//                     `;
//                 }).join('');
//             }
//         })
//         .catch(error => {
//             console.error('Fetch error:', error);
//             moversContainer.innerHTML = "<p>There was an error fetching the service providers. Please try again later.</p>";
//         });
// }

function getAllBookings() {
    const bookingsContainer = document.querySelector('.bookings-container');
    const upcomingRelocations = document.querySelector('.upcoming-relocations');
    const id = bookingsContainer.dataset.id;
    bookingsContainer.innerHTML = "";
    upcomingRelocations.innerHTML = "";

    fetch(`http://localhost:3000/app/mover/${id}/bookings`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                bookingsContainer.innerHTML = "<p>No bookings available.</p>";
                upcomingRelocations.innerHTML = "<p>No upcoming relocations.</p>";
            } else {
                bookingsContainer.innerHTML = data.map(booking => {
                    return `
                    <div class="booking">
                        <h3><span>Relocation Service</span> ${booking.service_name}</h3>
                        <p><span>Client: </span>${booking.client_first_name} ${booking.client_last_name}</p>
                        <p><span>Client Phone: </span>${booking.client_phone}</p>
                        <p><span>Relocation Date: </span>${booking.relocation_date}</p>
                        <p><span>From: </span>${booking.from_location}</p>
                        <p><span>To: </span>${booking.to_location}</p>
                        <p><span>Status: </span>${booking.status}</p>
                        <div class="booking-actions">
                            <!-- Cancel Booking Form -->
                            <form action="/app/cancel/${booking.id}" method="post" style="display: inline;">
                                <button type="submit" class="cancel">Cancel</button>
                            </form>

                            <!-- Confirm Booking Form -->
                            <form action="/app/mover/${id}/confirm/${booking.id}" method="post" style="display: inline;">
                                <button type="submit" class="confirm">Confirm</button>
                            </form>

                            <!-- Mark Completed Form -->
                            <form action="/app/mover/complete/${booking.id}" method="post" style="display: inline;">
                                <button type="submit" class="complete">Mark Completed</button>
                            </form>
                        </div>
                    </div>`;
                }).join(''); // Ensure correct HTML concatenation

                upcomingRelocations.innerHTML = data.map(booking => {
                    return `
                    <div class="relocation">
                        <h3><span>Relocation Service</span> ${booking.service_name}</h3>
                        <p><span>Client: </span>${booking.client_first_name} ${booking.client_last_name}</p>
                        <p><span>Client Phone: </span>${booking.client_phone}</p>
                        <p><span>Relcation Date</span>${booking.relocation_date}</p>
                        <p><span>From: </span>${booking.from_location}</p>
                        <p><span>To: </span>${booking.to_location}</p>
                        <p><span>Status: </span>${booking.status}</p>
                    </div>
                    `;
                    }).join('');

            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            bookingsContainer.innerHTML = "<p>There was an error fetching the bookings. Please try again later.</p>";
            upcomingRelocations.innerHTML = "<p>There was an error fetching the bookings. Please try again later.</p>";
        });
}

// Get all Relocation Services Offered By A Mover
function getAllServices() {
    const servicesOfferedContainer = document.querySelector('.services-offered');
    const id = servicesOfferedContainer.dataset.id;
    servicesOfferedContainer.innerHTML = "";

    fetch(`http://localhost:3000/app/mover/services/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                servicesOfferedContainer.innerHTML = "<p>You are currently not offering any services</p>";
            } else {
                servicesOfferedContainer.innerHTML = data.map(service => {
                    return `
                    <div class="service-offered">
                        <h3>${service.service_name}</h3>
                        <p>${service.description}</p>
                        <p>${service.price} KES</p>
                        <p>${service.service_area}</p>
                        <button class="remove" data-service-id="${service.id}">Remove</button>
                    </div>
                    `;
                }).join(''); // Ensure correct HTML concatenation
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            servicesOfferedContainer.innerHTML = "<p>There was an error fetching the services. Please try again later.</p>";
        });
}



getAllBookings();
getAllServices();