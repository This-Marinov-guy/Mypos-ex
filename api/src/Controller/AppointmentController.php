<?php

namespace App\Controller;

use App\Entity\Appointment;
use App\Service\AppointmentService;
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

	#[Route('/appointment-details/{id}', name: 'appointment_by_id', requirements: ['id' => '\d+'], methods: ['GET'])]
	public function details(Appointment $appointment, AppointmentService $appointmentService): JsonResponse
	{
		return $this->json(
			$appointmentService->extendAppointment($appointment)
		);
	}

	#[Route('/user-appointments/{userId}/{appointmentId}', name: 'appointment_by_name', methods: ['GET'])]
	public function findByName($userId, $appointmentId, AppointmentService $appointmentService): JsonResponse
	{
		return $this->json(
			$appointmentService->filterName($userId, $appointmentId)
		);

	}

	#[Route('/appointments/add', name: 'appointment_add')]
	public function create(AppointmentService $appointmentService, Request $request): JsonResponse
	{
		return $this->json($appointmentService->createAppointment($request));

	}

	#[Route('/appointments/edit/{appointment}', name: 'appointment_edit', methods: ['PUT'])]
	public function update(
		Appointment        $appointment,
		Request            $request,
		AppointmentService $appointmentService
	): JsonResponse {
		return $this->json($appointmentService->updateAppointment($appointment, $request));
	}

	#[Route('/appointments/delete/{appointment}', name: 'appointment_delete', methods: ['DELETE'])]
	public function delete(
		Appointment        $appointment,
		Request            $request,
		AppointmentService $appointmentService
	): JsonResponse {
		return $this->json($appointmentService->deleteAppointment($request, $appointment));
	}
}
