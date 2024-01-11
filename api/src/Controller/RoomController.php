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
    #[Route('/rooms', name: 'api_admin_rooms')]
    public function show(Request $request, RoomRepository $roomRepository, AuthorizeService $authorizeService): Response
    {
        $requestAdminAccess = $authorizeService->authorizeAdmin($request);
        if (
            $requestAdminAccess['access']
        ) {
            return $this->json($roomRepository->findAll());

        } else {
            return $this->json($requestAdminAccess);
        }

    }

    #[Route('/rooms/{roomid}/appointments', name: 'api_admin_room')]
    public function details($roomid, Request $request, AppointmentService $appointmentService, AuthorizeService $authorizeService): Response
    {
        $requestAdminAccess = $authorizeService->authorizeAdmin($request);

        if (
            $requestAdminAccess['access']
        ) {
            return $this->json(
                $appointmentService->filterPaginated($request, $roomid),
            );
        } else {
            return $this->json($requestAdminAccess);
        }

    }
}
