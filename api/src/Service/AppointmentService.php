<?php

namespace App\Service;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Repository\RoomRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;

class AppointmentService
{
    public function __construct(private AppointmentRepository $appointmentRepository, private RoomRepository $roomRepository, private UserRepository $userRepository, private ManagerRegistry $doctrine, private SerializerInterface $serializer)
    {
    }

    public function filterPaginated($userid, Request $request): array
    {
        $filters = array_combine(
            ['dateFrom', 'dateTo', 'name', 'egn', 'details', 'room'],
            array_map(fn($param) => $request->query->get($param), ['dateFrom', 'dateTo', 'name', 'egn', 'details', 'room'])
        );

        $page = $request->query->get('page') ?: 1;

        $user = $this->userRepository->find($userid);
//check if user is admin and if not return their name in order to limit the appointments to their own
        $basicUserName = in_array("ROLE_ADMIN", $user->getRoles()) ? null : $user->getName();

        $queryBuilder = $this->appointmentRepository->applyFilters($basicUserName, $filters);

        ['paginator' => $paginator, 'pagesCount' => $pagesCount] = $this->appointmentRepository->paginateQuery($queryBuilder, $page);

        $appointments = $paginator->getIterator();

        if (!$appointments) {
            return [
                'error' => 'Failed to fetch',
                'code' => 500,
            ];
        }

        return [
            'message' => 'success',
            'code' => 200,
            'data' => $appointments,
            'pagesCount' => $pagesCount,
        ];


    }

    public function extendAppointment($appointment): array
    {
        return [
            'id' => $appointment->getId(),
            'date' => $appointment->getDate(),
            'details' => $appointment->getDetails(),
            'roomId' => $appointment->getRoom()->getId(),
            'name' => $appointment->getUser()->getName(),
            'egn' => $appointment->getUser()->getEgn()
        ];
    }

    public function filterName($userid, $appointmentId): array
    {
        $appointments = $this->userRepository->find($userid)->getAppointments()->toArray();

        $filteredAppointments = array_values(array_filter($appointments, function ($a) use ($appointmentId) {
            return $a->getId() !== $appointmentId && $a->getDate() > new DateTime();
        }));

        $extendedFilteredAppointments = $this->extendAppointmentList($filteredAppointments);

        return [
            'message' => 'success',
            'code' => 200,
            'data' => $extendedFilteredAppointments
        ];
    }

    public function extendAppointmentList($appointments): array
    {
        return array_map(function ($a) {
            return [
                'id' => $a->getId(),
                'date' => $a->getDate(),
                'details' => $a->getDetails(),
                'roomId' => $a->getRoom()->getId(),
                'name' => $a->getUser()->getName(),
                'egn' => $a->getUser()->getEgn()
            ];
        }, $appointments->toArray());
    }

    public function createAppointment($request): array
    {
        $appointment = $this->serializer->deserialize($request->getContent(), Appointment::class, 'json');

        ['userId' => $userId] = json_decode($request->getContent(), true);

        $user = $this->userRepository->find($userId);

        if (!$appointment) {
            return [
                'error' => 'Failed to add',
                'code' => 500,
            ];
        }

        $rooms = $this->roomRepository->findAll();
        $LIMIT = 8;
        $targetRoom = $rooms[0]->getSize() < $LIMIT ? $rooms[0] : null;

        for ($x = 0; $x < count($rooms); $x++) {
            if ($targetRoom && $rooms[$x]->getSize() < $targetRoom->getSize()) {
                if ($rooms[$x]->getSize() < $LIMIT) {
                    $targetRoom = $rooms[$x];
                }
            }
        }

        if (!$targetRoom) {
            return [
                'error' => 'All rooms are full',
                'code' => 500,
            ];
        }

        $appointment->setRoom($targetRoom);
        $appointment->setUser($user);

        $em = $this->doctrine->getManager();
        $em->persist($targetRoom);
        $em->persist($appointment);
        $em->persist($user);
        $em->flush();

        return [
            'message' => 'Appointment Added!',
            'code' => 200,
            'data' => ['groups' => 'appointment', 'user', 'room']
        ];

    }

    public function updateAppointment($appointment, $request): array
    {
        try {
            $em = $this->doctrine->getManager();

            $this->serializer->deserialize($request->getContent(), Appointment::class, 'json', ['object_to_populate' => $appointment]);

            $em->flush();

            $update = $this->appointmentRepository->find($appointment->getId());

            return [
                'message' => 'Appointment Updated!',
                'code' => 200,
                'data' => $update
            ];
        } catch (Exception $e) {
            return [
                'error' => 'Update Fail',
                'code' => 500,
            ];
        }
    }

    public function deleteAppointment($appointment): array
    {
        try {
            $em = $this->doctrine->getManager();
            $em->remove($appointment);
            $em->flush();

            return [
                'message' => 'Appointment Deleted!',
                'code' => 200,
                'data' => $appointment->getId()
            ];
        } catch (Exception $e) {
            return [
                'error' => 'Delete Fail',
                'code' => 500,
            ];
        }
    }

}