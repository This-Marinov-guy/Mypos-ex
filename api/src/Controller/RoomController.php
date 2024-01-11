<?php

namespace App\Controller;

use App\Entity\Room;
use App\Repository\RoomRepository;
use App\Service\AppointmentService;
use App\Service\AuthorizeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RoomController extends AbstractController
{
    #[Route('/{userid}/rooms', name: 'admin_rooms')]
    public function show($userid, Request $request, RoomRepository $roomRepository, AuthorizeService $authorizeService): Response
    {

        $requestAdminAccess = $authorizeService->authorizeAdmin($userid, $request);
        if (
            $requestAdminAccess['access']
        ) {
            return $this->json($roomRepository->findAll());

        } else {
            return $this->json($requestAdminAccess);
        }

    }

    #[Route('/{userid}/rooms/{roomid}/appointments', name: 'admin_room')]
    public function details($userid, $roomid, Request $request, AppointmentService $appointmentService, AuthorizeService $authorizeService): Response
    {
        $requestAdminAccess = $authorizeService->authorizeAdmin($userid, $request);

        if (
            $requestAdminAccess['access']
        ) {
            return $this->json(
                $appointmentService->filterPaginated($userid, $request, $roomid),
            );
        } else {
            return $this->json($requestAdminAccess);
        }

    }
}
