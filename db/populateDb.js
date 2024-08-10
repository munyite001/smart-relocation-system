const pool = require('./pool');


/**
 * 
 * Users

    user_id (Primary Key, INT, Auto Increment)
    first_name (VARCHAR)
    last_name (VARCHAR)
    email (VARCHAR, Unique)
    password (VARCHAR)
    phone_number (VARCHAR)
    created_at (TIMESTAMP)
    updated_at (TIMESTAMP)
 */

    /**
     * 
     * Service Providers
    provider_id (Primary Key, INT, Auto Increment)
    user_id (Foreign Key, INT, References Users(user_id))
    company_name (VARCHAR)
    company_address (VARCHAR)
    license_number (VARCHAR)
    created_at (TIMESTAMP)
     */

    /**
     * 
     * Bookings
    booking_id (Primary Key, INT, Auto Increment)
    service_id (Foreign Key, INT, References Relocation Services(service_id))
    client_id (Foreign Key, INT, References Users(user_id))
    booking_date (TIMESTAMP)
    relocation_date (DATE)
    status (ENUM: 'pending', 'confirmed', 'completed', 'cancelled')
    created_at (TIMESTAMP)
     */

    /**
     * 
     * Reviews

        review_id (Primary Key, INT, Auto Increment)
        service_id (Foreign Key, INT, References Relocation Services(service_id))
        client_id (Foreign Key, INT, References Users(user_id))
        rating (INT)
        comment (TEXT)
        created_at (TIMESTAMP)
     */
    /**
     * 
     * Relocation Services
    service_id (Primary Key, INT, Auto Increment)
    provider_id (Foreign Key, INT, References Service Providers(provider_id))
    service_name (VARCHAR)
    description (TEXT)
    price (DECIMAL)
    service_area (VARCHAR)
    created_at (TIMESTAMP)
     */

const SQL = `

    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
    CREATE TYPE review_rating AS ENUM ('1', '2', '3', '4', '5');

    CREATE TABLE IF NOT EXISTS clients (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email));

    CREATE TABLE IF NOT EXISTS service_providers (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        company_name VARCHAR(100),
        company_address VARCHAR(100),
        license_number VARCHAR(100),
        car_type VARCHAR(100)[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email));

    CREATE TABLE IF NOT EXISTS bookings (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        service_provider_id INT NOT NULL,
        client_id INT NOT NULL,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        relocation_date DATE NOT NULL,
        status booking_status DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_provider_id) REFERENCES service_providers(id),
        FOREIGN KEY (client_id) REFERENCES clients(id));

    CREATE TABLE IF NOT EXISTS relocation_services (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        service_provider_id INT NOT NULL,
        service_name VARCHAR(100) NOT NULL,
        description TEXT,
        price INT NOT NULL,
        service_area VARCHAR(100) NOT NULL,
        FOREIGN KEY (service_provider_id) REFERENCES service_providers(id));
 
    CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        service_provider_id INT NOT NULL,
        client_id INT NOT NULL,
        rating review_rating NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_provider_id) REFERENCES service_providers(id),
        FOREIGN KEY (client_id) REFERENCES clients(id));
`;


async function main() {
    try {
        console.log("Running the script...");
        await pool.query(SQL);
        console.log("Script executed successfully");
    } catch (err) {
        console.log("An error occured running the script: ", err)
    }
}


main()