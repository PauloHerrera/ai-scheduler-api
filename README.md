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