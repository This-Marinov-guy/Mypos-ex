<?php

namespace App\Controller;

use App\Entity\Appointment;
use App\Entity\User;
use App\Service\AppointmentService;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AppointmentController extends AbstractController
{
    #[Route('/appointments', name: 'appointments_list', methods: ['GET'])]
    public function show(AppointmentService $appointmentService, Request $request): JsonResponse
    {
        return $this->json(
            $appointmentService->filterPaginated($request),
        );
    }

    #[Route('/appointment/{appointmentId}', name: 'appointment_by_id', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function details(Appointment $appointment): JsonResponse
    {
        return $this->json(
            $appointment
        );
    }

    #[Route('/user-appointments/{appointmentId}', name: 'appointment_by_name', methods: ['GET'])]
    public function findByName(Appointment $appointment, AppointmentService $appointmentService): JsonResponse
    {
        return $this->json(
            $appointmentService->filterName($appointment)
        );
    }

    #[Route('/appointment/{user}/add', name: 'appointment_add')]
    public function create(User $user, AppointmentService $appointmentService,Request $request): JsonResponse
    {
        return $this->json($appointmentService->createAppointment($request, $user));
    }

    #[Route('/{userId}/appointment/edit/{appointmentId}', name: 'appointment_edit', methods: ['PUT'])]
    public function update(Appointment $appointment, Request $request, AppointmentService $appointmentService): JsonResponse
    {
        return $this->json($appointmentService->updateAppointment($appointment, $request));
    }

    #[Route('/{userId}/appointment/delete/{appointmentId}', name: 'appointment_delete', methods: ['DELETE'])]
    public function delete(Appointment $appointment, AppointmentService $appointmentService): JsonResponse
    {
        return $this->json($appointmentService->deleteAppointment($appointment));
    }
}
