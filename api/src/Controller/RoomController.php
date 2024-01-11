<?php

namespace App\Controller;

use App\Entity\Room;
use App\Repository\RoomRepository;
use App\Service\AppointmentService;
use App\Service\AuthorizeService;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RoomController extends AbstractController
{
    #[Route('/{userid}/rooms', name: 'admin_rooms')]
    public function show($userid, Request $request, RoomRepository $roomRepository, AuthorizeService $authorizeService): Response
    {

        $authHeader = $request->headers->get('Authorization');
        $authToken = null;

        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $authToken = $matches[1];
        }
        dd($authHeader);
        $requestAdminAccess = $authorizeService->authorizeAdmin($userid, $request);
        if (
            $requestAdminAccess['access']
        ) {
            return $this->json($roomRepository->findAll());

        } else {
            return  $this->json($requestAdminAccess);
        }

    }

    #[Route('/{userid}/rooms/{roomid}/appointments', name: 'admin_room')]
    public function details($userid, #[MapEntity(id: 'roomid')]  Room $room,  Request $request, AppointmentService $appointmentService, AuthorizeService $authorizeService): Response
    {

        $requestAdminAccess = $authorizeService->authorizeAdmin($userid);

        if (
            $requestAdminAccess['access']
        ) {
            return $this->json($appointmentService->extendAppointmentList($room->getAppointments()->toArray()));
        } else {
            return  $this->json($requestAdminAccess);
        }

    }
}
