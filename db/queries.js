const pool = require('./pool');
const bcrypt = require('bcryptjs');

//  Client Sign Up
async function createClient({ first_name, last_name, email, phone, password }) {

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO clients (first_name, last_name, email, phone_number, password) VALUES ($1, $2, $3, $4, $5);',
        [first_name, last_name, email, phone, hashedPassword]);
  
        return;
}

async function updateClient({ first_name, last_name, email, phone, password, id }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('UPDATE clients SET first_name = $1, last_name = $2, email = $3, phone_number = $4, password = $5 WHERE id = $6;',
        [first_name, last_name, email, phone, hashedPassword, id]);
    
        return;
}


//  GET ALL RELOCATION SERVICE PROVIDERS
async function getAllMovers() {
    const query = `
        SELECT sp.*, rs.service_name, rs.description, rs.price, rs.service_area
        FROM service_providers sp
        LEFT JOIN relocation_services rs ON sp.id = rs.service_provider_id;
    `;
    const { rows } = await pool.query(query);
    return rows;
}

async function getSingleMover(id) {
    const query = `
        SELECT 
            sp.id AS provider_id, 
            sp.first_name,
            sp.last_name,
            sp.company_name, 
            sp.company_address, 
            sp.license_number, 
            json_agg(
                json_build_object(
                    'service_name', rs.service_name,
                    'description', rs.description,
                    'price', rs.price,
                    'service_area', rs.service_area
                )
            ) AS services
            FROM 
            service_providers sp
            LEFT JOIN 
            relocation_services rs ON sp.id = rs.service_provider_id
            WHERE 
            sp.id = $1
            GROUP BY 
            sp.id;

    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0];
}


async function getAllBookings(id, type) {
    if (type === 'client') {
        const query = `
            SELECT bookings.*,
                service_providers.first_name AS provider_first_name,
                service_providers.last_name AS provider_last_name,
                service_providers.company_name AS provider_company_name,
                service_providers.phone_number AS provider_phone,
                clients.first_name AS client_first_name,
                clients.last_name AS client_last_name,
                clients.phone_number AS client_phone
            FROM bookings
            LEFT JOIN service_providers ON bookings.service_provider_id = service_providers.id
            LEFT JOIN clients ON bookings.client_id = clients.id
            WHERE bookings.client_id = $1;
        `;

        const { rows } = await pool.query(query, [id]);
        return rows;
    } else {
        const query = `
            SELECT bookings.*,
                service_providers.first_name AS provider_first_name,
                service_providers.last_name AS provider_last_name,
                service_providers.company_name AS provider_company_name,
                service_providers.phone_number AS provider_phone,
                clients.first_name AS client_first_name,
                clients.last_name AS client_last_name,
                clients.phone_number AS client_phone
            FROM bookings
            LEFT JOIN service_providers ON bookings.service_provider_id = service_providers.id
            LEFT JOIN clients ON bookings.client_id = clients.id
            WHERE bookings.service_provider_id = $1;
        `;

        const { rows } = await pool.query(query, [id]);
        return rows;
    }
}



async function createMover({first_name, last_name, email, phone, password}) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO service_providers (first_name, last_name, email, phone_number, password) VALUES ($1, $2, $3, $4, $5);',
        [first_name, last_name, email, phone, hashedPassword]);
  
        return;
}


async function updateMover({ first_name, last_name, email, phone, password, id }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('UPDATE service_providers SET first_name = $1, last_name = $2, email = $3, phone_number = $4, password = $5 WHERE id = $6;',
        [first_name, last_name, email, phone, hashedPassword, id]);
    
        return;
}

async function setCompanyDetails({ company_name, company_address, license_number, car_type, id }) {
    if (car_type == 'null') {
        await pool.query('UPDATE service_providers SET company_name = $1, company_address = $2, license_number = $3 WHERE id = $4;',
            [company_name, company_address, license_number, id]);
    }
    else {
        await pool.query('UPDATE service_providers SET company_name = $1, company_address = $2, license_number = $3, car_type = $4 WHERE id = $5;',
            [company_name, company_address, license_number, [car_type], id]);
    }

    return;
}

async function setServices({ service_provider_id, service_name, description, price, service_area }) {
    await pool.query('INSERT INTO relocation_services (service_provider_id, service_name, description, price, service_area) VALUES ($1, $2, $3, $4, $5);',
        [service_provider_id, service_name, description, price, service_area]);
}

async function getAllServices(id) {
    const { rows } = await pool.query('SELECT * FROM relocation_services WHERE service_provider_id = $1;', [id]);

    return rows;
}

async function create_booking({ provider_id, client_id, relocation_date, from_location, to_location, service_name }) {
    await pool.query('INSERT INTO bookings (service_provider_id, client_id, relocation_date, from_location, to_location, service_name) VALUES ($1, $2, $3, $4, $5, $6);',
        [provider_id, client_id, relocation_date, from_location, to_location, service_name]);
}

async function update_booking_status({ status, id }) {
    await pool.query('UPDATE bookings SET status = $1 WHERE id = $2;', [status, id]);

    return;
}


module.exports = {

    createClient,
    updateClient,
    getAllMovers,
    getAllBookings,
    createMover,
    updateMover,
    setCompanyDetails,
    setServices,
    getAllServices,
    getSingleMover,
    create_booking,
    update_booking_status,
}