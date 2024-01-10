<?php

namespace App\Controller;

use App\Entity\Room;
use App\Repository\RoomRepository;
use App\Service\AppointmentService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RoomController extends AbstractController
{
    #[Route('/rooms', name: 'admin_rooms')]
    public function show(RoomRepository $roomRepository): Response
    {
        return $this->json($roomRepository->findAll());
    }

    #[Route('/rooms/{id}/appointments', name: 'admin_room')]
    public function details(Room $room, AppointmentService $appointmentService): Response
    {
        return $this->json($appointmentService->extendAppointmentList($room->getAppointments()->toArray()));
    }
}
