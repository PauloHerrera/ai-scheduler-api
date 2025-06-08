# ai-scheduler-api

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


## Class Diagram

```mermaid
classDiagram
    class Doctor {
	    String name
        String registration
        String expertise
        AppointmentType[] appointmentType
        Number appointmentPrice
    }
    class DoctorSchedule {
        Doctor doctor
        AppointmentType[] appointmentType
        String weekDay
        String startPeriod
        String finishPeriod
    }
    class DoctorBlockSchedule {
        Doctor doctor
	    Date data
        String blockStart
        String blockFinish
    }
    class Patient {
	    String name
        HealthPlan healthplan
    }
    class HealthPlan{
        String name
        Status status        
    }
    class Appointment {
	    Doctor doctor
        Patient patient
        bool returnAppointment
        AppointmentType appointmentType
        Date appointmentDate
    }
    class User {
        String email
        String document
        String password
        UserRole role
        Status status
    }

    class AppointmentType{
        <<enumeration>>
        PRIVATE
        HEALTH_PLAN
    }
    class Status{
        <<enumeration>>
        ACTIVE
        INACTIVE
        PENDING
        DELETED
    }
    class UserRole{
        <<enumeration>>
        DOCTOR
        PATIENT
        SYSTEM_USER
        SYSTEM_ADMIN
    }

    Doctor *--	Appointment
    Patient *--	Appointment
    HealthPlan o--	Patient
    Doctor *--	DoctorSchedule
    Doctor *--	DoctorBlockSchedule
    User <|-- Doctor
    User <|-- Patient

```

### Class diagram next steps:
1. Add medical specialty entity, the medical procedures related to that and also the preparation before the appointment.

## Doctor API Endpoints

Base path: `/api/doctors`

### `POST /`
Create a new doctor.
- **Request Body:**
  ```json
  {
    "name": "Dr. John Doe",
    "registration": "CRM123456",
    "expertise": "Cardiology",
    "appointmentType": ["PRIVATE", "HEALTH_PLAN"],
    "appointmentPrice": 200.50
  }
  ```
- **Responses:**
  - `201 Created`: Returns the created doctor object.
  - `400 Bad Request`: If required fields are missing.
  - `409 Conflict`: If a doctor with the same registration already exists.
  - `500 Internal Server Error`: If there's a server-side error.

### `GET /`
Get all doctors.
- **Responses:**
  - `200 OK`: Returns an array of doctor objects.
  - `500 Internal Server Error`: If there's a server-side error.

### `GET /:id`
Get a doctor by ID.
- **Parameters:**
  - `id` (string): The ID of the doctor.
- **Responses:**
  - `200 OK`: Returns the doctor object.
  - `404 Not Found`: If the doctor with the specified ID is not found.
  - `500 Internal Server Error`: If there's a server-side error.

### `PUT /:id`
Update a doctor by ID.
- **Parameters:**
  - `id` (string): The ID of the doctor to update.
- **Request Body:** Partial doctor object with fields to update.
  ```json
  {
    "name": "Dr. Jane Doe",
    "appointmentPrice": 250.00
  }
  ```
- **Responses:**
  - `200 OK`: Returns the updated doctor object.
  - `404 Not Found`: If the doctor with the specified ID is not found.
  - `409 Conflict`: If updating the registration to one that already exists.
  - `500 Internal Server Error`: If there's a server-side error.

### `DELETE /:id`
Delete a doctor by ID.
- **Parameters:**
  - `id` (string): The ID of the doctor to delete.
- **Responses:**
  - `200 OK`: Returns a success message and the deleted doctor object.
  - `404 Not Found`: If the doctor with the specified ID is not found.
  - `500 Internal Server Error`: If there's a server-side error.